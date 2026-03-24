import '../global.css';

import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import { type EventSubscription } from 'expo-modules-core';
import { useEffect, useRef } from 'react';
import { Pressable, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Linking from 'expo-linking';
import { initializeSDK, onDeepLink, onDeferredDeepLink, trackEvent } from '@/lib/sdk';
import { handleSDKDeepLink, handleSchemeDeepLink, handleUniversalLinkDeepLink } from '@/lib/deep-link-router';
import { isOnboardingComplete } from '@/lib/settings';
import { fetchPushMessage } from '@/lib/push';
import { saveMessage } from '@/lib/storage';
import { ThemeProvider, useTheme } from '@/lib/theme';
import type { Message, RevealStyle } from '@/lib/types';

export { ErrorBoundary } from 'expo-router';

// Show notification when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async (_notification) => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

SplashScreen.preventAutoHideAsync();

function AppNavigator() {
  const router = useRouter();
  const { colors } = useTheme();

  const FliqNavTheme = colors.isDark
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          primary: colors.accent,
          background: colors.bg,
          card: colors.bg,
          text: colors.textPrimary,
          border: colors.sectionBorder,
          notification: colors.accent,
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          primary: colors.accent,
          background: colors.bg,
          card: colors.bg,
          text: colors.textPrimary,
          border: colors.sectionBorder,
          notification: colors.accent,
        },
      };

  return (
    <NavThemeProvider value={FliqNavTheme}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.headerBg },
          headerTintColor: colors.headerTint,
          headerTitleStyle: { fontWeight: '700' },
          headerShadowVisible: false,
          contentStyle: { backgroundColor: colors.bg },
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            title: 'Fliq',
            headerRight: () => (
              <Pressable onPress={() => router.push('/settings')} hitSlop={8}>
                <Text style={{ fontSize: 22, color: colors.textSecondary }}>{'\u2699'}</Text>
              </Pressable>
            ),
          }}
        />
        <Stack.Screen name="onboarding" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="create" options={{ title: 'New Secret' }} />
        <Stack.Screen name="reveal/[id]" options={{ title: '', headerBackTitle: 'Back', headerTransparent: true }} />
        <Stack.Screen name="s" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ title: 'Settings', headerBackTitle: 'Back' }} />
      </Stack>
    </NavThemeProvider>
  );
}

export default function RootLayout() {
  const router = useRouter();
  const notificationResponseListener = useRef<EventSubscription | null>(null);
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
          try {
            router.replace('/onboarding');
          } catch {
            // Navigation not ready yet — will redirect on next mount
          }
        }
      });

      initializeSDK().then((connected) => {
        if (connected) {
          trackEvent('app_opened');
          onDeepLink((url, data) => handleSDKDeepLink(data, url));
          onDeferredDeepLink((data) => handleSDKDeepLink(data));
        }

        // Handle fliq:// URI scheme deep links (from interstitial page).
        // These bypass the SDK since the URL doesn't match the SDK's baseUrl.
        const subscription = Linking.addEventListener('url', ({ url }) => {
          if (url.startsWith('fliq://open')) {
            handleSchemeDeepLink(url);
          } else if (url.includes('fliq.linkforty.com/s') || (url.startsWith('fliq://') && url.includes('e='))) {
            // Universal Links (fliq.linkforty.com) and interstitial scheme URLs (fliq://?e=...&n=...#key)
            handleUniversalLinkDeepLink(url);
          }
        });

        // Check if app was cold-launched via deep link
        Linking.getInitialURL().then((initialUrl) => {
          if (initialUrl?.startsWith('fliq://open')) {
            handleSchemeDeepLink(initialUrl);
          } else if (initialUrl?.includes('fliq.linkforty.com/s') || (initialUrl?.startsWith('fliq://') && initialUrl?.includes('e='))) {
            handleUniversalLinkDeepLink(initialUrl);
          }
        });

        return () => subscription.remove();
      });
    }
  }, [loaded]);

  // Handle push notification taps — fetch message from server and navigate to reveal
  useEffect(() => {
    notificationResponseListener.current =
      Notifications.addNotificationResponseReceivedListener(async (response) => {
        const data = response.notification.request.content.data;
        if (data?.type === 'fliq_message' && data?.messageId) {
          const msg = await fetchPushMessage(
            data.messageId as string,
            data.contentKey as string | undefined,
          );
          if (msg) {
            const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
            const message: Message = {
              id,
              content: msg.content,
              revealStyle: (msg.revealStyle as RevealStyle) || 'flick',
              senderName: msg.senderName,
              createdAt: msg.createdAt,
              isRead: false,
              direction: 'received',
            };
            await saveMessage(message);
            trackEvent('message_received', {
              revealStyle: message.revealStyle,
              source: 'push',
            });
            try {
              router.push(`/reveal/${id}`);
            } catch {
              // Navigation context not ready — message is saved and will appear in inbox
            }
          }
        }
      });

    return () => {
      notificationResponseListener.current?.remove();
    };
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AppNavigator />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
