import { getDatabase } from './database';
import type { UserSettings } from '@/types';
import { DEFAULT_SETTINGS } from '@/types';

export async function getSettings(): Promise<UserSettings> {
  const db = await getDatabase();
  
  const rows = await db.getAllAsync<{ key: string; value: string }>(
    'SELECT key, value FROM user_settings'
  );
  
  const settings: UserSettings = { ...DEFAULT_SETTINGS };
  
  for (const row of rows) {
    if (row.key === 'daily_goal_ml') {
      settings.daily_goal_ml = parseInt(row.value, 10);
    } else if (row.key === 'glass_size_ml') {
      settings.glass_size_ml = parseInt(row.value, 10);
    }
  }
  
  return settings;
}

export async function updateSetting(key: keyof UserSettings, value: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'INSERT OR REPLACE INTO user_settings (key, value) VALUES (?, ?)',
    key, String(value)
  );
}

export async function resetAllData(): Promise<void> {
  const db = await getDatabase();
  await db.execAsync('DELETE FROM water_logs');
}
