import LinkFortySDK from '@linkforty/mobile-sdk-expo';
import type { DeepLinkData } from '@linkforty/mobile-sdk-expo';
import { getSettings } from './settings';
import { generateShareUrl } from './deeplink';
import type { MessagePayload } from './deeplink';

/**
 * Initialize the LinkForty SDK if an API key is configured.
 * Returns true if the SDK is now connected, false if running standalone.
 */
export async function initializeSDK(): Promise<boolean> {
  if (LinkFortySDK.isInitialized) return true;

  const settings = await getSettings();
  if (!settings.apiKey) return false;

  try {
    await LinkFortySDK.initialize({
      baseUrl: settings.baseUrl,
      apiKey: settings.apiKey,
      debug: __DEV__,
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Whether the SDK is currently initialized and connected.
 */
export function isConnected(): boolean {
  return LinkFortySDK.isInitialized;
}

/**
 * Create a share link for a message.
 * Connected mode: creates a tracked LinkForty short link.
 * Standalone mode: falls back to self-encoded URL.
 */
export async function createShareLink(payload: MessagePayload): Promise<string> {
  if (!LinkFortySDK.isInitialized) {
    return generateShareUrl(payload);
  }

  try {
    const result = await LinkFortySDK.createLink({
      deepLinkParameters: {
        content: payload.content,
        revealStyle: payload.revealStyle,
        senderName: payload.senderName,
      },
      title: `Secret from ${payload.senderName}`,
    });
    return result.url;
  } catch (error) {
    console.warn('[Fliq] createLink failed, falling back to standalone URL:', error);
    return generateShareUrl(payload);
  }
}

/**
 * Track an event if the SDK is connected. No-op in standalone mode.
 */
export async function trackEvent(
  name: string,
  properties?: Record<string, unknown>,
): Promise<void> {
  if (!LinkFortySDK.isInitialized) return;

  try {
    await LinkFortySDK.trackEvent(name, properties);
  } catch {
    // Silently ignore tracking errors
  }
}

/**
 * Register a handler for incoming deep links (connected mode).
 */
export function onDeepLink(
  callback: (url: string, data: DeepLinkData | null) => void,
): void {
  if (!LinkFortySDK.isInitialized) return;
  LinkFortySDK.onDeepLink(callback);
}

/**
 * Register a handler for deferred deep links (connected mode, post-install).
 */
export function onDeferredDeepLink(
  callback: (data: DeepLinkData | null) => void,
): void {
  if (!LinkFortySDK.isInitialized) return;
  LinkFortySDK.onDeferredDeepLink(callback);
}

/**
 * Reset the SDK to uninitialized state.
 */
export function resetSDK(): void {
  if (LinkFortySDK.isInitialized) {
    LinkFortySDK.reset();
  }
}

export type { DeepLinkData };
