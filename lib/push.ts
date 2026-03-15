import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSettings } from './settings';

const DEVICE_ID_KEY = '@fliq/device_id';
const PUSH_TOKEN_KEY = '@fliq/push_token';

function getApiBase(): string {
  if (__DEV__) {
    return Platform.OS === 'android' ? 'http://10.0.2.2:3100' : 'http://localhost:3100';
  }
  return Constants.expoConfig?.extra?.pushApiUrl ?? 'https://fliq-api.example.com';
}

/**
 * Get or create a stable device ID for this installation.
 */
export async function getDeviceId(): Promise<string> {
  let id = await AsyncStorage.getItem(DEVICE_ID_KEY);
  if (!id) {
    id = Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
    await AsyncStorage.setItem(DEVICE_ID_KEY, id);
  }
  return id;
}

/**
 * Request notification permissions and get the Expo push token.
 * Returns { token } on success, or { error } with a user-facing message.
 */
export async function registerForPushNotifications(): Promise<
  { token: string; error?: never } | { token?: never; error: string }
> {
  if (!Device.isDevice) {
    return { error: 'Push notifications require a physical device. They cannot be tested on the simulator.' };
  }

  const { status: existing } = await Notifications.getPermissionsAsync();
  let finalStatus = existing;

  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    return { error: 'Notification permissions were denied. Go to Settings > Fliq > Notifications to enable them.' };
  }

  // Android notification channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
    });
  }

  const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  if (!projectId) {
    return { error: 'Missing EAS project ID. Push notifications are not configured for this build.' };
  }

  const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });

  const token = tokenData.data;
  await AsyncStorage.setItem(PUSH_TOKEN_KEY, token);
  return { token };
}

/**
 * Register this device with the Fliq backend (phone number + push token).
 */
export async function registerDevice(phoneNumber: string): Promise<boolean> {
  const pushToken = await AsyncStorage.getItem(PUSH_TOKEN_KEY);
  if (!pushToken) return false;

  const deviceId = await getDeviceId();
  const settings = await getSettings();

  try {
    const res = await fetch(`${getApiBase()}/api/devices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deviceId,
        phoneNumber,
        pushToken,
        displayName: settings.userName || undefined,
        platform: Platform.OS,
      }),
    });
    return res.ok;
  } catch (err) {
    console.warn('[Fliq] Device registration failed:', err);
    return false;
  }
}

/**
 * Send a secret message via push notification.
 */
export async function sendPushMessage(params: {
  recipientPhone: string;
  content: string;
  revealStyle: string;
  senderName: string;
}): Promise<{ messageId: string; expiresAt: string } | { error: string }> {
  const deviceId = await getDeviceId();

  const res = await fetch(`${getApiBase()}/api/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      senderDeviceId: deviceId,
      senderName: params.senderName,
      recipientPhone: params.recipientPhone,
      content: params.content,
      revealStyle: params.revealStyle,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    return { error: data.message || 'Failed to send message' };
  }

  return data;
}

/**
 * Fetch a push message from the server by ID.
 * The server deletes the message after this call — one-time read.
 */
export async function fetchPushMessage(messageId: string): Promise<{
  senderName: string;
  content: string;
  revealStyle: string;
  createdAt: string;
} | null> {
  try {
    const res = await fetch(`${getApiBase()}/api/messages/${messageId}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}
