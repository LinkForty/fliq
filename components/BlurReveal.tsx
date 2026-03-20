import { useRef, useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { useTheme } from '@/lib/theme';

type Props = {
  content: string;
  onRevealed: () => void;
};

const HOLD_DURATION = 2500; // ms to fully reveal
const TICK_INTERVAL = 50; // update interval

export function BlurReveal({ content, onRevealed }: Props) {
  const { colors } = useTheme();
  const progress = useSharedValue(0); // 0 = fully hidden, 1 = fully revealed
  const isRevealed = useRef(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startReveal = useCallback(() => {
    if (isRevealed.current) return;

    timerRef.current = setInterval(() => {
      progress.value = Math.min(progress.value + TICK_INTERVAL / HOLD_DURATION, 1);
      if (progress.value >= 1 && !isRevealed.current) {
        isRevealed.current = true;
        if (timerRef.current) clearInterval(timerRef.current);
        progress.value = withTiming(1, { duration: 200 });
        onRevealed();
      }
    }, TICK_INTERVAL);
  }, [onRevealed, progress]);

  const stopReveal = useCallback(() => {
    if (isRevealed.current) return;
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    // Snap back
    progress.value = withSpring(0, { damping: 15 });
  }, [progress]);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: 1 - progress.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: 0.95 + progress.value * 0.05 }],
  }));

  return (
    <Pressable
      onPressIn={startReveal}
      onPressOut={stopReveal}
      className="flex-1"
    >
      <View
        className="flex-1 rounded-2xl overflow-hidden items-center justify-center p-8"
        style={{
          ...colors.bgCard,
          borderWidth: 1,
          borderColor: colors.isDark ? colors.accentBorder : colors.cardBorder,
        }}
      >
        {/* The actual message */}
        <Animated.View style={textStyle} className="absolute inset-0 items-center justify-center p-8">
          <Text
            className="text-xl text-center leading-relaxed"
            style={{ color: colors.textPrimary }}
          >
            {content}
          </Text>
        </Animated.View>

        {/* The blur overlay */}
        <Animated.View
          style={[
            overlayStyle,
            {
              ...colors.revealCoverBg,
              borderWidth: 1,
              borderColor: colors.revealCoverBorder,
            },
          ]}
          className="absolute inset-0 items-center justify-center"
        >
          <Text className="text-6xl mb-4">🔒</Text>
          <Text
            className="text-lg font-bold text-center"
            style={{ color: colors.isDark ? colors.accent : colors.textPrimary }}
          >
            Tap and hold to reveal
          </Text>
          <Text
            className="text-sm mt-2 text-center"
            style={{ color: colors.textSecondary }}
          >
            Keep holding until the secret is fully revealed
          </Text>
        </Animated.View>
      </View>
    </Pressable>
  );
}
