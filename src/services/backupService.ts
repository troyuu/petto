import { Share, Platform } from 'react-native';
import { getDatabase } from '@/database/connection';

interface BackupData {
  version: number;
  exportedAt: string;
  tables: Record<string, unknown[]>;
}

const BACKUP_VERSION = 1;
const TABLE_NAMES = [
  'pets',
  'feedings',
  'vet_visits',
  'vaccinations',
  'medications',
  'medication_logs',
  'weight_entries',
  'expenses',
  'reminders',
] as const;

export async function exportAllData(): Promise<string> {
  const db = getDatabase();
  const backup: BackupData = {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    tables: {},
  };

  for (const table of TABLE_NAMES) {
    const result = db.executeSync(`SELECT * FROM ${table}`);
    backup.tables[table] = result.rows;
  }

  const json = JSON.stringify(backup, null, 2);

  await Share.share(
    Platform.OS === 'ios'
      ? { message: json }
      : { message: json, title: 'Petto Backup' },
  );

  return json;
}

export async function importData(jsonString: string): Promise<{ success: boolean; error?: string }> {
  try {
    const backup = JSON.parse(jsonString) as BackupData;

    if (!backup.version || !backup.tables) {
      return { success: false, error: 'Invalid backup file format' };
    }

    if (backup.version > BACKUP_VERSION) {
      return { success: false, error: 'Backup version is newer than app version' };
    }

    const db = getDatabase();

    db.executeSync('BEGIN TRANSACTION');

    try {
      // Clear existing data in reverse order (respect foreign keys)
      const reversedTables = [...TABLE_NAMES].reverse();
      for (const table of reversedTables) {
        db.executeSync(`DELETE FROM ${table}`);
      }

      // Insert data
      for (const table of TABLE_NAMES) {
        const rows = backup.tables[table];
        if (!Array.isArray(rows) || rows.length === 0) continue;

        for (const row of rows) {
          const record = row as Record<string, unknown>;
          const columns = Object.keys(record);
          const placeholders = columns.map(() => '?').join(', ');
          const values = columns.map(col => record[col]);

          db.executeSync(
            `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`,
            values as (string | number | null)[],
          );
        }
      }

      db.executeSync('COMMIT');
      return { success: true };
    } catch (innerError) {
      db.executeSync('ROLLBACK');
      const message = innerError instanceof Error ? innerError.message : 'Unknown error during import';
      return { success: false, error: message };
    }
  } catch (parseError) {
    const message = parseError instanceof Error ? parseError.message : 'Invalid JSON';
    return { success: false, error: `Failed to parse backup: ${message}` };
  }
}

export async function clearAllData(): Promise<void> {
  const db = getDatabase();
  const reversedTables = [...TABLE_NAMES].reverse();

  db.executeSync('BEGIN TRANSACTION');
  try {
    for (const table of reversedTables) {
      db.executeSync(`DELETE FROM ${table}`);
    }
    db.executeSync('COMMIT');
  } catch (error) {
    db.executeSync('ROLLBACK');
    throw error;
  }
}
