import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { decodeMessage } from '@/lib/deeplink';
import { saveMessage } from '@/lib/storage';
import { trackEvent } from '@/lib/sdk';
import type { Message } from '@/lib/types';

/**
 * Deep link entry point.
 * Handles: https://fliq.linkforty.com/s?m=<base64>
 *          fliq://s?m=<base64>
 *
 * Decodes the message, saves to local storage, then redirects to the Reveal screen.
 */
export default function DeepLinkEntry() {
  const { m } = useLocalSearchParams<{ m: string }>();
  const router = useRouter();

  useEffect(() => {
    handleDeepLink();
  }, [m]);

  async function handleDeepLink() {
    if (!m) {
      router.replace('/');
      return;
    }

    const payload = decodeMessage(m);
    if (!payload) {
      router.replace('/');
      return;
    }

    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

    const msg: Message = {
      id,
      content: payload.content,
      revealStyle: payload.revealStyle,
      senderName: payload.senderName,
      createdAt: new Date().toISOString(),
      isRead: false,
      direction: 'received',
    };

    await saveMessage(msg);
    trackEvent('message_received', {
      revealStyle: msg.revealStyle,
      source: 'standalone_link',
    });

    // Replace so the user can't go "back" to this loading screen
    router.replace(`/reveal/${id}`);
  }

  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
      <Text className="text-gray-500">Opening secret...</Text>
    </View>
  );
}
