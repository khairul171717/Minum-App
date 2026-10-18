import { Platform, AppRegistry } from 'react-native';

if (
  Platform.OS === 'android' &&
  typeof AppRegistry.registerHeadlessTask === 'function'
) {
  try {
    const { registerWidgetTaskHandler } = require('react-native-android-widget');
    const { widgetTaskHandler } = require('@/widgets/widget-task-handler');
    registerWidgetTaskHandler(widgetTaskHandler);
  } catch (error) {
    console.warn('Failed to register widget task handler:', error);
  }
}
