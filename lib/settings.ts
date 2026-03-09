import AsyncStorage from '@react-native-async-storage/async-storage';

const SETTINGS_KEY = '@fliq/settings';
const DEFAULT_BASE_URL = 'https://cloud-production-66bb.up.railway.app';

export type FliqSettings = {
  apiKey?: string;
  baseUrl: string;
};

export async function getSettings(): Promise<FliqSettings> {
  const raw = await AsyncStorage.getItem(SETTINGS_KEY);
  if (!raw) return { baseUrl: DEFAULT_BASE_URL };
  const parsed = JSON.parse(raw) as Partial<FliqSettings>;
  return { baseUrl: DEFAULT_BASE_URL, ...parsed };
}

export async function saveSettings(settings: FliqSettings): Promise<void> {
  await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export async function clearSettings(): Promise<void> {
  await AsyncStorage.removeItem(SETTINGS_KEY);
}
