import { useState, useEffect, useCallback } from 'react';
import { getSettings, updateSetting, resetAllData } from '@/db/settingsService';
import type { UserSettings } from '@/types';
import { DEFAULT_SETTINGS } from '@/types';

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    getSettings()
      .then((s) => {
        if (isMounted) {
          setSettings(s);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error('Error loading settings:', error);
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
      const s = await getSettings();
      setSettings(s);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const setDailyGoal = useCallback(async (value: number) => {
    await updateSetting('daily_goal_ml', value);
    setSettings((prev) => ({ ...prev, daily_goal_ml: value }));
  }, []);

  const setGlassSize = useCallback(async (value: number) => {
    await updateSetting('glass_size_ml', value);
    setSettings((prev) => ({ ...prev, glass_size_ml: value }));
  }, []);

  const resetData = useCallback(async () => {
    await resetAllData();
  }, []);

  return {
    settings,
    loading,
    setDailyGoal,
    setGlassSize,
    resetData,
    refresh,
  };
}
