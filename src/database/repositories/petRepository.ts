import type { Scalar } from '@op-engineering/op-sqlite';
import { getDatabase } from '../connection';
import { generateId } from '@/utils/id';
import type { Pet, PetType, Sex, WeightUnit } from '@/utils/types';
import type { PetRow } from '../types';

function mapRow(row: PetRow): Pet {
  return {
    id: row.id,
    name: row.name,
    petType: row.pet_type as PetType,
    breed: row.breed,
    birthday: row.birthday,
    sex: row.sex as Sex,
    color: row.color,
    weight: row.weight,
    weightUnit: row.weight_unit as WeightUnit,
    microchipNumber: row.microchip_number,
    photoUri: row.photo_uri,
    ownerName: row.owner_name,
    ownerContact: row.owner_contact,
    allergies: JSON.parse(row.allergies ?? '[]') as string[],
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function getAll(): Pet[] {
  const db = getDatabase();
  const result = db.executeSync('SELECT * FROM pets ORDER BY name ASC');
  const pets: Pet[] = [];
  if (result.rows && result.rows.length > 0) {
    for (let i = 0; i < result.rows.length; i++) {
      pets.push(mapRow(result.rows[i] as unknown as PetRow));
    }
  }
  return pets;
}

export function getById(id: string): Pet | null {
  const db = getDatabase();
  const result = db.executeSync('SELECT * FROM pets WHERE id = ?', [id]);
  if (result.rows && result.rows.length > 0) {
    return mapRow(result.rows[0] as unknown as PetRow);
  }
  return null;
}

export function create(data: Omit<Pet, 'id' | 'createdAt' | 'updatedAt'>): Pet {
  const db = getDatabase();
  const id = generateId();
  const now = new Date().toISOString();

  db.executeSync(
    `INSERT INTO pets (
      id, name, pet_type, breed, birthday, sex, color, weight, weight_unit,
      microchip_number, photo_uri, owner_name, owner_contact, allergies, notes,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.name,
      data.petType,
      data.breed ?? null,
      data.birthday ?? null,
      data.sex,
      data.color ?? null,
      data.weight ?? null,
      data.weightUnit,
      data.microchipNumber ?? null,
      data.photoUri ?? null,
      data.ownerName ?? null,
      data.ownerContact ?? null,
      JSON.stringify(data.allergies),
      data.notes ?? null,
      now,
      now,
    ],
  );

  return getById(id)!;
}

export function update(id: string, data: Partial<Omit<Pet, 'id' | 'createdAt' | 'updatedAt'>>): Pet | null {
  const db = getDatabase();
  const now = new Date().toISOString();

  const fields: string[] = [];
  const values: Scalar[] = [];

  if (data.name !== undefined) { fields.push('name = ?'); values.push(data.name); }
  if (data.petType !== undefined) { fields.push('pet_type = ?'); values.push(data.petType); }
  if (data.breed !== undefined) { fields.push('breed = ?'); values.push(data.breed); }
  if (data.birthday !== undefined) { fields.push('birthday = ?'); values.push(data.birthday); }
  if (data.sex !== undefined) { fields.push('sex = ?'); values.push(data.sex); }
  if (data.color !== undefined) { fields.push('color = ?'); values.push(data.color); }
  if (data.weight !== undefined) { fields.push('weight = ?'); values.push(data.weight); }
  if (data.weightUnit !== undefined) { fields.push('weight_unit = ?'); values.push(data.weightUnit); }
  if (data.microchipNumber !== undefined) { fields.push('microchip_number = ?'); values.push(data.microchipNumber); }
  if (data.photoUri !== undefined) { fields.push('photo_uri = ?'); values.push(data.photoUri); }
  if (data.ownerName !== undefined) { fields.push('owner_name = ?'); values.push(data.ownerName); }
  if (data.ownerContact !== undefined) { fields.push('owner_contact = ?'); values.push(data.ownerContact); }
  if (data.allergies !== undefined) { fields.push('allergies = ?'); values.push(JSON.stringify(data.allergies)); }
  if (data.notes !== undefined) { fields.push('notes = ?'); values.push(data.notes); }

  if (fields.length === 0) {
    return getById(id);
  }

  fields.push('updated_at = ?');
  values.push(now);
  values.push(id);

  db.executeSync(`UPDATE pets SET ${fields.join(', ')} WHERE id = ?`, values);

  return getById(id);
}

export function remove(id: string): void {
  const db = getDatabase();
  db.executeSync('DELETE FROM pets WHERE id = ?', [id]);
}
