import type { DB } from '@op-engineering/op-sqlite';
import { migration001 } from './001_initial';

interface Migration {
  version: number;
  up: (db: DB) => void;
}

const migrations: Migration[] = [migration001];

export function runMigrations(db: DB): void {
  db.executeSync(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version INTEGER PRIMARY KEY,
      applied_at TEXT NOT NULL
    );
  `);

  const result = db.executeSync(
    'SELECT version FROM schema_migrations ORDER BY version ASC',
  );
  const appliedVersions = new Set<number>();
  for (const row of result.rows) {
    appliedVersions.add(row.version as number);
  }

  for (const migration of migrations) {
    if (appliedVersions.has(migration.version)) {
      continue;
    }

    db.executeSync('BEGIN TRANSACTION');
    try {
      migration.up(db);
      db.executeSync(
        'INSERT OR IGNORE INTO schema_migrations (version, applied_at) VALUES (?, ?)',
        [migration.version, new Date().toISOString()],
      );
      db.executeSync('COMMIT');
    } catch (error) {
      db.executeSync('ROLLBACK');
      throw new Error(
        `Migration ${migration.version} failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }
}
