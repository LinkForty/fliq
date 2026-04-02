import { router } from 'expo-router';
import { saveMessage } from './storage';
import { trackEvent } from './sdk';
import { getSettings } from './settings';
import { parseDeepLink } from './deeplink';
import { decrypt, isEncryptedPayload, extractKeyFromFragment } from './crypto';
import type { Message } from './types';
import type { DeepLinkData } from '@linkforty/mobile-sdk-expo';
import type { RevealStyle } from './types';

/**
 * Handle an incoming deep link from the LinkForty SDK.
 * Supports both encrypted (v1) and legacy plaintext customParameters.
 *
 * Encrypted flow: customParameters = { e, n, v:1 }, key extracted from URL fragment.
 * Legacy flow: customParameters = { content, revealStyle, senderName }.
 */
export async function handleSDKDeepLink(
  data: DeepLinkData | null,
  url?: string,
): Promise<void> {
  if (!data?.customParameters) return;

  let content: string;
  let revealStyle: string;
  let senderName: string;

  if (isEncryptedPayload(data.customParameters as Record<string, unknown>)) {
    // Encrypted format — extract key from URL fragment
    if (!url) return;
    const key = extractKeyFromFragment(url);
    if (!key) return;

    const params = data.customParameters as { e: string; n: string };
    const plaintext = decrypt(params.e, params.n, key);
    if (!plaintext) return;

    try {
      const parsed = JSON.parse(plaintext);
      content = parsed.content;
      revealStyle = parsed.revealStyle;
      senderName = parsed.senderName;
      if (!content || !senderName) return;
    } catch {
      return;
    }
  } else {
    // Legacy plaintext format
    content = data.customParameters.content;
    revealStyle = data.customParameters.revealStyle;
    senderName = data.customParameters.senderName;
    if (!content || !senderName) return;
  }

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

  navigateToReveal(id);
}

/**
 * Handle a fliq:// URI scheme deep link from the interstitial page.
 * URL format: fliq://open?code=<shortCode>#<key>
 *
 * Resolves the short code via the SDK resolve endpoint, decrypts the
 * message using the key from the fragment, then acknowledges delivery
 * so the server deletes the encrypted payload.
 */
export async function handleSchemeDeepLink(url: string): Promise<void> {
  try {
    // Parse the URL to extract code and key
    const protocolEnd = url.indexOf('://');
    if (protocolEnd === -1) return;

    const key = extractKeyFromFragment(url);
    const urlWithoutFragment = url.split('#')[0];
    const queryStart = urlWithoutFragment.indexOf('?');
    if (queryStart === -1) return;

    const queryString = urlWithoutFragment.substring(queryStart + 1);
    const params = new URLSearchParams(queryString);
    const shortCode = params.get('code');
    if (!shortCode) return;

    // Resolve the short code via the LinkForty API
    const settings = await getSettings();
    const baseUrl = settings.baseUrl.replace(/\/+$/, '');
    const resolveResponse = await fetch(`${baseUrl}/api/sdk/v1/resolve/${shortCode}`, {
      headers: settings.apiKey ? { Authorization: `Bearer ${settings.apiKey}` } : {},
    });

    if (!resolveResponse.ok) return;
    const data = await resolveResponse.json();
    const customParameters = data.customParameters;
    if (!customParameters) return;

    let content: string;
    let revealStyle: string;
    let senderName: string;

    if (key && isEncryptedPayload(customParameters)) {
      const plaintext = decrypt(customParameters.e, customParameters.n, key);
      if (!plaintext) return;

      const parsed = JSON.parse(plaintext);
      content = parsed.content;
      revealStyle = parsed.revealStyle;
      senderName = parsed.senderName;
    } else {
      // Legacy plaintext
      content = customParameters.content;
      revealStyle = customParameters.revealStyle;
      senderName = customParameters.senderName;
    }

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
      source: 'scheme_deep_link',
    });

    // Acknowledge delivery — server deletes the encrypted payload
    if (settings.apiKey) {
      fetch(`${baseUrl}/api/sdk/v1/acknowledge/${shortCode}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${settings.apiKey}`,
        },
      }).catch(() => { /* best-effort cleanup */ });
    }

    navigateToReveal(id);
  } catch {
    // Silently fail — user will see inbox
  }
}

/**
 * Handle a Universal Link deep link (https://fliq.linkforty.com/s?...).
 * Parses the encrypted or legacy URL, decrypts the message, saves it,
 * and navigates to the reveal screen. Works for both cold and warm starts.
 */
export async function handleUniversalLinkDeepLink(url: string): Promise<void> {
  try {
    const payload = await parseDeepLink(url);
    if (!payload) return;

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
      source: 'universal_link',
    });

    navigateToReveal(id);
  } catch {
    // Silently fail — user will see inbox
  }
}

function navigateToReveal(id: string): void {
  try {
    router.replace(`/reveal/${id}`);
  } catch {
    setTimeout(() => {
      try {
        router.replace(`/reveal/${id}`);
      } catch {
        // Navigation still unavailable — user will see the message in their inbox
      }
    }, 500);
  }
}
