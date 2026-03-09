import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { getSettings, saveSettings, clearSettings } from '@/lib/settings';
import { initializeSDK, isConnected, resetSDK } from '@/lib/sdk';

const DEFAULT_BASE_URL = 'https://app.linkforty.com';

export default function SettingsScreen() {
  const router = useRouter();
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState(DEFAULT_BASE_URL);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    const settings = await getSettings();
    if (settings.apiKey) setApiKey(settings.apiKey);
    setBaseUrl(settings.baseUrl);
    setConnected(isConnected());
  }

  async function handleConnect() {
    if (!apiKey.trim()) {
      Alert.alert('Missing API Key', 'Please enter your LinkForty API key.');
      return;
    }

    setLoading(true);
    try {
      await saveSettings({ apiKey: apiKey.trim(), baseUrl: baseUrl.trim() });
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
    await clearSettings();
    setApiKey('');
    setBaseUrl(DEFAULT_BASE_URL);
    setConnected(false);
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
        {/* Status */}
        <View className="flex-row items-center mb-6 p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
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
                : 'Running in standalone mode — no data is sent to LinkForty'}
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
          Get your API key from the LinkForty dashboard under Settings → API Keys
        </Text>

        {/* Base URL */}
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          Base URL
        </Text>
        <TextInput
          value={baseUrl}
          onChangeText={setBaseUrl}
          placeholder="https://app.linkforty.com"
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
