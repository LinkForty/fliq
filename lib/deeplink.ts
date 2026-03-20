import type { RevealStyle } from './types';
import { generateKey, encrypt, decrypt, extractKeyFromFragment } from './crypto';

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
 * Encrypts the payload — decryption key is in the URL fragment (never sent to server).
 */
export function generateShareUrl(payload: MessagePayload): string {
  const key = generateKey();
  const plaintext = JSON.stringify(payload);
  const encrypted = encrypt(plaintext, key);
  return `${UNIVERSAL_LINK_BASE}?e=${encrypted.e}&n=${encrypted.n}#${key}`;
}

/**
 * Generate a legacy (unencrypted) shareable URL.
 * @deprecated Use generateShareUrl() for encrypted URLs.
 */
export function generateLegacyShareUrl(payload: MessagePayload): string {
  const encoded = encodeMessage(payload);
  return `${UNIVERSAL_LINK_BASE}?m=${encoded}`;
}

/**
 * Extract the message payload from a deep link URL.
 * Handles encrypted URLs (e + n params, key in fragment) and legacy (m param).
 */
export function parseDeepLink(url: string): MessagePayload | null {
  try {
    // Strip fragment before parsing with URL (URL constructor discards it)
    const key = extractKeyFromFragment(url);
    const urlWithoutFragment = url.split('#')[0];
    const parsed = new URL(urlWithoutFragment);

    // Encrypted format: ?e=ciphertext&n=nonce  #key
    const e = parsed.searchParams.get('e');
    const n = parsed.searchParams.get('n');
    if (e && n && key) {
      const plaintext = decrypt(e, n, key);
      if (!plaintext) return null;
      try {
        const payload = JSON.parse(plaintext);
        if (
          typeof payload.content === 'string' &&
          typeof payload.revealStyle === 'string' &&
          typeof payload.senderName === 'string'
        ) {
          return payload as MessagePayload;
        }
      } catch {
        return null;
      }
    }

    // Legacy format: ?m=base64
    const m = parsed.searchParams.get('m');
    if (m) return decodeMessage(m);

    return null;
  } catch {
    return null;
  }
}

/**
 * Check if a message payload would produce a URL that's too long.
 * Uses a conservative estimate to avoid generating a throwaway encrypted URL.
 */
export function isPayloadTooLarge(payload: MessagePayload): boolean {
  // Encrypted URL overhead: base URL (~35) + ?e= + &n= + #key
  // AES-GCM ciphertext ≈ plaintext + 16 bytes (auth tag), then base64url ≈ 4/3x
  // Nonce: 16 chars, Key: 44 chars, separators: ~10 chars
  const jsonLength = JSON.stringify(payload).length;
  const estimatedLength = UNIVERSAL_LINK_BASE.length + 10 + Math.ceil((jsonLength + 16) * 4 / 3) + 16 + 44;
  return estimatedLength > MAX_URL_LENGTH;
}
