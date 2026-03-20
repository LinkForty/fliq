import { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useTheme } from '@/lib/theme';

type Props = {
  content: string;
  onRevealed: () => void;
};

const CHAR_DELAY = 45; // ms per character

export function TypewriterReveal({ content, onRevealed }: Props) {
  const { colors } = useTheme();
  const [started, setStarted] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);
  const hasRevealed = useRef(false);
  const cursorOpacity = useSharedValue(1);

  // Blinking cursor
  useEffect(() => {
    cursorOpacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 400 }),
        withTiming(1, { duration: 400 }),
      ),
      -1,
      true,
    );
  }, [cursorOpacity]);

  // Typing effect
  useEffect(() => {
    if (!started) return;

    const interval = setInterval(() => {
      setVisibleCount((prev) => {
        const next = prev + 1;
        if (next >= content.length && !hasRevealed.current) {
          hasRevealed.current = true;
          clearInterval(interval);
          setTimeout(() => onRevealed(), 300);
        }
        return Math.min(next, content.length);
      });
    }, CHAR_DELAY);

    return () => clearInterval(interval);
  }, [started, content, onRevealed]);

  const cursorStyle = useAnimatedStyle(() => ({
    opacity: cursorOpacity.value,
  }));

  if (!started) {
    return (
      <Pressable onPress={() => setStarted(true)} className="flex-1">
        <View
          className="flex-1 rounded-2xl overflow-hidden items-center justify-center p-8"
          style={
            colors.isDark
              ? {
                  ...colors.revealCoverBg,
                  borderWidth: 1,
                  borderColor: colors.revealCoverBorder,
                }
              : {
                  ...colors.bgCard,
                  borderWidth: 1,
                  borderColor: colors.cardBorder,
                }
          }
        >
          <Text className="text-6xl mb-4">⌨️</Text>
          <Text
            className="text-lg font-bold text-center"
            style={{ color: colors.isDark ? colors.accent : colors.textPrimary }}
          >
            Tap to start typing
          </Text>
          <Text
            className="text-sm mt-2 text-center"
            style={{ color: colors.textSecondary }}
          >
            Watch the secret message type itself out
          </Text>
        </View>
      </Pressable>
    );
  }

  const done = visibleCount >= content.length;

  return (
    <View
      className="flex-1 rounded-2xl overflow-hidden items-center justify-center p-8"
      style={{
        ...colors.bgCard,
        borderWidth: 1,
        borderColor: colors.cardBorder,
      }}
    >
      <Text
        className="text-xl text-center leading-relaxed"
        style={{ color: colors.textPrimary }}
      >
        {content.slice(0, visibleCount)}
        {!done && (
          <Animated.Text style={[cursorStyle, { color: colors.accent }]}>
            |
          </Animated.Text>
        )}
      </Text>
    </View>
  );
}
