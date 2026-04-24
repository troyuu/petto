import { getDatabase } from '../connection';
import { generateId } from '@/utils/id';
import type { MedicationLog, MedicationLogStatus } from '@/utils/types';
import type { MedicationLogRow } from '../types';

function mapRow(row: MedicationLogRow): MedicationLog {
  return {
    id: row.id,
    medicationId: row.medication_id,
    petId: row.pet_id,
    status: row.status as MedicationLogStatus,
    scheduledAt: row.scheduled_at,
    loggedAt: row.logged_at,
    notes: row.notes,
    createdAt: row.created_at,
  };
}

export function getByMedicationId(medicationId: string): MedicationLog[] {
  const db = getDatabase();
  const result = db.executeSync(
    'SELECT * FROM medication_logs WHERE medication_id = ? ORDER BY scheduled_at DESC',
    [medicationId],
  );
  const logs: MedicationLog[] = [];
  if (result.rows && result.rows.length > 0) {
    for (let i = 0; i < result.rows.length; i++) {
      logs.push(mapRow(result.rows[i] as unknown as MedicationLogRow));
    }
  }
  return logs;
}

export function logDose(
  medicationId: string,
  petId: string,
  status: MedicationLogStatus,
  scheduledAt?: string,
  notes?: string,
): MedicationLog {
  const db = getDatabase();
  const id = generateId();
  const now = new Date().toISOString();

  db.executeSync(
    `INSERT INTO medication_logs (
      id, medication_id, pet_id, status, scheduled_at, logged_at, notes, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      medicationId,
      petId,
      status,
      scheduledAt ?? now,
      status !== 'pending' ? now : null,
      notes ?? null,
      now,
    ],
  );

  const result = db.executeSync('SELECT * FROM medication_logs WHERE id = ?', [id]);
  return mapRow(result.rows![0] as unknown as MedicationLogRow);
}

export function getTodayByPetId(petId: string): MedicationLog[] {
  const db = getDatabase();
  const today = new Date().toISOString().split('T')[0];

  const result = db.executeSync(
    `SELECT * FROM medication_logs
     WHERE pet_id = ? AND scheduled_at >= ? AND scheduled_at < ?
     ORDER BY scheduled_at ASC`,
    [petId, `${today}T00:00:00.000Z`, `${today}T23:59:59.999Z`],
  );

  const logs: MedicationLog[] = [];
  if (result.rows && result.rows.length > 0) {
    for (let i = 0; i < result.rows.length; i++) {
      logs.push(mapRow(result.rows[i] as unknown as MedicationLogRow));
    }
  }
  return logs;
}
