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
import { router } from 'expo-router';
import { saveMessage } from '@/lib/storage';
import { getSettings } from '@/lib/settings';
import { isPayloadTooLarge } from '@/lib/deeplink';
import { createShareLink, isConnected, trackEvent } from '@/lib/sdk';
import { sendPushMessage } from '@/lib/push';
import { REVEAL_STYLES } from '@/lib/reveal-styles';
import type { RevealStyle, Message } from '@/lib/types';

const MAX_CONTENT_LENGTH = 500;
const AVAILABLE_STYLES: RevealStyle[] = ['flick'];

type SendMode = 'link' | 'push';

export default function CreateScreen() {
  const [content, setContent] = useState('');
  const [senderName, setSenderName] = useState('');
  const [revealStyle, setRevealStyle] = useState<RevealStyle>('flick');
  const [sendMode, setSendMode] = useState<SendMode>('push');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    getSettings().then((settings) => {
      if (settings.userName) setSenderName(settings.userName);
    });
  }, []);

  const canShare =
    content.trim().length > 0 &&
    senderName.trim().length > 0 &&
    content.length <= MAX_CONTENT_LENGTH &&
    (sendMode === 'link' || recipientPhone.trim().length >= 7);

  async function handleShare() {
    if (!canShare || sharing) return;

    const payload = {
      content: content.trim(),
      revealStyle,
      senderName: senderName.trim(),
    };

    setSharing(true);

    try {
      if (sendMode === 'push') {
        await handlePushSend(payload);
      } else {
        await handleLinkShare(payload);
      }
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        error.message !== 'User did not share'
      ) {
        Alert.alert('Error', 'Failed to send. Please try again.');
      }
    } finally {
      setSharing(false);
    }
  }

  async function handlePushSend(payload: { content: string; revealStyle: RevealStyle; senderName: string }) {
    const result = await sendPushMessage({
      recipientPhone: recipientPhone.trim(),
      content: payload.content,
      revealStyle: payload.revealStyle,
      senderName: payload.senderName,
    });

    if ('error' in result) {
      if (result.error.includes('No Fliq device')) {
        Alert.alert(
          'Not on Fliq',
          'That phone number isn\'t registered on Fliq yet. Share a link instead?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Share Link', onPress: () => setSendMode('link') },
          ],
        );
      } else {
        Alert.alert('Error', result.error);
      }
      return;
    }

    trackEvent('message_created', {
      revealStyle: payload.revealStyle,
      contentLength: payload.content.length,
      mode: 'push',
    });

    // Save locally if auto-delete-after-send is off
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

    Alert.alert('Sent', 'Your secret was delivered via push notification.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  }

  async function handleLinkShare(payload: { content: string; revealStyle: RevealStyle; senderName: string }) {
    // Only check payload size in standalone mode
    if (!isConnected() && isPayloadTooLarge(payload)) {
      Alert.alert(
        'Message too long',
        'Your message is too long to fit in a shareable link. Please shorten it.',
      );
      return;
    }

    const url = await createShareLink(payload);
    trackEvent('message_created', {
      revealStyle: payload.revealStyle,
      contentLength: payload.content.length,
      mode: isConnected() ? 'connected' : 'standalone',
    });

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
        message: `I sent you a secret! \u{1F92B}\n${url}`,
        url,
      },
      {
        subject: 'I sent you a secret!',
      },
    );

    router.back();
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: '#fff' }}
        contentContainerStyle={{ padding: 20 }}
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
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-950'
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
                }`}
              >
                <Text className="text-3xl text-center mb-2">{meta.emoji}</Text>
                <Text
                  className={`text-sm font-semibold text-center ${
                    selected
                      ? 'text-brand-600 dark:text-brand-400'
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

        {/* Send mode toggle */}
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Delivery method
        </Text>
        <View
          style={{
            flexDirection: 'row',
            marginBottom: 20,
            backgroundColor: '#f3f4f6',
            borderRadius: 12,
            padding: 4,
          }}
        >
          <Pressable
            onPress={() => setSendMode('push')}
            style={{
              flex: 1,
              borderRadius: 8,
              paddingVertical: 12,
              alignItems: 'center',
              ...(sendMode === 'push'
                ? { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 2, shadowOffset: { width: 0, height: 1 } }
                : {}),
            }}
          >
            <Text
              style={{
                fontWeight: '600',
                fontSize: 14,
                color: sendMode === 'push' ? '#26adae' : '#6b7280',
              }}
            >
              Push to Phone
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setSendMode('link')}
            style={{
              flex: 1,
              borderRadius: 8,
              paddingVertical: 12,
              alignItems: 'center',
              ...(sendMode === 'link'
                ? { backgroundColor: '#fff', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 2, shadowOffset: { width: 0, height: 1 } }
                : {}),
            }}
          >
            <Text
              style={{
                fontWeight: '600',
                fontSize: 14,
                color: sendMode === 'link' ? '#26adae' : '#6b7280',
              }}
            >
              Share Link
            </Text>
          </Pressable>
        </View>

        {/* Recipient phone (push mode only) */}
        {sendMode === 'push' && (
          <>
            <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Recipient&apos;s phone number
            </Text>
            <TextInput
              value={recipientPhone}
              onChangeText={setRecipientPhone}
              placeholder="+1 (555) 123-4567"
              placeholderTextColor="#9ca3af"
              keyboardType="phone-pad"
              className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-base mb-1"
            />
            <Text className="text-xs text-gray-400 dark:text-gray-500 mb-5">
              They must have Fliq installed to receive push secrets
            </Text>
          </>
        )}

        {/* Send/Share button */}
        <Pressable
          onPress={handleShare}
          disabled={!canShare || sharing}
          className={`rounded-xl py-4 items-center ${
            canShare && !sharing
              ? 'bg-brand-500 active:bg-brand-600'
              : 'bg-gray-300 dark:bg-gray-700'
          }`}
        >
          <Text className="text-white font-semibold text-base">
            {sharing
              ? 'Sending...'
              : sendMode === 'push'
                ? 'Send Secret'
                : 'Share Secret \u{1F92B}'}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
