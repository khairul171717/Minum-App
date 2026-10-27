/* eslint-disable @typescript-eslint/no-require-imports */
import 'react-native-gesture-handler';
import { Platform, AppRegistry } from 'react-native';

if (
  Platform.OS === 'android' &&
  typeof AppRegistry.registerHeadlessTask === 'function'
) {
  try {
    const { registerWidgetTaskHandler } = require('react-native-android-widget');
    const { widgetTaskHandler } = require('./src/widgets/widget-task-handler');
    registerWidgetTaskHandler(widgetTaskHandler);
  } catch (error) {
    console.warn('Failed to register widget task handler:', error);
  }
}

// Expo Router entry must be imported after background task registrations
import 'expo-router/entry';
