import type { Scalar } from '@op-engineering/op-sqlite';
import { getDatabase } from '../connection';
import { generateId } from '@/utils/id';
import type { Reminder, ReminderType, RepeatPattern } from '@/utils/types';
import type { ReminderRow } from '../types';

function mapRow(row: ReminderRow): Reminder {
  return {
    id: row.id,
    petId: row.pet_id,
    type: row.type as ReminderType,
    referenceId: row.reference_id,
    title: row.title,
    body: row.body,
    scheduledAt: row.scheduled_at,
    notifeeId: row.notifee_id,
    repeatPattern: row.repeat_pattern as RepeatPattern,
    customIntervalDays: row.custom_interval_days,
    isComplete: row.is_complete === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function getByPetId(petId: string): Reminder[] {
  const db = getDatabase();
  const result = db.executeSync(
    'SELECT * FROM reminders WHERE pet_id = ? ORDER BY scheduled_at ASC',
    [petId],
  );
  const reminders: Reminder[] = [];
  if (result.rows && result.rows.length > 0) {
    for (let i = 0; i < result.rows.length; i++) {
      reminders.push(mapRow(result.rows[i] as unknown as ReminderRow));
    }
  }
  return reminders;
}

export function getUpcoming(petId?: string): Reminder[] {
  const db = getDatabase();
  const now = new Date().toISOString();
  let query = 'SELECT * FROM reminders WHERE is_complete = 0 AND scheduled_at >= ?';
  const params: Scalar[] = [now];

  if (petId) {
    query += ' AND pet_id = ?';
    params.push(petId);
  }

  query += ' ORDER BY scheduled_at ASC';

  const result = db.executeSync(query, params);
  const reminders: Reminder[] = [];
  if (result.rows && result.rows.length > 0) {
    for (let i = 0; i < result.rows.length; i++) {
      reminders.push(mapRow(result.rows[i] as unknown as ReminderRow));
    }
  }
  return reminders;
}

export function create(data: Omit<Reminder, 'id' | 'createdAt' | 'updatedAt'>): Reminder {
  const db = getDatabase();
  const id = generateId();
  const now = new Date().toISOString();

  db.executeSync(
    `INSERT INTO reminders (
      id, pet_id, type, reference_id, title, body, scheduled_at,
      notifee_id, repeat_pattern, custom_interval_days, is_complete,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.petId,
      data.type,
      data.referenceId ?? null,
      data.title,
      data.body ?? null,
      data.scheduledAt,
      data.notifeeId ?? null,
      data.repeatPattern,
      data.customIntervalDays ?? null,
      data.isComplete ? 1 : 0,
      now,
      now,
    ],
  );

  const result = db.executeSync('SELECT * FROM reminders WHERE id = ?', [id]);
  return mapRow(result.rows![0] as unknown as ReminderRow);
}

export function update(id: string, data: Partial<Omit<Reminder, 'id' | 'createdAt' | 'updatedAt'>>): Reminder | null {
  const db = getDatabase();
  const now = new Date().toISOString();

  const fields: string[] = [];
  const values: Scalar[] = [];

  if (data.petId !== undefined) { fields.push('pet_id = ?'); values.push(data.petId); }
  if (data.type !== undefined) { fields.push('type = ?'); values.push(data.type); }
  if (data.referenceId !== undefined) { fields.push('reference_id = ?'); values.push(data.referenceId); }
  if (data.title !== undefined) { fields.push('title = ?'); values.push(data.title); }
  if (data.body !== undefined) { fields.push('body = ?'); values.push(data.body); }
  if (data.scheduledAt !== undefined) { fields.push('scheduled_at = ?'); values.push(data.scheduledAt); }
  if (data.notifeeId !== undefined) { fields.push('notifee_id = ?'); values.push(data.notifeeId); }
  if (data.repeatPattern !== undefined) { fields.push('repeat_pattern = ?'); values.push(data.repeatPattern); }
  if (data.customIntervalDays !== undefined) { fields.push('custom_interval_days = ?'); values.push(data.customIntervalDays); }
  if (data.isComplete !== undefined) { fields.push('is_complete = ?'); values.push(data.isComplete ? 1 : 0); }

  if (fields.length === 0) {
    const result = db.executeSync('SELECT * FROM reminders WHERE id = ?', [id]);
    if (result.rows && result.rows.length > 0) {
      return mapRow(result.rows[0] as unknown as ReminderRow);
    }
    return null;
  }

  fields.push('updated_at = ?');
  values.push(now);
  values.push(id);

  db.executeSync(`UPDATE reminders SET ${fields.join(', ')} WHERE id = ?`, values);

  const result = db.executeSync('SELECT * FROM reminders WHERE id = ?', [id]);
  if (result.rows && result.rows.length > 0) {
    return mapRow(result.rows[0] as unknown as ReminderRow);
  }
  return null;
}

export function markComplete(id: string): Reminder | null {
  const db = getDatabase();
  const now = new Date().toISOString();

  db.executeSync(
    'UPDATE reminders SET is_complete = 1, updated_at = ? WHERE id = ?',
    [now, id],
  );

  const result = db.executeSync('SELECT * FROM reminders WHERE id = ?', [id]);
  if (result.rows && result.rows.length > 0) {
    return mapRow(result.rows[0] as unknown as ReminderRow);
  }
  return null;
}

export function deleteByReference(referenceId: string): void {
  const db = getDatabase();
  db.executeSync('DELETE FROM reminders WHERE reference_id = ?', [referenceId]);
}
