import { useEffect, useState, useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getMessages, markAsRead, deleteMessage } from '@/lib/storage';
import { getSettings } from '@/lib/settings';
import { trackEvent } from '@/lib/sdk';
import { REVEAL_STYLES } from '@/lib/reveal-styles';
import { ScratchReveal } from '@/components/ScratchReveal';
import { BlurReveal } from '@/components/BlurReveal';
import { FlickReveal } from '@/components/FlickReveal';
import { TypewriterReveal } from '@/components/TypewriterReveal';
import { FlipReveal } from '@/components/FlipReveal';
import type { Message, RevealStyle } from '@/lib/types';

export default function RevealScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [message, setMessage] = useState<Message | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMessage();
  }, [id]);

  async function loadMessage() {
    if (id) {
      const messages = await getMessages();
      const found = messages.find((m) => m.id === id);
      if (found) {
        setMessage(found);
        return;
      }
    }

    setError('Message not found');
  }

  const handleRevealed = useCallback(async () => {
    setRevealed(true);
    if (message) {
      trackEvent('message_revealed', {
        revealStyle: message.revealStyle,
        senderName: message.senderName,
      });
      const settings = await getSettings();
      if (settings.autoDeleteAfterRead) {
        await deleteMessage(message.id);
      } else {
        await markAsRead(message.id);
      }
    }
  }, [message]);

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900 p-8">
        <Text className="text-5xl mb-4">😵</Text>
        <Text className="text-xl font-bold text-gray-900 dark:text-white text-center">
          {error}
        </Text>
        <Pressable
          onPress={() => router.back()}
          className="mt-6 bg-brand-500 rounded-xl px-6 py-3"
        >
          <Text className="text-white font-semibold">Go Back</Text>
        </Pressable>
      </View>
    );
  }

  if (!message) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
        <Text className="text-gray-500">Loading...</Text>
      </View>
    );
  }

  const style = REVEAL_STYLES[message.revealStyle] || REVEAL_STYLES.blur;
  const revealStyle: RevealStyle =
    message.revealStyle in REVEAL_STYLES ? message.revealStyle : 'blur';

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      {/* Header */}
      <View className="pt-16 pb-4 px-5 items-center">
        <Text className="text-lg text-gray-500 dark:text-gray-400">
          Secret from
        </Text>
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">
          {message.senderName}
        </Text>
        {!revealed && (
          <Text className="text-sm text-gray-400 dark:text-gray-500 mt-1">
            {style.description}
          </Text>
        )}
      </View>

      {/* Reveal area */}
      <View className="flex-1 px-5 pb-5">
        {revealStyle === 'scratch' ? (
          <ScratchReveal
            content={message.content}
            onRevealed={handleRevealed}
          />
        ) : revealStyle === 'flick' ? (
          <FlickReveal
            content={message.content}
            onRevealed={handleRevealed}
          />
        ) : revealStyle === 'typewriter' ? (
          <TypewriterReveal
            content={message.content}
            onRevealed={handleRevealed}
          />
        ) : revealStyle === 'flip' ? (
          <FlipReveal
            content={message.content}
            onRevealed={handleRevealed}
          />
        ) : (
          <BlurReveal
            content={message.content}
            onRevealed={handleRevealed}
          />
        )}
      </View>

      {/* Post-reveal actions */}
      {revealed && (
        <View className="px-5 pb-10">
          <Pressable
            onPress={() => router.push('/create')}
            className="bg-brand-500 rounded-xl py-4 items-center active:bg-brand-600"
          >
            <Text className="text-white font-semibold text-base">
              Send a Secret Back 🤫
            </Text>
          </Pressable>
          <Pressable
            onPress={() => router.back()}
            className="mt-3 py-3 items-center"
          >
            <Text className="text-gray-500 dark:text-gray-400 text-sm">
              Go back
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
