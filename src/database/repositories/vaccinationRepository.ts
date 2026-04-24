import type { Scalar } from '@op-engineering/op-sqlite';
import { getDatabase } from '../connection';
import { generateId } from '@/utils/id';
import type { Vaccination } from '@/utils/types';
import type { VaccinationRow } from '../types';

function mapRow(row: VaccinationRow): Vaccination {
  return {
    id: row.id,
    petId: row.pet_id,
    vetVisitId: row.vet_visit_id,
    name: row.name,
    dateAdministered: row.date_administered,
    batchNumber: row.batch_number,
    nextDueDate: row.next_due_date,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function getByPetId(petId: string): Vaccination[] {
  const db = getDatabase();
  const result = db.executeSync(
    'SELECT * FROM vaccinations WHERE pet_id = ? ORDER BY date_administered DESC',
    [petId],
  );
  const vaccinations: Vaccination[] = [];
  if (result.rows && result.rows.length > 0) {
    for (let i = 0; i < result.rows.length; i++) {
      vaccinations.push(mapRow(result.rows[i] as unknown as VaccinationRow));
    }
  }
  return vaccinations;
}

export function getUpcoming(petId?: string): Vaccination[] {
  const db = getDatabase();
  const now = new Date().toISOString();
  let query = 'SELECT * FROM vaccinations WHERE next_due_date IS NOT NULL AND next_due_date >= ?';
  const params: Scalar[] = [now];

  if (petId) {
    query += ' AND pet_id = ?';
    params.push(petId);
  }

  query += ' ORDER BY next_due_date ASC';

  const result = db.executeSync(query, params);
  const vaccinations: Vaccination[] = [];
  if (result.rows && result.rows.length > 0) {
    for (let i = 0; i < result.rows.length; i++) {
      vaccinations.push(mapRow(result.rows[i] as unknown as VaccinationRow));
    }
  }
  return vaccinations;
}

export function create(data: Omit<Vaccination, 'id' | 'createdAt' | 'updatedAt'>): Vaccination {
  const db = getDatabase();
  const id = generateId();
  const now = new Date().toISOString();

  db.executeSync(
    `INSERT INTO vaccinations (
      id, pet_id, vet_visit_id, name, date_administered, batch_number,
      next_due_date, notes, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.petId,
      data.vetVisitId ?? null,
      data.name,
      data.dateAdministered,
      data.batchNumber ?? null,
      data.nextDueDate ?? null,
      data.notes ?? null,
      now,
      now,
    ],
  );

  const result = db.executeSync('SELECT * FROM vaccinations WHERE id = ?', [id]);
  return mapRow(result.rows![0] as unknown as VaccinationRow);
}

export function update(id: string, data: Partial<Omit<Vaccination, 'id' | 'createdAt' | 'updatedAt'>>): Vaccination | null {
  const db = getDatabase();
  const now = new Date().toISOString();

  const fields: string[] = [];
  const values: Scalar[] = [];

  if (data.petId !== undefined) { fields.push('pet_id = ?'); values.push(data.petId); }
  if (data.vetVisitId !== undefined) { fields.push('vet_visit_id = ?'); values.push(data.vetVisitId); }
  if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
  if (data.dateAdministered !== undefined) { fields.push('date_administered = ?'); values.push(data.dateAdministered); }
  if (data.batchNumber !== undefined) { fields.push('batch_number = ?'); values.push(data.batchNumber); }
  if (data.nextDueDate !== undefined) { fields.push('next_due_date = ?'); values.push(data.nextDueDate); }
  if (data.notes !== undefined) { fields.push('notes = ?'); values.push(data.notes); }

  if (fields.length === 0) {
    const result = db.executeSync('SELECT * FROM vaccinations WHERE id = ?', [id]);
    if (result.rows && result.rows.length > 0) {
      return mapRow(result.rows[0] as unknown as VaccinationRow);
    }
    return null;
  }

  fields.push('updated_at = ?');
  values.push(now);
  values.push(id);

  db.executeSync(`UPDATE vaccinations SET ${fields.join(', ')} WHERE id = ?`, values);

  const result = db.executeSync('SELECT * FROM vaccinations WHERE id = ?', [id]);
  if (result.rows && result.rows.length > 0) {
    return mapRow(result.rows[0] as unknown as VaccinationRow);
  }
  return null;
}

export function remove(id: string): void {
  const db = getDatabase();
  db.executeSync('DELETE FROM vaccinations WHERE id = ?', [id]);
}
