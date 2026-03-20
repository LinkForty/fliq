import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import { getSettings, saveSettings, type ThemePreference } from './settings';

type ThemeMode = 'dark' | 'light';

/** All theme-dependent color/style values consumed by components. */
export type ThemeColors = {
  mode: ThemeMode;
  isDark: boolean;

  // Backgrounds
  bg: string;
  bgCard: object;
  bgInput: object;

  // Text
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;

  // Accent
  accent: string;
  accentBg: string;
  accentBorder: string;
  accentText: string; // text color ON accent bg (black for green, white for teal)

  // Cards / glass
  cardBorder: string;
  cardBorderUnread: string;
  sectionBorder: string;

  // Inputs
  inputBorder: string;
  inputPlaceholder: string;

  // Toggle
  trackOn: string;
  trackOff: string;
  thumbOn: string;
  thumbOff: string;

  // Reveal cover
  revealCoverBg: object;
  revealCoverBorder: string;

  // Status
  statusActive: string;
  statusInactive: string;

  // Navigation
  headerBg: string;
  headerTint: string;
};

const DARK: ThemeColors = {
  mode: 'dark',
  isDark: true,

  bg: '#050507',
  bgCard: { backgroundColor: 'rgba(255, 255, 255, 0.07)' },
  bgInput: { backgroundColor: 'rgba(255, 255, 255, 0.05)' },

  textPrimary: '#ffffff',
  textSecondary: '#94a3b8', // slate-400
  textTertiary: '#64748b', // slate-500

  accent: '#39FF14',
  accentBg: 'rgba(57, 255, 20, 0.1)',
  accentBorder: 'rgba(57, 255, 20, 0.15)',
  accentText: '#000000',

  cardBorder: 'rgba(57, 255, 20, 0.1)',
  cardBorderUnread: 'rgba(57, 255, 20, 0.25)',
  sectionBorder: 'rgba(255, 255, 255, 0.05)',

  inputBorder: 'rgba(57, 255, 20, 0.1)',
  inputPlaceholder: '#475569',

  trackOn: 'rgba(57, 255, 20, 0.3)',
  trackOff: '#334155',
  thumbOn: '#39FF14',
  thumbOff: '#64748b',

  revealCoverBg: { backgroundColor: 'rgba(57, 255, 20, 0.06)' },
  revealCoverBorder: 'rgba(57, 255, 20, 0.2)',

  statusActive: '#39FF14',
  statusInactive: '#475569',

  headerBg: '#050507',
  headerTint: '#ffffff',
};

const LIGHT: ThemeColors = {
  mode: 'light',
  isDark: false,

  bg: '#ffffff',
  bgCard: { backgroundColor: '#f9fafb' }, // gray-50
  bgInput: { backgroundColor: '#f9fafb' },

  textPrimary: '#111827', // gray-900
  textSecondary: '#6b7280', // gray-500
  textTertiary: '#9ca3af', // gray-400

  accent: '#26adae', // teal brand-500
  accentBg: '#e6f7f7', // brand-50
  accentBorder: '#8ad4d5', // brand-200
  accentText: '#ffffff',

  cardBorder: '#e5e7eb', // gray-200
  cardBorderUnread: '#26adae',
  sectionBorder: '#e5e7eb',

  inputBorder: '#e5e7eb',
  inputPlaceholder: '#9ca3af',

  trackOn: '#8ad4d5',
  trackOff: '#d1d5db',
  thumbOn: '#26adae',
  thumbOff: '#f3f4f6',

  revealCoverBg: { backgroundColor: '#9ca3af' },
  revealCoverBorder: '#9ca3af',

  statusActive: '#22c55e',
  statusInactive: '#9ca3af',

  headerBg: '#ffffff',
  headerTint: '#111827',
};

type ThemeContextValue = {
  colors: ThemeColors;
  preference: ThemePreference;
  setTheme: (pref: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  colors: DARK,
  preference: 'dark',
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useSystemColorScheme();
  const [preference, setPreference] = useState<ThemePreference>('dark');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getSettings().then((s) => {
      setPreference(s.theme ?? 'dark');
      setLoaded(true);
    });
  }, []);

  const resolvedMode: ThemeMode =
    preference === 'system'
      ? systemScheme === 'light' ? 'light' : 'dark'
      : preference;

  const colors = resolvedMode === 'dark' ? DARK : LIGHT;

  async function setTheme(pref: ThemePreference) {
    setPreference(pref);
    const settings = await getSettings();
    await saveSettings({ ...settings, theme: pref });
  }

  if (!loaded) return null;

  return (
    <ThemeContext.Provider value={{ colors, preference, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
