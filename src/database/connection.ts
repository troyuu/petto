import { open, type DB } from '@op-engineering/op-sqlite';
import { DB_NAME } from '@/utils/constants';

let db: DB | null = null;

export function getDatabase(): DB {
  if (!db) {
    db = open({ name: DB_NAME });
    db.executeSync('PRAGMA journal_mode = WAL');
    db.executeSync('PRAGMA foreign_keys = ON');
  }
  return db;
}

export function closeDatabase(): void {
  if (db) {
    db.close();
    db = null;
  }
}
