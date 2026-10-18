import { useState, useEffect, useCallback } from 'react';
import {
  addWaterIntake,
  getTodayLogs,
  getTodayTotal,
  deleteWaterLog,
  getWeeklyStats,
  getMonthlyStats,
} from '@/db/waterService';
import { getSettings } from '@/db/settingsService';
import { syncWidgetData } from '@/widgets/widgetSync';
import type { WaterLog, DailyStats } from '@/types';

export function useWaterIntake() {
  const [todayTotal, setTodayTotal] = useState(0);
  const [todayLogs, setTodayLogs] = useState<WaterLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    Promise.all([getTodayTotal(), getTodayLogs(), getSettings()])
      .then(([total, logs, settings]) => {
        if (isMounted) {
          setTodayTotal(total);
          setTodayLogs(logs);
          setLoading(false);
          syncWidgetData(total, settings.daily_goal_ml);
        }
      })
      .catch((error) => {
        console.error('Error loading initial water intake:', error);
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const refresh = useCallback(async () => {
    try {
      const [total, logs, settings] = await Promise.all([
        getTodayTotal(),
        getTodayLogs(),
        getSettings(),
      ]);
      setTodayTotal(total);
      setTodayLogs(logs);
      // Sync data to widget
      syncWidgetData(total, settings.daily_goal_ml);
    } catch (error) {
      console.error('Error refreshing water intake:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addIntake = useCallback(
    async (amount_ml: number) => {
      try {
        await addWaterIntake(amount_ml);
        await refresh();
      } catch (error) {
        console.error('Error adding water intake:', error);
      }
    },
    [refresh]
  );

  const removeIntake = useCallback(
    async (id: number) => {
      try {
        await deleteWaterLog(id);
        await refresh();
      } catch (error) {
        console.error('Error removing water intake:', error);
      }
    },
    [refresh]
  );

  return {
    todayTotal,
    todayLogs,
    loading,
    addIntake,
    removeIntake,
    refresh,
  };
}

export function useWaterStats() {
  const [weeklyStats, setWeeklyStats] = useState<DailyStats[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<DailyStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    Promise.all([getWeeklyStats(), getMonthlyStats()])
      .then(([weekly, monthly]) => {
        if (isMounted) {
          setWeeklyStats(weekly);
          setMonthlyStats(monthly);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error('Error loading initial water stats:', error);
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const refresh = useCallback(async () => {
    try {
      const [weekly, monthly] = await Promise.all([
        getWeeklyStats(),
        getMonthlyStats(),
      ]);
      setWeeklyStats(weekly);
      setMonthlyStats(monthly);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    weeklyStats,
    monthlyStats,
    loading,
    refresh,
  };
}
