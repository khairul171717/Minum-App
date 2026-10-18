import * as SQLite from 'expo-sqlite';

const DB_NAME = 'mynum.db';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  db = await SQLite.openDatabaseAsync(DB_NAME);
  await initDatabase(db);
  return db;
}

async function initDatabase(database: SQLite.SQLiteDatabase): Promise<void> {
  await database.execAsync(`
    PRAGMA journal_mode = WAL;
    
    CREATE TABLE IF NOT EXISTS water_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      amount_ml INTEGER NOT NULL,
      timestamp TEXT NOT NULL DEFAULT (datetime('now')),
      date TEXT NOT NULL DEFAULT (date('now', 'localtime'))
    );
    
    CREATE INDEX IF NOT EXISTS idx_water_logs_date ON water_logs(date);
    
    CREATE TABLE IF NOT EXISTS user_settings (
      key TEXT PRIMARY KEY NOT NULL,
      value TEXT NOT NULL
    );
  `);

  // Set default settings if not exist
  const result = await database.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM user_settings'
  );
  
  if (result && result.count === 0) {
    await database.runAsync(
      'INSERT OR IGNORE INTO user_settings (key, value) VALUES (?, ?)',
      'daily_goal_ml', '2000'
    );
    await database.runAsync(
      'INSERT OR IGNORE INTO user_settings (key, value) VALUES (?, ?)',
      'glass_size_ml', '250'
    );
  }
}

export function getTodayDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
}
