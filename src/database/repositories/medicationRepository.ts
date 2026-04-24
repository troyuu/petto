import type { Scalar } from '@op-engineering/op-sqlite';
import { getDatabase } from '../connection';
import { generateId } from '@/utils/id';
import type { Medication, MedicationFrequency } from '@/utils/types';
import type { MedicationRow } from '../types';

function mapRow(row: MedicationRow): Medication {
  return {
    id: row.id,
    petId: row.pet_id,
    name: row.name,
    dosage: row.dosage,
    frequency: row.frequency as MedicationFrequency,
    customFrequencyDays: row.custom_frequency_days,
    timeOfDay: JSON.parse(row.time_of_day ?? '[]') as string[],
    startDate: row.start_date,
    endDate: row.end_date,
    isDeworming: row.is_deworming === 1,
    isActive: row.is_active === 1,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function getByPetId(petId: string): Medication[] {
  const db = getDatabase();
  const result = db.executeSync(
    'SELECT * FROM medications WHERE pet_id = ? ORDER BY created_at DESC',
    [petId],
  );
  const medications: Medication[] = [];
  if (result.rows && result.rows.length > 0) {
    for (let i = 0; i < result.rows.length; i++) {
      medications.push(mapRow(result.rows[i] as unknown as MedicationRow));
    }
  }
  return medications;
}

export function getActiveByPetId(petId: string): Medication[] {
  const db = getDatabase();
  const result = db.executeSync(
    'SELECT * FROM medications WHERE pet_id = ? AND is_active = 1 ORDER BY name ASC',
    [petId],
  );
  const medications: Medication[] = [];
  if (result.rows && result.rows.length > 0) {
    for (let i = 0; i < result.rows.length; i++) {
      medications.push(mapRow(result.rows[i] as unknown as MedicationRow));
    }
  }
  return medications;
}

export function create(data: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>): Medication {
  const db = getDatabase();
  const id = generateId();
  const now = new Date().toISOString();

  db.executeSync(
    `INSERT INTO medications (
      id, pet_id, name, dosage, frequency, custom_frequency_days,
      time_of_day, start_date, end_date, is_deworming, is_active,
      notes, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.petId,
      data.name,
      data.dosage ?? null,
      data.frequency,
      data.customFrequencyDays ?? null,
      JSON.stringify(data.timeOfDay),
      data.startDate,
      data.endDate ?? null,
      data.isDeworming ? 1 : 0,
      data.isActive ? 1 : 0,
      data.notes ?? null,
      now,
      now,
    ],
  );

  const result = db.executeSync('SELECT * FROM medications WHERE id = ?', [id]);
  return mapRow(result.rows![0] as unknown as MedicationRow);
}

export function update(id: string, data: Partial<Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>>): Medication | null {
  const db = getDatabase();
  const now = new Date().toISOString();

  const fields: string[] = [];
  const values: Scalar[] = [];

  if (data.petId !== undefined) { fields.push('pet_id = ?'); values.push(data.petId); }
  if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
  if (data.dosage !== undefined) { fields.push('dosage = ?'); values.push(data.dosage); }
  if (data.frequency !== undefined) { fields.push('frequency = ?'); values.push(data.frequency); }
  if (data.customFrequencyDays !== undefined) { fields.push('custom_frequency_days = ?'); values.push(data.customFrequencyDays); }
  if (data.timeOfDay !== undefined) { fields.push('time_of_day = ?'); values.push(JSON.stringify(data.timeOfDay)); }
  if (data.startDate !== undefined) { fields.push('start_date = ?'); values.push(data.startDate); }
  if (data.endDate !== undefined) { fields.push('end_date = ?'); values.push(data.endDate); }
  if (data.isDeworming !== undefined) { fields.push('is_deworming = ?'); values.push(data.isDeworming ? 1 : 0); }
  if (data.isActive !== undefined) { fields.push('is_active = ?'); values.push(data.isActive ? 1 : 0); }
  if (data.notes !== undefined) { fields.push('notes = ?'); values.push(data.notes); }

  if (fields.length === 0) {
    const result = db.executeSync('SELECT * FROM medications WHERE id = ?', [id]);
    if (result.rows && result.rows.length > 0) {
      return mapRow(result.rows[0] as unknown as MedicationRow);
    }
    return null;
  }

  fields.push('updated_at = ?');
  values.push(now);
  values.push(id);

  db.executeSync(`UPDATE medications SET ${fields.join(', ')} WHERE id = ?`, values);

  const result = db.executeSync('SELECT * FROM medications WHERE id = ?', [id]);
  if (result.rows && result.rows.length > 0) {
    return mapRow(result.rows[0] as unknown as MedicationRow);
  }
  return null;
}

export function deactivate(id: string): Medication | null {
  const db = getDatabase();
  const now = new Date().toISOString();

  db.executeSync(
    'UPDATE medications SET is_active = 0, updated_at = ? WHERE id = ?',
    [now, id],
  );

  const result = db.executeSync('SELECT * FROM medications WHERE id = ?', [id]);
  if (result.rows && result.rows.length > 0) {
    return mapRow(result.rows[0] as unknown as MedicationRow);
  }
  return null;
}
