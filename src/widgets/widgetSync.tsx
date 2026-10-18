"use no memo";

/**
 * Utility to sync water intake data between the main app (SQLite) and the widget (AsyncStorage).
 * 
 * The widget runs in a separate process and cannot directly access SQLite,
 * so we keep a synced copy in AsyncStorage that the widget can read.
 */

import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { requestWidgetUpdate } from 'react-native-android-widget';
import { Platform } from 'react-native';
import { WaterWidget } from './WaterWidget';

const STORAGE_KEY_CURRENT = '@mynum_widget_current';
const STORAGE_KEY_GOAL = '@mynum_widget_goal';

/**
 * Sync the current day's total and goal to AsyncStorage so the widget can read it.
 */
export async function syncWidgetData(currentMl: number, goalMl: number) {
  try {
    await AsyncStorage.multiSet([
      [STORAGE_KEY_CURRENT, String(currentMl)],
      [STORAGE_KEY_GOAL, String(goalMl)],
    ]);

    // Request widget update on Android
    if (Platform.OS === 'android') {
      try {
        await requestWidgetUpdate({
          widgetName: 'WaterTracker',
          renderWidget: () => (
            <WaterWidget currentMl={currentMl} goalMl={goalMl} />
          ),
        });
      } catch (e) {
        // Widget might not be placed on home screen yet
        console.log('Widget update request failed (widget may not be placed):', e);
      }
    }
  } catch (error) {
    console.error('Failed to sync widget data:', error);
  }
}

/**
 * Reset widget data (called at midnight or when data is cleared).
 */
export async function resetWidgetData(goalMl: number = 2000) {
  try {
    await AsyncStorage.multiSet([
      [STORAGE_KEY_CURRENT, '0'],
      [STORAGE_KEY_GOAL, String(goalMl)],
    ]);

    if (Platform.OS === 'android') {
      try {
        await requestWidgetUpdate({
          widgetName: 'WaterTracker',
          renderWidget: () => (
            <WaterWidget currentMl={0} goalMl={goalMl} />
          ),
        });
      } catch {
        // Widget may not be placed
      }
    }
  } catch (error) {
    console.error('Failed to reset widget data:', error);
  }
}
