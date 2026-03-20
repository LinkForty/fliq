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
import { useTheme } from '@/lib/theme';
import type { RevealStyle, Message } from '@/lib/types';

const MAX_CONTENT_LENGTH = 500;
const AVAILABLE_STYLES: RevealStyle[] = ['flick'];

type SendMode = 'link' | 'push';

export default function CreateScreen() {
  const { colors } = useTheme();
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
        if (__DEV__) console.error('[Fliq] handleShare error:', error);
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

  const isEnabled = canShare && !sharing;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        className="flex-1"
        style={{ backgroundColor: colors.bg }}
        contentContainerStyle={{ padding: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* From name */}
        <Text
          className="text-xs font-bold uppercase tracking-widest mb-2"
          style={{ color: colors.textSecondary }}
        >
          From
        </Text>
        <TextInput
          value={senderName}
          onChangeText={setSenderName}
          placeholder="Your name"
          placeholderTextColor={colors.inputPlaceholder}
          className="rounded-xl px-4 py-3 text-base mb-5"
          style={{
            ...colors.bgInput,
            borderWidth: 1,
            borderColor: colors.inputBorder,
            color: colors.textPrimary,
          }}
        />

        {/* Secret message */}
        <View className="flex-row justify-between items-baseline mb-2">
          <Text
            className="text-xs font-bold uppercase tracking-widest"
            style={{ color: colors.textSecondary }}
          >
            Your secret
          </Text>
          <Text
            className="text-xs"
            style={{
              color:
                content.length > MAX_CONTENT_LENGTH
                  ? '#ef4444'
                  : colors.textTertiary,
            }}
          >
            {content.length}/{MAX_CONTENT_LENGTH}
          </Text>
        </View>
        <TextInput
          value={content}
          onChangeText={setContent}
          placeholder="Type your secret message..."
          placeholderTextColor={colors.inputPlaceholder}
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          className="rounded-xl px-4 py-3 text-base mb-5 min-h-[140px]"
          style={{
            ...colors.bgInput,
            borderWidth: 1,
            borderColor: colors.inputBorder,
            color: colors.textPrimary,
          }}
        />

        {/* Reveal style picker */}
        <Text
          className="text-xs font-bold uppercase tracking-widest mb-3"
          style={{ color: colors.textSecondary }}
        >
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
                className="mr-3 rounded-2xl p-4 w-32"
                style={{
                  ...(selected ? { backgroundColor: colors.accentBg } : colors.bgCard),
                  borderWidth: selected ? 2 : 1,
                  borderColor: selected ? colors.accent : colors.cardBorder,
                }}
              >
                <Text className="text-3xl text-center mb-2">{meta.emoji}</Text>
                <Text
                  className="text-sm font-semibold text-center"
                  style={{
                    color: selected ? colors.accent : colors.textSecondary,
                  }}
                >
                  {meta.label}
                </Text>
                <Text
                  className="text-xs text-center mt-1"
                  style={{ color: colors.textTertiary }}
                >
                  {meta.description}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Send mode toggle */}
        <Text
          className="text-xs font-bold uppercase tracking-widest mb-3"
          style={{ color: colors.textSecondary }}
        >
          Delivery
        </Text>
        <View
          className="flex-row mb-5 rounded-xl p-1"
          style={colors.bgCard}
        >
          <Pressable
            onPress={() => setSendMode('push')}
            className="flex-1 rounded-lg py-3 items-center"
            style={sendMode === 'push' ? {
              backgroundColor: colors.accentBg,
              borderWidth: 1,
              borderColor: colors.accentBorder,
            } : undefined}
          >
            <Text
              className="font-semibold text-sm"
              style={{
                color: sendMode === 'push' ? colors.accent : colors.textTertiary,
              }}
            >
              Push to Phone
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setSendMode('link')}
            className="flex-1 rounded-lg py-3 items-center"
            style={sendMode === 'link' ? {
              backgroundColor: colors.accentBg,
              borderWidth: 1,
              borderColor: colors.accentBorder,
            } : undefined}
          >
            <Text
              className="font-semibold text-sm"
              style={{
                color: sendMode === 'link' ? colors.accent : colors.textTertiary,
              }}
            >
              Share Link
            </Text>
          </Pressable>
        </View>

        {/* Recipient phone (push mode only) */}
        {sendMode === 'push' && (
          <>
            <Text
              className="text-xs font-bold uppercase tracking-widest mb-2"
              style={{ color: colors.textSecondary }}
            >
              Recipient&apos;s phone number
            </Text>
            <TextInput
              value={recipientPhone}
              onChangeText={setRecipientPhone}
              placeholder="+1 (555) 123-4567"
              placeholderTextColor={colors.inputPlaceholder}
              keyboardType="phone-pad"
              className="rounded-xl px-4 py-3 text-base mb-1"
              style={{
                ...colors.bgInput,
                borderWidth: 1,
                borderColor: colors.inputBorder,
                color: colors.textPrimary,
              }}
            />
            <Text
              className="text-xs mb-5"
              style={{ color: colors.textTertiary }}
            >
              They must have Fliq installed to receive push secrets
            </Text>
          </>
        )}

        {/* Send/Share button */}
        <Pressable
          onPress={handleShare}
          disabled={!canShare || sharing}
          className="rounded-xl py-4 items-center"
          style={{
            ...(isEnabled
              ? { backgroundColor: colors.accent }
              : { ...colors.bgCard, borderWidth: 1, borderColor: colors.cardBorder }),
            ...(isEnabled && colors.isDark
              ? {
                  shadowColor: colors.accent,
                  shadowOpacity: 0.3,
                  shadowRadius: 12,
                  shadowOffset: { width: 0, height: 4 },
                }
              : {}),
          }}
        >
          <Text
            className="font-bold text-base"
            style={{
              color: isEnabled ? colors.accentText : colors.textTertiary,
            }}
          >
            {sharing
              ? 'Sending...'
              : sendMode === 'push'
                ? 'Send Secret'
                : 'Share Secret'}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
