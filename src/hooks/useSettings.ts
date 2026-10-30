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

  const setWeight = useCallback(async (value: number) => {
    await updateSetting('weight_kg', value);
    setSettings((prev) => ({ ...prev, weight_kg: value }));
  }, []);

  const setActivityLevel = useCallback(
    async (value: 'low' | 'normal' | 'high') => {
      await updateSetting('activity_level', value);
      setSettings((prev) => ({ ...prev, activity_level: value }));
    },
    []
  );

  const applyWeightCalculatedGoal = useCallback(
    async (
      weightKg: number,
      activityLevel: 'low' | 'normal' | 'high' = 'normal'
    ) => {
      const multiplier =
        activityLevel === 'low' ? 30 : activityLevel === 'high' ? 40 : 35;
      const rawGoal = Math.round(weightKg * multiplier);
      const roundedGoal = Math.round(rawGoal / 50) * 50;
      const clampedGoal = Math.max(1000, Math.min(roundedGoal, 5000));

      await Promise.all([
        updateSetting('weight_kg', weightKg),
        updateSetting('activity_level', activityLevel),
        updateSetting('daily_goal_ml', clampedGoal),
      ]);

      setSettings((prev) => ({
        ...prev,
        weight_kg: weightKg,
        activity_level: activityLevel,
        daily_goal_ml: clampedGoal,
      }));

      return clampedGoal;
    },
    []
  );

  const resetData = useCallback(async () => {
    await resetAllData();
  }, []);

  return {
    settings,
    loading,
    setDailyGoal,
    setGlassSize,
    setWeight,
    setActivityLevel,
    applyWeightCalculatedGoal,
    resetData,
    refresh,
  };
}
