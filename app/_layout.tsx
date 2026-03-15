import '../global.css';

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import { type EventSubscription } from 'expo-modules-core';
import { useEffect, useRef } from 'react';
import { Pressable, Text, useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { initializeSDK, onDeepLink, onDeferredDeepLink, trackEvent } from '@/lib/sdk';
import { handleSDKDeepLink } from '@/lib/deep-link-router';
import { isOnboardingComplete } from '@/lib/settings';
import { fetchPushMessage } from '@/lib/push';
import { saveMessage } from '@/lib/storage';
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

export default function RootLayout() {
  const colorScheme = useColorScheme();
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
          onDeepLink((_url, data) => handleSDKDeepLink(data));
          onDeferredDeepLink((data) => handleSDKDeepLink(data));
        }
      });
    }
  }, [loaded]);

  // Handle push notification taps — fetch message from server and navigate to reveal
  useEffect(() => {
    notificationResponseListener.current =
      Notifications.addNotificationResponseReceivedListener(async (response) => {
        const data = response.notification.request.content.data;
        if (data?.type === 'fliq_message' && data?.messageId) {
          const msg = await fetchPushMessage(data.messageId as string);
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
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{
              title: 'Fliq',
              headerRight: () => (
                <Pressable onPress={() => router.push('/settings')} className="px-2">
                  <Text className="text-2xl">{'\u2699\uFE0F'}</Text>
                </Pressable>
              ),
            }}
          />
          <Stack.Screen name="onboarding" options={{ headerShown: false, gestureEnabled: false }} />
          <Stack.Screen name="create" options={{ title: 'Create Secret' }} />
          <Stack.Screen name="reveal/[id]" options={{ title: '', headerBackTitle: 'Back', headerTransparent: true }} />
          <Stack.Screen name="s" options={{ headerShown: false }} />
          <Stack.Screen name="settings" options={{ title: 'Settings', headerBackTitle: 'Back' }} />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
