"use no memo";

import React from 'react';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import { WaterWidget } from './WaterWidget';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Keys for shared data between app and widget
const STORAGE_KEY_CURRENT = '@mynum_widget_current';
const STORAGE_KEY_GOAL = '@mynum_widget_goal';

async function getWidgetData() {
  try {
    const [currentStr, goalStr] = await Promise.all([
      AsyncStorage.getItem(STORAGE_KEY_CURRENT),
      AsyncStorage.getItem(STORAGE_KEY_GOAL),
    ]);
    return {
      currentMl: currentStr ? parseInt(currentStr, 10) : 0,
      goalMl: goalStr ? parseInt(goalStr, 10) : 2000,
    };
  } catch {
    return { currentMl: 0, goalMl: 2000 };
  }
}

async function addWaterFromWidget(amount: number) {
  try {
    const currentStr = await AsyncStorage.getItem(STORAGE_KEY_CURRENT);
    const current = currentStr ? parseInt(currentStr, 10) : 0;
    const newTotal = current + amount;
    await AsyncStorage.setItem(STORAGE_KEY_CURRENT, String(newTotal));
    return newTotal;
  } catch {
    return 0;
  }
}

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  try {
    if (!props?.widgetInfo || props.widgetInfo.widgetName !== 'WaterTracker') {
      return;
    }

    switch (props.widgetAction) {
      case 'WIDGET_ADDED':
      case 'WIDGET_UPDATE':
      case 'WIDGET_RESIZED': {
        const data = await getWidgetData();
        props.renderWidget(
          <WaterWidget currentMl={data.currentMl} goalMl={data.goalMl} />
        );
        break;
      }

      case 'WIDGET_CLICK': {
        const clickData = props.clickActionData;
        if (clickData?.action === 'add_water' && clickData?.amount) {
          const amount = parseInt(String(clickData.amount), 10) || 0;
          if (amount > 0) {
            const newTotal = await addWaterFromWidget(amount);
            const goalStr = await AsyncStorage.getItem(STORAGE_KEY_GOAL);
            const goalMl = goalStr ? parseInt(goalStr, 10) : 2000;

            props.renderWidget(
              <WaterWidget currentMl={newTotal} goalMl={goalMl} />
            );
          }
        }
        break;
      }

      case 'WIDGET_DELETED':
      default:
        break;
    }
  } catch (error) {
    console.error('Error in widgetTaskHandler:', error);
  }
}
