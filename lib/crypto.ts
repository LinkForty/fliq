import { gcm } from '@noble/ciphers/aes.js';
import * as ExpoCrypto from 'expo-crypto';

const KEY_LENGTH = 32; // 256 bits
const NONCE_LENGTH = 12; // 96 bits (standard for AES-GCM)

export interface EncryptedPayload {
  /** Base64url-encoded ciphertext */
  e: string;
  /** Base64url-encoded nonce/IV */
  n: string;
  /** Format version */
  v: 1;
}

/**
 * Generate a random AES-256 key and return it as a base64url string.
 */
export function generateKey(): string {
  const keyBytes = ExpoCrypto.getRandomBytes(KEY_LENGTH);
  return toBase64Url(keyBytes);
}

/**
 * Encrypt a plaintext string with AES-256-GCM.
 * Returns the encrypted payload (ciphertext + nonce) and does NOT include the key.
 */
export function encrypt(plaintext: string, keyBase64Url: string): EncryptedPayload {
  const key = fromBase64Url(keyBase64Url);
  const nonce = ExpoCrypto.getRandomBytes(NONCE_LENGTH);
  const data = new TextEncoder().encode(plaintext);

  const cipher = gcm(key, nonce);
  const ciphertext = cipher.encrypt(data);

  return {
    e: toBase64Url(ciphertext),
    n: toBase64Url(nonce),
    v: 1,
  };
}

/**
 * Decrypt an AES-256-GCM encrypted payload.
 * Returns the plaintext string, or null if decryption fails.
 */
export function decrypt(
  ciphertextBase64Url: string,
  nonceBase64Url: string,
  keyBase64Url: string,
): string | null {
  try {
    const key = fromBase64Url(keyBase64Url);
    const nonce = fromBase64Url(nonceBase64Url);
    const ciphertext = fromBase64Url(ciphertextBase64Url);

    const cipher = gcm(key, nonce);
    const plaintext = cipher.decrypt(ciphertext);

    return new TextDecoder().decode(plaintext);
  } catch {
    return null;
  }
}

/**
 * Check if a deep link parameters object is an encrypted payload.
 */
export function isEncryptedPayload(params: Record<string, unknown>): boolean {
  return typeof params.e === 'string' && typeof params.n === 'string' && (params.v === 1 || params.v === '1');
}

/**
 * Extract the encryption key from a URL fragment.
 * Returns null if the URL has no fragment or it's empty.
 */
export function extractKeyFromFragment(url: string): string | null {
  const hashIndex = url.indexOf('#');
  if (hashIndex === -1) return null;
  const fragment = url.substring(hashIndex + 1);
  return fragment || null;
}

// -- Base64url encoding (RFC 4648 §5, no padding) --

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(str: string): Uint8Array {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4 !== 0) base64 += '=';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
