import { router } from 'expo-router';
import { saveMessage } from './storage';
import { trackEvent } from './sdk';
import type { Message } from './types';
import type { DeepLinkData } from '@linkforty/mobile-sdk-expo';
import type { RevealStyle } from './types';

/**
 * Handle an incoming deep link from the LinkForty SDK.
 * Extracts message data from customParameters, saves to storage,
 * and navigates to the reveal screen.
 */
export async function handleSDKDeepLink(data: DeepLinkData | null): Promise<void> {
  if (!data?.customParameters) return;

  const { content, revealStyle, senderName } = data.customParameters;
  if (!content || !senderName) return;

  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

  const msg: Message = {
    id,
    content,
    revealStyle: (revealStyle as RevealStyle) || 'blur',
    senderName,
    createdAt: new Date().toISOString(),
    isRead: false,
    direction: 'received',
  };

  await saveMessage(msg);
  trackEvent('message_received', {
    revealStyle: msg.revealStyle,
    source: 'sdk_deep_link',
  });

  try {
    router.replace(`/reveal/${id}`);
  } catch {
    // Navigation context may not be ready — retry after a short delay
    setTimeout(() => {
      try {
        router.replace(`/reveal/${id}`);
      } catch {
        // Navigation still unavailable — user will see the message in their inbox
      }
    }, 500);
  }
}
