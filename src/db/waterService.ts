import { getDatabase, getTodayDate } from './database';
import type { WaterLog, DailyStats } from '@/types';

export async function addWaterIntake(amount_ml: number): Promise<WaterLog> {
  const db = await getDatabase();
  const now = new Date();
  const timestamp = now.toISOString();
  const date = getTodayDate();
  
  const result = await db.runAsync(
    'INSERT INTO water_logs (amount_ml, timestamp, date) VALUES (?, ?, ?)',
    amount_ml, timestamp, date
  );
  
  return {
    id: result.lastInsertRowId,
    amount_ml,
    timestamp,
    date,
  };
}

export async function getTodayLogs(): Promise<WaterLog[]> {
  const db = await getDatabase();
  const date = getTodayDate();
  
  return db.getAllAsync<WaterLog>(
    'SELECT * FROM water_logs WHERE date = ? ORDER BY timestamp DESC',
    date
  );
}

export async function getTodayTotal(): Promise<number> {
  const db = await getDatabase();
  const date = getTodayDate();
  
  const result = await db.getFirstAsync<{ total: number | null }>(
    'SELECT SUM(amount_ml) as total FROM water_logs WHERE date = ?',
    date
  );
  
  return result?.total ?? 0;
}

export async function deleteWaterLog(id: number): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM water_logs WHERE id = ?', id);
}

export async function getWeeklyStats(): Promise<DailyStats[]> {
  const db = await getDatabase();
  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(today.getDate() - 6);
  // Get all days in range including days with 0
  const stats: DailyStats[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekAgo);
    d.setDate(weekAgo.getDate() + i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    
    const result = await db.getFirstAsync<{ total: number | null; count: number }>(
      'SELECT COALESCE(SUM(amount_ml), 0) as total, COUNT(*) as count FROM water_logs WHERE date = ?',
      dateStr
    );
    
    stats.push({
      date: dateStr,
      total_ml: result?.total ?? 0,
      entries_count: result?.count ?? 0,
    });
  }
  
  return stats;
}

export async function getMonthlyStats(): Promise<DailyStats[]> {
  const db = await getDatabase();
  const today = new Date();
  const monthAgo = new Date(today);
  monthAgo.setDate(today.getDate() - 29);
  
  const stats: DailyStats[] = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date(monthAgo);
    d.setDate(monthAgo.getDate() + i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    
    const result = await db.getFirstAsync<{ total: number | null; count: number }>(
      'SELECT COALESCE(SUM(amount_ml), 0) as total, COUNT(*) as count FROM water_logs WHERE date = ?',
      dateStr
    );
    
    stats.push({
      date: dateStr,
      total_ml: result?.total ?? 0,
      entries_count: result?.count ?? 0,
    });
  }
  
  return stats;
}
