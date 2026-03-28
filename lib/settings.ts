import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEY = '@fliq/settings';
const DEFAULT_BASE_URL = 'https://api.linkforty.com';
const DEPRECATED_URL_PATTERNS = ['.up.railway.app', 'app.linkforty.com'];

export type ThemePreference = 'dark' | 'light' | 'system';

export type FliqSettings = {
  apiKey?: string;
  baseUrl: string;
  autoDeleteAfterRead: boolean;
  autoDeleteAfterSend: boolean;
  userName?: string;
  phoneNumber?: string;
  pushRegistered?: boolean;
  onboardingComplete?: boolean;
  theme?: ThemePreference;
  saveRecentNumbers: boolean;
};

export async function getSettings(): Promise<FliqSettings> {
  const raw = await AsyncStorage.getItem(SETTINGS_KEY);
  if (!raw) return { baseUrl: DEFAULT_BASE_URL, autoDeleteAfterRead: true, autoDeleteAfterSend: true, saveRecentNumbers: true };
  const parsed = JSON.parse(raw) as Partial<FliqSettings>;
  // Migrate old base URLs to the current API endpoint
  if (parsed.baseUrl && DEPRECATED_URL_PATTERNS.some((p) => parsed.baseUrl!.includes(p))) {
    parsed.baseUrl = DEFAULT_BASE_URL;
  }
  return { baseUrl: DEFAULT_BASE_URL, autoDeleteAfterRead: true, autoDeleteAfterSend: true, saveRecentNumbers: true, ...parsed };
}

export async function saveSettings(settings: FliqSettings): Promise<void> {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export async function clearSettings(): Promise<void> {
  await AsyncStorage.removeItem(SETTINGS_KEY);
}

export async function isOnboardingComplete(): Promise<boolean> {
  const settings = await getSettings();
  return settings.onboardingComplete === true;
}
