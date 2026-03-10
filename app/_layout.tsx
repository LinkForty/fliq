import '../global.css';

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { initializeSDK, onDeepLink, onDeferredDeepLink } from '@/lib/sdk';
import { handleSDKDeepLink } from '@/lib/deep-link-router';
import { isOnboardingComplete } from '@/lib/settings';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();

      // Check onboarding status, then initialize SDK
      isOnboardingComplete().then((complete) => {
        if (!complete) {
          router.replace('/onboarding');
        }
      });

      initializeSDK().then((connected) => {
        if (connected) {
          onDeepLink((_url, data) => handleSDKDeepLink(data));
          onDeferredDeepLink((data) => handleSDKDeepLink(data));
        }
      });
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false, gestureEnabled: false }} />
          <Stack.Screen name="create" options={{ title: 'Create Secret', presentation: 'modal' }} />
          <Stack.Screen name="reveal/[id]" options={{ title: '', headerBackTitle: 'Back', headerTransparent: true }} />
          <Stack.Screen name="s" options={{ headerShown: false }} />
          <Stack.Screen name="settings" options={{ title: 'Settings', headerBackTitle: 'Back' }} />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
