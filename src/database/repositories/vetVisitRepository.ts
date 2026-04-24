import type { Scalar } from '@op-engineering/op-sqlite';
import { getDatabase } from '../connection';
import { generateId } from '@/utils/id';
import type { VetVisit, VetVisitPurpose } from '@/utils/types';
import type { VetVisitRow } from '../types';

function mapRow(row: VetVisitRow): VetVisit {
  return {
    id: row.id,
    petId: row.pet_id,
    purpose: row.purpose as VetVisitPurpose,
    clinicName: row.clinic_name,
    vetName: row.vet_name,
    visitDate: row.visit_date,
    notes: row.notes,
    cost: row.cost,
    currency: row.currency,
    photoUris: JSON.parse(row.photo_uris ?? '[]') as string[],
    nextVisitDate: row.next_visit_date,
    reminderEnabled: row.reminder_enabled === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function getByPetId(petId: string): VetVisit[] {
  const db = getDatabase();
  const result = db.executeSync(
    'SELECT * FROM vet_visits WHERE pet_id = ? ORDER BY visit_date DESC',
    [petId],
  );
  const visits: VetVisit[] = [];
  if (result.rows && result.rows.length > 0) {
    for (let i = 0; i < result.rows.length; i++) {
      visits.push(mapRow(result.rows[i] as unknown as VetVisitRow));
    }
  }
  return visits;
}

export function getUpcoming(petId?: string): VetVisit[] {
  const db = getDatabase();
  const now = new Date().toISOString();
  let query = 'SELECT * FROM vet_visits WHERE visit_date >= ?';
  const params: Scalar[] = [now];

  if (petId) {
    query += ' AND pet_id = ?';
    params.push(petId);
  }

  query += ' ORDER BY visit_date ASC';

  const result = db.executeSync(query, params);
  const visits: VetVisit[] = [];
  if (result.rows && result.rows.length > 0) {
    for (let i = 0; i < result.rows.length; i++) {
      visits.push(mapRow(result.rows[i] as unknown as VetVisitRow));
    }
  }
  return visits;
}

export function getPast(petId?: string): VetVisit[] {
  const db = getDatabase();
  const now = new Date().toISOString();
  let query = 'SELECT * FROM vet_visits WHERE visit_date < ?';
  const params: Scalar[] = [now];

  if (petId) {
    query += ' AND pet_id = ?';
    params.push(petId);
  }

  query += ' ORDER BY visit_date DESC';

  const result = db.executeSync(query, params);
  const visits: VetVisit[] = [];
  if (result.rows && result.rows.length > 0) {
    for (let i = 0; i < result.rows.length; i++) {
      visits.push(mapRow(result.rows[i] as unknown as VetVisitRow));
    }
  }
  return visits;
}

export function create(data: Omit<VetVisit, 'id' | 'createdAt' | 'updatedAt'>): VetVisit {
  const db = getDatabase();
  const id = generateId();
  const now = new Date().toISOString();

  db.executeSync(
    `INSERT INTO vet_visits (
      id, pet_id, purpose, clinic_name, vet_name, visit_date, notes,
      cost, currency, photo_uris, next_visit_date, reminder_enabled,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.petId,
      data.purpose,
      data.clinicName ?? null,
      data.vetName ?? null,
      data.visitDate,
      data.notes ?? null,
      data.cost ?? null,
      data.currency,
      JSON.stringify(data.photoUris),
      data.nextVisitDate ?? null,
      data.reminderEnabled ? 1 : 0,
      now,
      now,
    ],
  );

  const result = db.executeSync('SELECT * FROM vet_visits WHERE id = ?', [id]);
  return mapRow(result.rows![0] as unknown as VetVisitRow);
}

export function update(id: string, data: Partial<Omit<VetVisit, 'id' | 'createdAt' | 'updatedAt'>>): VetVisit | null {
  const db = getDatabase();
  const now = new Date().toISOString();

  const fields: string[] = [];
  const values: Scalar[] = [];

  if (data.petId !== undefined) { fields.push('pet_id = ?'); values.push(data.petId); }
  if (data.purpose !== undefined) { fields.push('purpose = ?'); values.push(data.purpose); }
  if (data.clinicName !== undefined) { fields.push('clinic_name = ?'); values.push(data.clinicName); }
  if (data.vetName !== undefined) { fields.push('vet_name = ?'); values.push(data.vetName); }
  if (data.visitDate !== undefined) { fields.push('visit_date = ?'); values.push(data.visitDate); }
  if (data.notes !== undefined) { fields.push('notes = ?'); values.push(data.notes); }
  if (data.cost !== undefined) { fields.push('cost = ?'); values.push(data.cost); }
  if (data.currency !== undefined) { fields.push('currency = ?'); values.push(data.currency); }
  if (data.photoUris !== undefined) { fields.push('photo_uris = ?'); values.push(JSON.stringify(data.photoUris)); }
  if (data.nextVisitDate !== undefined) { fields.push('next_visit_date = ?'); values.push(data.nextVisitDate); }
  if (data.reminderEnabled !== undefined) { fields.push('reminder_enabled = ?'); values.push(data.reminderEnabled ? 1 : 0); }

  if (fields.length === 0) {
    const result = db.executeSync('SELECT * FROM vet_visits WHERE id = ?', [id]);
    if (result.rows && result.rows.length > 0) {
      return mapRow(result.rows[0] as unknown as VetVisitRow);
    }
    return null;
  }

  fields.push('updated_at = ?');
  values.push(now);
  values.push(id);

  db.executeSync(`UPDATE vet_visits SET ${fields.join(', ')} WHERE id = ?`, values);

  const result = db.executeSync('SELECT * FROM vet_visits WHERE id = ?', [id]);
  if (result.rows && result.rows.length > 0) {
    return mapRow(result.rows[0] as unknown as VetVisitRow);
  }
  return null;
}

export function remove(id: string): void {
  const db = getDatabase();
  db.executeSync('DELETE FROM vet_visits WHERE id = ?', [id]);
}
