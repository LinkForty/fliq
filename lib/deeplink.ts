import type { RevealStyle } from './types';

const UNIVERSAL_LINK_BASE = 'https://fliq.linkforty.com/s';
const MAX_URL_LENGTH = 2048;

export type MessagePayload = {
  content: string;
  revealStyle: RevealStyle;
  senderName: string;
};

/**
 * Encode a message payload into a URL-safe base64 string.
 */
export function encodeMessage(payload: MessagePayload): string {
  const json = JSON.stringify(payload);
  const base64 = btoa(unescape(encodeURIComponent(json)));
  // Make URL-safe: replace + with -, / with _, remove trailing =
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Decode a URL-safe base64 string back into a message payload.
 * Returns null if the string is malformed.
 */
export function decodeMessage(encoded: string): MessagePayload | null {
  try {
    // Restore standard base64: replace - with +, _ with /
    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    // Restore padding
    while (base64.length % 4 !== 0) base64 += '=';
    const json = decodeURIComponent(escape(atob(base64)));
    const parsed = JSON.parse(json);

    if (
      typeof parsed.content !== 'string' ||
      typeof parsed.revealStyle !== 'string' ||
      typeof parsed.senderName !== 'string'
    ) {
      return null;
    }

    return parsed as MessagePayload;
  } catch {
    return null;
  }
}

/**
 * Generate a shareable universal link URL for a message.
 */
export function generateShareUrl(payload: MessagePayload): string {
  const encoded = encodeMessage(payload);
  return `${UNIVERSAL_LINK_BASE}?m=${encoded}`;
}

/**
 * Extract the message payload from a deep link URL.
 * Handles both universal links and app scheme links.
 */
export function parseDeepLink(url: string): MessagePayload | null {
  try {
    const parsed = new URL(url);
    const m = parsed.searchParams.get('m');
    if (!m) return null;
    return decodeMessage(m);
  } catch {
    return null;
  }
}

/**
 * Check if a message payload would produce a URL that's too long.
 */
export function isPayloadTooLarge(payload: MessagePayload): boolean {
  const url = generateShareUrl(payload);
  return url.length > MAX_URL_LENGTH;
}
