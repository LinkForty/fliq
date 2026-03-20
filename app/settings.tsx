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
import { useTheme } from '@/lib/theme';
import type { ThemePreference } from '@/lib/settings';

const DEFAULT_BASE_URL = 'https://api.linkforty.com';

const THEME_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
  { value: 'system', label: 'System' },
];

export default function SettingsScreen() {
  const router = useRouter();
  const { colors, preference, setTheme } = useTheme();
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

    const result = await registerForPushNotifications();
    if (result.token) {
      const registered = await registerDevice(phoneNumber.trim());
      if (registered) {
        await saveSettings({ ...(await getSettings()), pushRegistered: true });
        setPushRegistered(true);
        Alert.alert('Updated', 'Your phone number and push notifications are active.');
      } else {
        Alert.alert('Registration Failed', 'Could not register with the server. Push notifications may not work.');
      }
    } else {
      Alert.alert('Notifications Unavailable', result.error);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView
        className="flex-1"
        style={{ backgroundColor: colors.bg }}
        contentContainerClassName="p-5"
        keyboardShouldPersistTaps="handled"
      >
        {/* Push Notifications */}
        <Text
          className="text-xs font-bold uppercase tracking-widest mb-3"
          style={{ color: colors.textSecondary }}
        >
          Push Notifications
        </Text>
        <View
          className="p-4 rounded-xl mb-1"
          style={{ ...colors.bgCard, borderWidth: 1, borderColor: colors.cardBorder }}
        >
          <View className="flex-row items-center mb-3">
            <View
              className="w-3 h-3 rounded-full mr-3"
              style={{
                backgroundColor: pushRegistered
                  ? colors.statusActive
                  : colors.statusInactive,
              }}
            />
            <Text className="font-semibold" style={{ color: colors.textPrimary }}>
              {pushRegistered ? 'Push active' : 'Push not configured'}
            </Text>
          </View>
          <Text
            className="text-xs font-bold uppercase tracking-widest mb-1.5"
            style={{ color: colors.textSecondary }}
          >
            Your Phone Number
          </Text>
          <TextInput
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="+1 (555) 123-4567"
            placeholderTextColor={colors.inputPlaceholder}
            keyboardType="phone-pad"
            className="rounded-xl px-4 py-3 text-base mb-3"
            style={{
              ...colors.bgInput,
              borderWidth: 1,
              borderColor: colors.inputBorder,
              color: colors.textPrimary,
            }}
          />
          <Pressable
            onPress={handleUpdatePhone}
            className="rounded-xl py-3 items-center"
            style={{
              borderWidth: 1,
              borderColor: colors.accent,
            }}
          >
            <Text className="font-semibold text-sm" style={{ color: colors.accent }}>
              {pushRegistered ? 'Update Phone Number' : 'Save & Enable Push'}
            </Text>
          </Pressable>
        </View>
        <Text
          className="text-xs mb-6"
          style={{ color: colors.textTertiary }}
        >
          Friends send you secrets by entering this phone number
        </Text>

        {/* Appearance */}
        <View className="pt-6" style={{ borderTopWidth: 1, borderTopColor: colors.sectionBorder }}>
          <Text
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: colors.textSecondary }}
          >
            Appearance
          </Text>
          <View
            className="flex-row rounded-xl p-1"
            style={{ ...colors.bgCard, borderWidth: 1, borderColor: colors.cardBorder }}
          >
            {THEME_OPTIONS.map((option) => {
              const selected = preference === option.value;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => setTheme(option.value)}
                  className="flex-1 rounded-lg py-3 items-center"
                  style={
                    selected
                      ? {
                          backgroundColor: colors.accentBg,
                          borderWidth: 1,
                          borderColor: colors.accentBorder,
                        }
                      : undefined
                  }
                >
                  <Text
                    className="font-semibold text-sm"
                    style={{
                      color: selected ? colors.accent : colors.textSecondary,
                    }}
                  >
                    {option.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Preferences */}
        <View className="pt-6 mt-6" style={{ borderTopWidth: 1, borderTopColor: colors.sectionBorder }}>
          <Text
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: colors.textSecondary }}
          >
            Preferences
          </Text>
          <View
            className="flex-row items-center justify-between p-4 rounded-xl"
            style={{ ...colors.bgCard, borderWidth: 1, borderColor: colors.cardBorder }}
          >
            <View className="flex-1 mr-4">
              <Text className="font-semibold" style={{ color: colors.textPrimary }}>
                Auto-delete after reading
              </Text>
              <Text className="text-xs mt-0.5" style={{ color: colors.textTertiary }}>
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
              trackColor={{ false: colors.trackOff, true: colors.trackOn }}
              thumbColor={autoDelete ? colors.thumbOn : colors.thumbOff}
            />
          </View>
          <View
            className="flex-row items-center justify-between p-4 rounded-xl mt-3"
            style={{ ...colors.bgCard, borderWidth: 1, borderColor: colors.cardBorder }}
          >
            <View className="flex-1 mr-4">
              <Text className="font-semibold" style={{ color: colors.textPrimary }}>
                Auto-delete after sending
              </Text>
              <Text className="text-xs mt-0.5" style={{ color: colors.textTertiary }}>
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
              trackColor={{ false: colors.trackOff, true: colors.trackOn }}
              thumbColor={autoDeleteSend ? colors.thumbOn : colors.thumbOff}
            />
          </View>
        </View>

        {/* LinkForty Integration */}
        <View className="mt-10 pt-6" style={{ borderTopWidth: 1, borderTopColor: colors.sectionBorder }}>
          <Text
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: colors.textSecondary }}
          >
            LinkForty SDK
          </Text>

          {/* Status */}
          <View
            className="flex-row items-center mb-4 p-4 rounded-xl"
            style={{ ...colors.bgCard, borderWidth: 1, borderColor: colors.cardBorder }}
          >
            <View
              className="w-3 h-3 rounded-full mr-3"
              style={{
                backgroundColor: connected
                  ? colors.statusActive
                  : colors.statusInactive,
              }}
            />
            <View className="flex-1">
              <Text className="font-semibold" style={{ color: colors.textPrimary }}>
                {connected ? 'Connected' : 'Not connected'}
              </Text>
              <Text className="text-xs mt-0.5" style={{ color: colors.textTertiary }}>
                {connected
                  ? 'Links and events are being tracked in your LinkForty dashboard'
                  : 'Running in standalone mode \u2014 no data is sent to LinkForty'}
              </Text>
            </View>
          </View>

          {/* API Key */}
          <Text
            className="text-xs font-bold uppercase tracking-widest mb-1.5"
            style={{ color: colors.textSecondary }}
          >
            API Key
          </Text>
          <TextInput
            value={apiKey}
            onChangeText={setApiKey}
            placeholder="dl_xxxxxxxxxxxxxxxx..."
            placeholderTextColor={colors.inputPlaceholder}
            autoCapitalize="none"
            autoCorrect={false}
            className="rounded-xl px-4 py-3 text-base mb-1 font-mono"
            style={{
              ...colors.bgInput,
              borderWidth: 1,
              borderColor: colors.inputBorder,
              color: colors.textPrimary,
            }}
          />
          <Text className="text-xs mb-5" style={{ color: colors.textTertiary }}>
            Get your API key from the LinkForty dashboard under Settings &rarr; API Keys
          </Text>

          {/* Base URL */}
          <Text
            className="text-xs font-bold uppercase tracking-widest mb-1.5"
            style={{ color: colors.textSecondary }}
          >
            Base URL
          </Text>
          <TextInput
            value={baseUrl}
            onChangeText={setBaseUrl}
            placeholder="https://api.linkforty.com"
            placeholderTextColor={colors.inputPlaceholder}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            className="rounded-xl px-4 py-3 text-base mb-1"
            style={{
              ...colors.bgInput,
              borderWidth: 1,
              borderColor: colors.inputBorder,
              color: colors.textPrimary,
            }}
          />
          <Text className="text-xs mb-6" style={{ color: colors.textTertiary }}>
            Use the default unless you're running a self-hosted LinkForty instance
          </Text>

          {/* Connect / Disconnect */}
          {connected ? (
            <Pressable
              onPress={handleDisconnect}
              className="rounded-xl py-4 items-center"
              style={{ borderWidth: 2, borderColor: '#ef4444' }}
            >
              <Text className="font-semibold text-base" style={{ color: '#ef4444' }}>
                Disconnect
              </Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={handleConnect}
              disabled={loading}
              className="rounded-xl py-4 items-center"
              style={{
                backgroundColor: loading
                  ? (colors.bgCard as { backgroundColor: string }).backgroundColor
                  : colors.accent,
              }}
            >
              <Text
                className="font-bold text-base"
                style={{
                  color: loading ? colors.textTertiary : colors.accentText,
                }}
              >
                {loading ? 'Connecting...' : 'Connect'}
              </Text>
            </Pressable>
          )}
        </View>

        {/* Legal */}
        <View className="mt-10 pt-6" style={{ borderTopWidth: 1, borderTopColor: colors.sectionBorder }}>
          <Text
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: colors.textSecondary }}
          >
            Legal
          </Text>
          <Pressable
            onPress={() => WebBrowser.openBrowserAsync('https://fliq.linkforty.com/privacy')}
            className="flex-row items-center justify-between p-4 rounded-xl"
            style={{ ...colors.bgCard, borderWidth: 1, borderColor: colors.cardBorder }}
          >
            <Text className="font-semibold" style={{ color: colors.textPrimary }}>Privacy Policy</Text>
            <Text className="text-lg" style={{ color: colors.textTertiary }}>&rsaquo;</Text>
          </Pressable>
          <Pressable
            onPress={() => WebBrowser.openBrowserAsync('https://fliq.linkforty.com/terms')}
            className="flex-row items-center justify-between p-4 rounded-xl mt-3"
            style={{ ...colors.bgCard, borderWidth: 1, borderColor: colors.cardBorder }}
          >
            <Text className="font-semibold" style={{ color: colors.textPrimary }}>Terms of Service</Text>
            <Text className="text-lg" style={{ color: colors.textTertiary }}>&rsaquo;</Text>
          </Pressable>
        </View>

        {/* Data */}
        <View className="mt-10 pt-6" style={{ borderTopWidth: 1, borderTopColor: colors.sectionBorder }}>
          <Text className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#ef4444' }}>
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
            className="rounded-xl py-4 items-center"
            style={{ borderWidth: 2, borderColor: '#ef4444' }}
          >
            <Text className="font-semibold text-base" style={{ color: '#ef4444' }}>
              Clear All Messages
            </Text>
          </Pressable>
          <Text className="text-xs mt-2 text-center" style={{ color: colors.textTertiary }}>
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
          <Text className="text-xs mt-2 text-center" style={{ color: colors.textTertiary }}>
            Erases everything and returns to onboarding
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
