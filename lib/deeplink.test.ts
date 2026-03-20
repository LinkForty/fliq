import { describe, it, expect } from 'vitest';
import {
  encodeMessage,
  decodeMessage,
  generateShareUrl,
  generateLegacyShareUrl,
  parseDeepLink,
  isPayloadTooLarge,
  type MessagePayload,
} from './deeplink';

const SAMPLE_PAYLOAD: MessagePayload = {
  content: 'Meet me at the coffee shop at 3pm',
  revealStyle: 'flick',
  senderName: 'Alex',
};

describe('deeplink', () => {
  describe('encodeMessage + decodeMessage roundtrip', () => {
    it('roundtrips a simple payload', () => {
      const encoded = encodeMessage(SAMPLE_PAYLOAD);
      expect(typeof encoded).toBe('string');
      expect(encoded.length).toBeGreaterThan(0);

      const decoded = decodeMessage(encoded);
      expect(decoded).toEqual(SAMPLE_PAYLOAD);
    });

    it('handles unicode content', () => {
      const payload: MessagePayload = {
        content: 'Secret 🤫 with ünïcödé',
        revealStyle: 'blur',
        senderName: 'Ünïcödé Üser',
      };
      const decoded = decodeMessage(encodeMessage(payload));
      expect(decoded).toEqual(payload);
    });

    it('returns null for malformed base64', () => {
      expect(decodeMessage('not-valid-base64!!!')).toBeNull();
    });

    it('returns null for valid base64 but invalid JSON', () => {
      const encoded = btoa('not json');
      expect(decodeMessage(encoded)).toBeNull();
    });
  });

  describe('generateShareUrl', () => {
    it('produces a valid encrypted URL', () => {
      const url = generateShareUrl(SAMPLE_PAYLOAD);
      expect(url).toContain('https://fliq.linkforty.com/s?e=');
      expect(url).toContain('&n=');
      expect(url).toContain('#');
    });

    it('produces a URL that can be parsed back', () => {
      const url = generateShareUrl(SAMPLE_PAYLOAD);
      const parsed = parseDeepLink(url);
      expect(parsed).toEqual(SAMPLE_PAYLOAD);
    });

    it('works with different reveal styles', () => {
      const styles = ['flick', 'blur', 'scratch', 'typewriter', 'flip'] as const;
      for (const style of styles) {
        const payload: MessagePayload = { ...SAMPLE_PAYLOAD, revealStyle: style };
        const url = generateShareUrl(payload);
        const parsed = parseDeepLink(url);
        expect(parsed).toEqual(payload);
      }
    });

    it('generates unique URLs each time (different encryption)', () => {
      const url1 = generateShareUrl(SAMPLE_PAYLOAD);
      const url2 = generateShareUrl(SAMPLE_PAYLOAD);
      expect(url1).not.toBe(url2);
    });
  });

  describe('generateLegacyShareUrl', () => {
    it('produces a valid legacy URL with m= param', () => {
      const url = generateLegacyShareUrl(SAMPLE_PAYLOAD);
      expect(url).toContain('https://fliq.linkforty.com/s?m=');
    });

    it('can be parsed back via parseDeepLink', () => {
      const url = generateLegacyShareUrl(SAMPLE_PAYLOAD);
      const parsed = parseDeepLink(url);
      expect(parsed).toEqual(SAMPLE_PAYLOAD);
    });
  });

  describe('parseDeepLink', () => {
    it('parses encrypted URLs', () => {
      const url = generateShareUrl(SAMPLE_PAYLOAD);
      expect(parseDeepLink(url)).toEqual(SAMPLE_PAYLOAD);
    });

    it('parses legacy URLs', () => {
      const url = generateLegacyShareUrl(SAMPLE_PAYLOAD);
      expect(parseDeepLink(url)).toEqual(SAMPLE_PAYLOAD);
    });

    it('returns null for URLs with no message params', () => {
      expect(parseDeepLink('https://fliq.linkforty.com/s')).toBeNull();
    });

    it('returns null for encrypted URL without key fragment', () => {
      // Strip the fragment
      const url = generateShareUrl(SAMPLE_PAYLOAD).split('#')[0];
      expect(parseDeepLink(url)).toBeNull();
    });

    it('returns null for completely invalid URLs', () => {
      expect(parseDeepLink('not a url')).toBeNull();
    });
  });

  describe('isPayloadTooLarge', () => {
    it('returns false for normal-length messages', () => {
      expect(isPayloadTooLarge(SAMPLE_PAYLOAD)).toBe(false);
    });

    it('returns false for messages under 500 chars', () => {
      const payload: MessagePayload = {
        content: 'A'.repeat(400),
        revealStyle: 'flick',
        senderName: 'Alex',
      };
      expect(isPayloadTooLarge(payload)).toBe(false);
    });

    it('returns true for extremely long messages', () => {
      const payload: MessagePayload = {
        content: 'A'.repeat(2000),
        revealStyle: 'flick',
        senderName: 'Alex',
      };
      expect(isPayloadTooLarge(payload)).toBe(true);
    });
  });
});
