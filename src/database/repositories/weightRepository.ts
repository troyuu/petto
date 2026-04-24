import { getDatabase } from '../connection';
import { generateId } from '@/utils/id';
import type { WeightEntry, WeightUnit } from '@/utils/types';
import type { WeightEntryRow } from '../types';

function mapRow(row: WeightEntryRow): WeightEntry {
  return {
    id: row.id,
    petId: row.pet_id,
    weight: row.weight,
    unit: row.unit as WeightUnit,
    measuredAt: row.measured_at,
    notes: row.notes,
    createdAt: row.created_at,
  };
}

export function getByPetId(petId: string): WeightEntry[] {
  const db = getDatabase();
  const result = db.executeSync(
    'SELECT * FROM weight_entries WHERE pet_id = ? ORDER BY measured_at DESC',
    [petId],
  );
  const entries: WeightEntry[] = [];
  if (result.rows && result.rows.length > 0) {
    for (let i = 0; i < result.rows.length; i++) {
      entries.push(mapRow(result.rows[i] as unknown as WeightEntryRow));
    }
  }
  return entries;
}

export function getLatest(petId: string): WeightEntry | null {
  const db = getDatabase();
  const result = db.executeSync(
    'SELECT * FROM weight_entries WHERE pet_id = ? ORDER BY measured_at DESC LIMIT 1',
    [petId],
  );
  if (result.rows && result.rows.length > 0) {
    return mapRow(result.rows[0] as unknown as WeightEntryRow);
  }
  return null;
}

export function create(data: Omit<WeightEntry, 'id' | 'createdAt'>): WeightEntry {
  const db = getDatabase();
  const id = generateId();
  const now = new Date().toISOString();

  db.executeSync(
    `INSERT INTO weight_entries (
      id, pet_id, weight, unit, measured_at, notes, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.petId,
      data.weight,
      data.unit,
      data.measuredAt,
      data.notes ?? null,
      now,
    ],
  );

  const result = db.executeSync('SELECT * FROM weight_entries WHERE id = ?', [id]);
  return mapRow(result.rows![0] as unknown as WeightEntryRow);
}

export function remove(id: string): void {
  const db = getDatabase();
  db.executeSync('DELETE FROM weight_entries WHERE id = ?', [id]);
}
