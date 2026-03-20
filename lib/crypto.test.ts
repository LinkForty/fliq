import { describe, it, expect } from 'vitest';
import { generateKey, encrypt, decrypt, extractKeyFromFragment } from './crypto';

describe('crypto', () => {
  describe('generateKey', () => {
    it('returns a non-empty base64url string', () => {
      const key = generateKey();
      expect(key).toBeTruthy();
      expect(typeof key).toBe('string');
      expect(key.length).toBeGreaterThan(0);
    });

    it('generates unique keys each time', () => {
      const keys = new Set(Array.from({ length: 10 }, () => generateKey()));
      expect(keys.size).toBe(10);
    });
  });

  describe('encrypt + decrypt roundtrip', () => {
    it('encrypts and decrypts a simple message', () => {
      const key = generateKey();
      const plaintext = 'Meet me at the coffee shop at 3pm';
      const encrypted = encrypt(plaintext, key);

      expect(encrypted.e).toBeTruthy();
      expect(encrypted.n).toBeTruthy();
      expect(encrypted.v).toBe(1);

      const decrypted = decrypt(encrypted.e, encrypted.n, key);
      expect(decrypted).toBe(plaintext);
    });

    it('handles empty string', () => {
      const key = generateKey();
      const encrypted = encrypt('', key);
      const decrypted = decrypt(encrypted.e, encrypted.n, key);
      expect(decrypted).toBe('');
    });

    it('handles unicode and emoji', () => {
      const key = generateKey();
      const plaintext = 'Secret 🤫 with ünïcödé and 日本語';
      const encrypted = encrypt(plaintext, key);
      const decrypted = decrypt(encrypted.e, encrypted.n, key);
      expect(decrypted).toBe(plaintext);
    });

    it('handles long messages', () => {
      const key = generateKey();
      const plaintext = 'A'.repeat(500);
      const encrypted = encrypt(plaintext, key);
      const decrypted = decrypt(encrypted.e, encrypted.n, key);
      expect(decrypted).toBe(plaintext);
    });

    it('handles JSON payloads (as used in the app)', () => {
      const key = generateKey();
      const payload = JSON.stringify({
        content: 'The party starts at 8pm',
        revealStyle: 'flick',
        senderName: 'Alex',
      });
      const encrypted = encrypt(payload, key);
      const decrypted = decrypt(encrypted.e, encrypted.n, key);
      expect(decrypted).toBe(payload);
      expect(JSON.parse(decrypted!).content).toBe('The party starts at 8pm');
    });

    it('fails to decrypt with wrong key', () => {
      const key1 = generateKey();
      const key2 = generateKey();
      const encrypted = encrypt('secret message', key1);
      const decrypted = decrypt(encrypted.e, encrypted.n, key2);
      expect(decrypted).toBeNull();
    });

    it('fails to decrypt with tampered ciphertext', () => {
      const key = generateKey();
      const encrypted = encrypt('secret message', key);
      const tampered = encrypted.e.slice(0, -2) + 'XX';
      const decrypted = decrypt(tampered, encrypted.n, key);
      expect(decrypted).toBeNull();
    });

    it('produces different ciphertext for the same plaintext (unique nonce)', () => {
      const key = generateKey();
      const e1 = encrypt('same message', key);
      const e2 = encrypt('same message', key);
      expect(e1.e).not.toBe(e2.e);
      expect(e1.n).not.toBe(e2.n);
    });
  });

  describe('extractKeyFromFragment', () => {
    it('extracts key from URL with fragment', () => {
      const key = generateKey();
      const url = `https://fliq.linkforty.com/s?e=abc&n=def#${key}`;
      expect(extractKeyFromFragment(url)).toBe(key);
    });

    it('returns null for URL without fragment', () => {
      expect(extractKeyFromFragment('https://fliq.linkforty.com/s?e=abc')).toBeNull();
    });

    it('returns null for empty fragment', () => {
      expect(extractKeyFromFragment('https://fliq.linkforty.com/s#')).toBeNull();
    });
  });
});
