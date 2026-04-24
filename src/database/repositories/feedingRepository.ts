import type { Scalar } from '@op-engineering/op-sqlite';
import { getDatabase } from '../connection';
import { generateId } from '@/utils/id';
import type { Feeding, FoodType, PortionUnit } from '@/utils/types';
import type { FeedingRow } from '../types';

function mapRow(row: FeedingRow): Feeding {
  return {
    id: row.id,
    petId: row.pet_id,
    foodType: row.food_type as FoodType,
    foodBrand: row.food_brand,
    portionSize: row.portion_size,
    portionUnit: row.portion_unit as PortionUnit,
    notes: row.notes,
    fedAt: row.fed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function getByPetId(petId: string): Feeding[] {
  const db = getDatabase();
  const result = db.executeSync(
    'SELECT * FROM feedings WHERE pet_id = ? ORDER BY fed_at DESC',
    [petId],
  );
  const feedings: Feeding[] = [];
  if (result.rows && result.rows.length > 0) {
    for (let i = 0; i < result.rows.length; i++) {
      feedings.push(mapRow(result.rows[i] as unknown as FeedingRow));
    }
  }
  return feedings;
}

export function getByDate(petId: string, date: string): Feeding[] {
  const db = getDatabase();
  const result = db.executeSync(
    'SELECT * FROM feedings WHERE pet_id = ? AND fed_at >= ? AND fed_at < ? ORDER BY fed_at ASC',
    [petId, `${date}T00:00:00.000Z`, `${date}T23:59:59.999Z`],
  );
  const feedings: Feeding[] = [];
  if (result.rows && result.rows.length > 0) {
    for (let i = 0; i < result.rows.length; i++) {
      feedings.push(mapRow(result.rows[i] as unknown as FeedingRow));
    }
  }
  return feedings;
}

export function getTodayByPet(petId: string): Feeding[] {
  const today = new Date().toISOString().split('T')[0];
  return getByDate(petId, today);
}

export function create(data: Omit<Feeding, 'id' | 'createdAt' | 'updatedAt'>): Feeding {
  const db = getDatabase();
  const id = generateId();
  const now = new Date().toISOString();

  db.executeSync(
    `INSERT INTO feedings (
      id, pet_id, food_type, food_brand, portion_size, portion_unit,
      notes, fed_at, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.petId,
      data.foodType,
      data.foodBrand ?? null,
      data.portionSize ?? null,
      data.portionUnit,
      data.notes ?? null,
      data.fedAt,
      now,
      now,
    ],
  );

  const result = db.executeSync('SELECT * FROM feedings WHERE id = ?', [id]);
  return mapRow(result.rows![0] as unknown as FeedingRow);
}

export function update(id: string, data: Partial<Omit<Feeding, 'id' | 'createdAt' | 'updatedAt'>>): Feeding | null {
  const db = getDatabase();
  const now = new Date().toISOString();

  const fields: string[] = [];
  const values: Scalar[] = [];

  if (data.petId !== undefined) { fields.push('pet_id = ?'); values.push(data.petId); }
  if (data.foodType !== undefined) { fields.push('food_type = ?'); values.push(data.foodType); }
  if (data.foodBrand !== undefined) { fields.push('food_brand = ?'); values.push(data.foodBrand); }
  if (data.portionSize !== undefined) { fields.push('portion_size = ?'); values.push(data.portionSize); }
  if (data.portionUnit !== undefined) { fields.push('portion_unit = ?'); values.push(data.portionUnit); }
  if (data.notes !== undefined) { fields.push('notes = ?'); values.push(data.notes); }
  if (data.fedAt !== undefined) { fields.push('fed_at = ?'); values.push(data.fedAt); }

  if (fields.length === 0) {
    const result = db.executeSync('SELECT * FROM feedings WHERE id = ?', [id]);
    if (result.rows && result.rows.length > 0) {
      return mapRow(result.rows[0] as unknown as FeedingRow);
    }
    return null;
  }

  fields.push('updated_at = ?');
  values.push(now);
  values.push(id);

  db.executeSync(`UPDATE feedings SET ${fields.join(', ')} WHERE id = ?`, values);

  const result = db.executeSync('SELECT * FROM feedings WHERE id = ?', [id]);
  if (result.rows && result.rows.length > 0) {
    return mapRow(result.rows[0] as unknown as FeedingRow);
  }
  return null;
}

export function remove(id: string): void {
  const db = getDatabase();
  db.executeSync('DELETE FROM feedings WHERE id = ?', [id]);
}
