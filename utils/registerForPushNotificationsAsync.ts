import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

/**
 * Request OS notification permission (presentation) and configure Android channel.
 * This is for expo-notifications presentation; FCM token retrieval is handled by RNFirebase messaging.
 */
export async function registerForPushNotificationsAsync(): Promise<void> {
  // Android channels are required for notification display.
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#6366f1',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    throw new Error('Notification permission not granted');
  }
}

