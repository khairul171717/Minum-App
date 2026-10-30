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
      const val = parseInt(row.value, 10);
      if (!isNaN(val) && val > 0) settings.daily_goal_ml = val;
    } else if (row.key === 'glass_size_ml') {
      const val = parseInt(row.value, 10);
      if (!isNaN(val) && val > 0) settings.glass_size_ml = val;
    } else if (row.key === 'weight_kg') {
      const val = parseFloat(row.value);
      if (!isNaN(val) && val > 0) settings.weight_kg = val;
    } else if (row.key === 'activity_level') {
      if (['low', 'normal', 'high'].includes(row.value)) {
        settings.activity_level = row.value as 'low' | 'normal' | 'high';
      }
    }
  }
  
  return settings;
}

export async function updateSetting(
  key: keyof UserSettings,
  value: number | string
): Promise<void> {
  const db = await getDatabase();
  await db.runAsync(
    'INSERT OR REPLACE INTO user_settings (key, value) VALUES (?, ?)',
    key,
    String(value)
  );
}

export async function resetAllData(): Promise<void> {
  const db = await getDatabase();
  await db.execAsync('DELETE FROM water_logs');
}
