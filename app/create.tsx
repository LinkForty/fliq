import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Share,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { saveMessage } from '@/lib/storage';
import { getSettings } from '@/lib/settings';
import { isPayloadTooLarge } from '@/lib/deeplink';
import { createShareLink, isConnected } from '@/lib/sdk';
import { REVEAL_STYLES } from '@/lib/reveal-styles';
import type { RevealStyle, Message } from '@/lib/types';

const MAX_CONTENT_LENGTH = 500;
const AVAILABLE_STYLES: RevealStyle[] = ['flick'];

export default function CreateScreen() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [senderName, setSenderName] = useState('');
  const [revealStyle, setRevealStyle] = useState<RevealStyle>('flick');
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    getSettings().then((settings) => {
      if (settings.userName) setSenderName(settings.userName);
    });
  }, []);

  const canShare =
    content.trim().length > 0 &&
    senderName.trim().length > 0 &&
    content.length <= MAX_CONTENT_LENGTH;

  async function handleShare() {
    if (!canShare || sharing) return;

    const payload = {
      content: content.trim(),
      revealStyle,
      senderName: senderName.trim(),
    };

    // Only check payload size in standalone mode (connected mode uses server-side links)
    if (!isConnected() && isPayloadTooLarge(payload)) {
      Alert.alert(
        'Message too long',
        'Your message is too long to fit in a shareable link. Please shorten it.',
      );
      return;
    }

    setSharing(true);

    try {
      const url = await createShareLink(payload);

      const settings = await getSettings();
      if (!settings.autoDeleteAfterSend) {
        const message: Message = {
          id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
          content: payload.content,
          revealStyle: payload.revealStyle,
          senderName: payload.senderName,
          createdAt: new Date().toISOString(),
          isRead: true,
          direction: 'sent',
        };

        await saveMessage(message);
      }

      await Share.share(
        {
          message: `I sent you a secret! 🤫\n${url}`,
          url, // iOS uses this for rich preview
        },
        {
          subject: 'I sent you a secret!',
        },
      );

      router.back();
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        error.message !== 'User did not share'
      ) {
        Alert.alert('Error', 'Failed to share. Please try again.');
      }
    } finally {
      setSharing(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView
        className="flex-1 bg-white dark:bg-gray-900"
        contentContainerClassName="p-5"
        keyboardShouldPersistTaps="handled"
      >
        {/* From name */}
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
          From
        </Text>
        <TextInput
          value={senderName}
          onChangeText={setSenderName}
          placeholder="Your name"
          placeholderTextColor="#9ca3af"
          className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-base mb-5"
        />

        {/* Secret message */}
        <View className="flex-row justify-between items-baseline mb-1.5">
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Your secret
          </Text>
          <Text
            className={`text-xs ${
              content.length > MAX_CONTENT_LENGTH
                ? 'text-red-500'
                : 'text-gray-400'
            }`}
          >
            {content.length}/{MAX_CONTENT_LENGTH}
          </Text>
        </View>
        <TextInput
          value={content}
          onChangeText={setContent}
          placeholder="Type your secret message..."
          placeholderTextColor="#9ca3af"
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-base mb-5 min-h-[140px]"
        />

        {/* Reveal style picker */}
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Reveal style
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-6"
        >
          {AVAILABLE_STYLES.map((style) => {
            const meta = REVEAL_STYLES[style];
            const selected = revealStyle === style;
            return (
              <Pressable
                key={style}
                onPress={() => setRevealStyle(style)}
                className={`mr-3 rounded-2xl p-4 w-32 border-2 ${
                  selected
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950'
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                }`}
              >
                <Text className="text-3xl text-center mb-2">{meta.emoji}</Text>
                <Text
                  className={`text-sm font-semibold text-center ${
                    selected
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {meta.label}
                </Text>
                <Text className="text-xs text-gray-400 dark:text-gray-500 text-center mt-1">
                  {meta.description}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Share button */}
        <Pressable
          onPress={handleShare}
          disabled={!canShare || sharing}
          className={`rounded-xl py-4 items-center ${
            canShare && !sharing
              ? 'bg-indigo-500 active:bg-indigo-600'
              : 'bg-gray-300 dark:bg-gray-700'
          }`}
        >
          <Text className="text-white font-semibold text-base">
            {sharing ? 'Sharing...' : 'Share Secret 🤫'}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
