import type { RevealStyle } from './types';
import { generateKey, encrypt, decrypt, extractKeyFromFragment } from './crypto';
import { getApiBase } from './push';
import { getAuthHeaders } from './auth';

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
 * Stores encrypted message on the Fliq server and returns a URL with the message ID.
 * The message is deleted after the first read (ephemeral).
 * Falls back to encoding the message in the URL if the server is unreachable.
 */
export async function generateShareUrl(payload: MessagePayload): Promise<string> {
  const key = generateKey();
  const plaintext = JSON.stringify(payload);
  const encrypted = encrypt(plaintext, key);

  try {
    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${getApiBase()}/api/messages/link`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body: JSON.stringify({
        senderName: payload.senderName,
        encryptedContent: encrypted.e,
        contentNonce: encrypted.n,
        revealStyle: payload.revealStyle,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return `${UNIVERSAL_LINK_BASE}?id=${data.messageId}#${key}`;
    }
  } catch {
    // Fall back to inline URL if server is unreachable
  }

  // Fallback: encode message directly in URL (not ephemeral)
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
 * Handles server-stored messages (?id=), inline encrypted (?e=&n=), and legacy (?m=).
 * Server-stored messages are deleted after fetch (ephemeral).
 */
export async function parseDeepLink(url: string): Promise<MessagePayload | null> {
  try {
    // Strip fragment before parsing with URL (URL constructor discards it)
    const key = extractKeyFromFragment(url);
    const urlWithoutFragment = url.split('#')[0];
    const parsed = new URL(urlWithoutFragment);

    // Server-stored format: ?id=uuid  #key
    const messageId = parsed.searchParams.get('id');
    if (messageId && key) {
      try {
        const authHeaders = await getAuthHeaders();
        const res = await fetch(`${getApiBase()}/api/messages/${messageId}`, {
          headers: { ...authHeaders },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.encryptedContent && data.contentNonce) {
            const plaintext = decrypt(data.encryptedContent, data.contentNonce, key);
            if (!plaintext) return null;
            const payload = JSON.parse(plaintext);
            if (
              typeof payload.content === 'string' &&
              typeof payload.revealStyle === 'string' &&
              typeof payload.senderName === 'string'
            ) {
              return payload as MessagePayload;
            }
          }
        }
      } catch {
        // Server unreachable — message cannot be read
      }
      return null;
    }

    // Inline encrypted format: ?e=ciphertext&n=nonce  #key
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
