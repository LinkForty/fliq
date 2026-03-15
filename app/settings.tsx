import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Switch,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { getSettings, saveSettings, clearSettings } from '@/lib/settings';
import { initializeSDK, isConnected, resetSDK } from '@/lib/sdk';
import { clearMessages } from '@/lib/storage';
import { registerForPushNotifications, registerDevice } from '@/lib/push';

const DEFAULT_BASE_URL = 'https://api.linkforty.com';

export default function SettingsScreen() {
  const router = useRouter();
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState(DEFAULT_BASE_URL);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [autoDelete, setAutoDelete] = useState(true);
  const [autoDeleteSend, setAutoDeleteSend] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pushRegistered, setPushRegistered] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    const settings = await getSettings();
    if (settings.apiKey) setApiKey(settings.apiKey);
    setBaseUrl(settings.baseUrl);
    setAutoDelete(settings.autoDeleteAfterRead);
    setAutoDeleteSend(settings.autoDeleteAfterSend);
    if (settings.phoneNumber) setPhoneNumber(settings.phoneNumber);
    setPushRegistered(settings.pushRegistered === true);
    setConnected(isConnected());
  }

  async function handleConnect() {
    if (!apiKey.trim()) {
      Alert.alert('Missing API Key', 'Please enter your LinkForty API key.');
      return;
    }

    setLoading(true);
    try {
      const existing = await getSettings();
      await saveSettings({ ...existing, apiKey: apiKey.trim(), baseUrl: baseUrl.trim(), autoDeleteAfterRead: autoDelete, autoDeleteAfterSend: autoDeleteSend });
      const success = await initializeSDK();
      setConnected(success);
      if (success) {
        Alert.alert('Connected', 'LinkForty SDK is now active. Links and events will be tracked in your dashboard.');
      } else {
        Alert.alert('Connection Failed', 'Could not initialize the SDK. Check your API key and try again.');
      }
    } catch {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDisconnect() {
    resetSDK();
    const settings = await getSettings();
    await saveSettings({ ...settings, apiKey: undefined, baseUrl: DEFAULT_BASE_URL });
    setApiKey('');
    setBaseUrl(DEFAULT_BASE_URL);
    setConnected(false);
  }

  async function handleUpdatePhone() {
    if (!phoneNumber.trim() || phoneNumber.trim().length < 7) {
      Alert.alert('Invalid Phone', 'Please enter a valid phone number.');
      return;
    }

    const settings = await getSettings();
    await saveSettings({ ...settings, phoneNumber: phoneNumber.trim() });

    const token = await registerForPushNotifications();
    if (token) {
      const registered = await registerDevice(phoneNumber.trim());
      if (registered) {
        await saveSettings({ ...(await getSettings()), pushRegistered: true });
        setPushRegistered(true);
        Alert.alert('Updated', 'Your phone number and push notifications are active.');
      } else {
        Alert.alert('Registration Failed', 'Could not register with the server. Push notifications may not work.');
      }
    } else {
      Alert.alert('Permissions Needed', 'Push notification permissions are required to receive secrets.');
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView
        className="flex-1 bg-white dark:bg-gray-900"
        contentContainerClassName="p-5"
        keyboardShouldPersistTaps="handled"
      >
        {/* Push Notifications */}
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Push Notifications
        </Text>
        <View className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 mb-1">
          <View className="flex-row items-center mb-3">
            <View
              className={`w-3 h-3 rounded-full mr-3 ${
                pushRegistered ? 'bg-green-500' : 'bg-gray-400'
              }`}
            />
            <Text className="font-semibold text-gray-900 dark:text-white">
              {pushRegistered ? 'Push active' : 'Push not configured'}
            </Text>
          </View>
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Phone Number
          </Text>
          <TextInput
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="+1 (555) 123-4567"
            placeholderTextColor="#9ca3af"
            keyboardType="phone-pad"
            className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-base mb-3"
          />
          <Pressable
            onPress={handleUpdatePhone}
            className="rounded-xl py-3 items-center bg-indigo-500 active:bg-indigo-600"
          >
            <Text className="text-white font-semibold text-sm">
              {pushRegistered ? 'Update Phone Number' : 'Enable Push Notifications'}
            </Text>
          </Pressable>
        </View>
        <Text className="text-xs text-gray-400 dark:text-gray-500 mb-6">
          Friends send you secrets by entering this phone number
        </Text>

        {/* Preferences */}
        <View className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Preferences
          </Text>
          <View className="flex-row items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
            <View className="flex-1 mr-4">
              <Text className="font-semibold text-gray-900 dark:text-white">
                Auto-delete after reading
              </Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Messages are removed from your device after being revealed
              </Text>
            </View>
            <Switch
              value={autoDelete}
              onValueChange={async (value) => {
                setAutoDelete(value);
                const settings = await getSettings();
                await saveSettings({ ...settings, autoDeleteAfterRead: value });
              }}
              trackColor={{ false: '#d1d5db', true: '#818cf8' }}
              thumbColor={autoDelete ? '#6366f1' : '#f3f4f6'}
            />
          </View>
          <View className="flex-row items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800 mt-3">
            <View className="flex-1 mr-4">
              <Text className="font-semibold text-gray-900 dark:text-white">
                Auto-delete after sending
              </Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Sent messages are not saved to your device
              </Text>
            </View>
            <Switch
              value={autoDeleteSend}
              onValueChange={async (value) => {
                setAutoDeleteSend(value);
                const settings = await getSettings();
                await saveSettings({ ...settings, autoDeleteAfterSend: value });
              }}
              trackColor={{ false: '#d1d5db', true: '#818cf8' }}
              thumbColor={autoDeleteSend ? '#6366f1' : '#f3f4f6'}
            />
          </View>
        </View>

        {/* LinkForty Integration */}
        <View className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            LinkForty Integration
          </Text>

          {/* Status */}
          <View className="flex-row items-center mb-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
            <View
              className={`w-3 h-3 rounded-full mr-3 ${
                connected ? 'bg-green-500' : 'bg-gray-400'
              }`}
            />
            <View className="flex-1">
              <Text className="font-semibold text-gray-900 dark:text-white">
                {connected ? 'Connected' : 'Not connected'}
              </Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {connected
                  ? 'Links and events are being tracked in your LinkForty dashboard'
                  : 'Running in standalone mode \u2014 no data is sent to LinkForty'}
              </Text>
            </View>
          </View>

          {/* API Key */}
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            API Key
          </Text>
          <TextInput
            value={apiKey}
            onChangeText={setApiKey}
            placeholder="dl_xxxxxxxxxxxxxxxx..."
            placeholderTextColor="#9ca3af"
            autoCapitalize="none"
            autoCorrect={false}
            className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-base mb-1 font-mono"
          />
          <Text className="text-xs text-gray-400 dark:text-gray-500 mb-5">
            Get your API key from the LinkForty dashboard under Settings &rarr; API Keys
          </Text>

          {/* Base URL */}
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            Base URL
          </Text>
          <TextInput
            value={baseUrl}
            onChangeText={setBaseUrl}
            placeholder="https://api.linkforty.com"
            placeholderTextColor="#9ca3af"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-base mb-1"
          />
          <Text className="text-xs text-gray-400 dark:text-gray-500 mb-6">
            Use the default unless you're running a self-hosted LinkForty instance
          </Text>

          {/* Connect / Disconnect */}
          {connected ? (
            <Pressable
              onPress={handleDisconnect}
              className="rounded-xl py-4 items-center border-2 border-red-500 active:bg-red-50 dark:active:bg-red-950"
            >
              <Text className="text-red-500 font-semibold text-base">
                Disconnect
              </Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={handleConnect}
              disabled={loading}
              className={`rounded-xl py-4 items-center ${
                loading
                  ? 'bg-gray-300 dark:bg-gray-700'
                  : 'bg-indigo-500 active:bg-indigo-600'
              }`}
            >
              <Text className="text-white font-semibold text-base">
                {loading ? 'Connecting...' : 'Connect'}
              </Text>
            </Pressable>
          )}
        </View>

        {/* Legal */}
        <View className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Legal
          </Text>
          <Pressable
            onPress={() => WebBrowser.openBrowserAsync('https://linkforty.com/fliq/privacy')}
            className="flex-row items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800"
          >
            <Text className="font-semibold text-gray-900 dark:text-white">Privacy Policy</Text>
            <Text className="text-gray-400">&rsaquo;</Text>
          </Pressable>
          <Pressable
            onPress={() => WebBrowser.openBrowserAsync('https://linkforty.com/fliq/terms')}
            className="flex-row items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800 mt-3"
          >
            <Text className="font-semibold text-gray-900 dark:text-white">Terms of Service</Text>
            <Text className="text-gray-400">&rsaquo;</Text>
          </Pressable>
        </View>

        {/* Data */}
        <View className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Data
          </Text>
          <Pressable
            onPress={() =>
              Alert.alert(
                'Clear All Messages',
                'This will permanently delete all sent and received messages from this device.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Clear All',
                    style: 'destructive',
                    onPress: async () => {
                      await clearMessages();
                      Alert.alert('Done', 'All messages have been cleared.');
                    },
                  },
                ],
              )
            }
            className="rounded-xl py-4 items-center border-2 border-red-500 active:bg-red-50 dark:active:bg-red-950"
          >
            <Text className="text-red-500 font-semibold text-base">
              Clear All Messages
            </Text>
          </Pressable>
          <Text className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-center">
            Permanently deletes all messages from this device
          </Text>

          <Pressable
            onPress={() =>
              Alert.alert(
                'Reset App Data',
                'This will erase all messages, settings, and app data. You will need to go through onboarding again.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Reset Everything',
                    style: 'destructive',
                    onPress: async () => {
                      resetSDK();
                      await clearMessages();
                      await clearSettings();
                      router.replace('/onboarding');
                    },
                  },
                ],
              )
            }
            className="mt-4 rounded-xl py-4 items-center bg-red-500 active:bg-red-600"
          >
            <Text className="text-white font-semibold text-base">
              Reset App Data
            </Text>
          </Pressable>
          <Text className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-center">
            Erases everything and returns to onboarding
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
