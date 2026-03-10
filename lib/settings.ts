import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEY = '@fliq/settings';
const DEFAULT_BASE_URL = 'https://api.linkforty.com';
const DEPRECATED_BASE_URLS = ['https://app.linkforty.com', 'https://cloud-production-66bb.up.railway.app'];

export type FliqSettings = {
  apiKey?: string;
  baseUrl: string;
  autoDeleteAfterRead: boolean;
  autoDeleteAfterSend: boolean;
  userName?: string;
  onboardingComplete?: boolean;
};

export async function getSettings(): Promise<FliqSettings> {
  const raw = await AsyncStorage.getItem(SETTINGS_KEY);
  if (!raw) return { baseUrl: DEFAULT_BASE_URL, autoDeleteAfterRead: true, autoDeleteAfterSend: true };
  const parsed = JSON.parse(raw) as Partial<FliqSettings>;
  // Migrate old base URLs to the current API endpoint
  if (parsed.baseUrl && DEPRECATED_BASE_URLS.includes(parsed.baseUrl)) {
    parsed.baseUrl = DEFAULT_BASE_URL;
  }
  return { baseUrl: DEFAULT_BASE_URL, autoDeleteAfterRead: true, autoDeleteAfterSend: true, ...parsed };
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
