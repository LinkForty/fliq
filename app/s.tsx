import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { decodeMessage } from '@/lib/deeplink';
import { decrypt, extractKeyFromFragment } from '@/lib/crypto';
import { getApiBase } from '@/lib/push';
import { getAuthHeaders } from '@/lib/auth';
import { saveMessage } from '@/lib/storage';
import { trackEvent } from '@/lib/sdk';
import { useTheme } from '@/lib/theme';
import type { Message } from '@/lib/types';
import type { RevealStyle } from '@/lib/types';

/**
 * Deep link entry point.
 *
 * Server-stored format: ?id=<uuid>#<key>  (ephemeral — deleted after read)
 * Encrypted format:     ?e=<ciphertext>&n=<nonce>#<key>
 * Legacy format:        ?m=<base64>
 *
 * Decrypts/decodes the message, saves to local storage, then navigates to Reveal.
 */
export default function DeepLinkEntry() {
  const { m, e, n, id: messageId } = useLocalSearchParams<{ m?: string; e?: string; n?: string; id?: string }>();
  const router = useRouter();
  const { colors } = useTheme();

  useEffect(() => {
    handleDeepLink();
  }, [m, e, n, messageId]);

  async function handleDeepLink() {
    let content: string | undefined;
    let revealStyle: RevealStyle | undefined;
    let senderName: string | undefined;

    // Get the decryption key from the URL fragment
    const initialUrl = await Linking.getInitialURL();
    const key = initialUrl ? extractKeyFromFragment(initialUrl) : null;

    if (messageId && key) {
      // Server-stored ephemeral format — fetch and delete from server
      try {
        const authHeaders = await getAuthHeaders();
        const res = await fetch(`${getApiBase()}/api/messages/${messageId}`, {
          headers: { ...authHeaders },
        });

        if (!res.ok) {
          router.replace('/');
          return;
        }

        const data = await res.json();
        if (data.encryptedContent && data.contentNonce) {
          const plaintext = decrypt(data.encryptedContent, data.contentNonce, key);
          if (!plaintext) {
            router.replace('/');
            return;
          }
          const parsed = JSON.parse(plaintext);
          content = parsed.content;
          revealStyle = parsed.revealStyle;
          senderName = parsed.senderName;
        }
      } catch {
        router.replace('/');
        return;
      }
    } else if (e && n && key) {
      // Inline encrypted format (legacy fallback)
      const plaintext = decrypt(e, n, key);
      if (!plaintext) {
        router.replace('/');
        return;
      }

      try {
        const parsed = JSON.parse(plaintext);
        content = parsed.content;
        revealStyle = parsed.revealStyle;
        senderName = parsed.senderName;
      } catch {
        router.replace('/');
        return;
      }
    } else if (m) {
      // Legacy unencrypted format
      const payload = decodeMessage(m);
      if (!payload) {
        router.replace('/');
        return;
      }
      content = payload.content;
      revealStyle = payload.revealStyle;
      senderName = payload.senderName;
    } else {
      router.replace('/');
      return;
    }

    if (!content || !senderName) {
      router.replace('/');
      return;
    }

    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

    const msg: Message = {
      id,
      content,
      revealStyle: revealStyle || 'blur',
      senderName,
      createdAt: new Date().toISOString(),
      isRead: false,
      direction: 'received',
    };

    await saveMessage(msg);
    trackEvent('message_received', {
      revealStyle: msg.revealStyle,
      source: messageId ? 'ephemeral_link' : 'standalone_link',
    });

    router.replace(`/reveal/${id}`);
  }

  return (
    <View
      className="flex-1 items-center justify-center"
      style={{ backgroundColor: colors.bg }}
    >
      <Text style={{ color: colors.textTertiary }}>Opening secret...</Text>
    </View>
  );
}
