import type { RevealStyle } from './types';

type StyleMeta = {
  label: string;
  emoji: string;
  description: string;
};

export const REVEAL_STYLES: Record<RevealStyle, StyleMeta> = {
  scratch: {
    label: 'Scratch-off',
    emoji: '🎟️',
    description: 'Scratch to reveal',
  },
  blur: {
    label: 'Blur fade',
    emoji: '👁️',
    description: 'Tap and hold to reveal',
  },
  typewriter: {
    label: 'Typewriter',
    emoji: '⌨️',
    description: 'Watch it type out',
  },
  flip: {
    label: 'Flip card',
    emoji: '🃏',
    description: 'Flip to reveal',
  },
};
