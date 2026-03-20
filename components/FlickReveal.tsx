import { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '@/lib/theme';

type Props = {
  content: string;
  onRevealed: () => void;
};

const FLICK_THRESHOLD = 2.5; // g-force needed to trigger
const COOLDOWN_MS = 500;

export function FlickReveal({ content, onRevealed }: Props) {
  const { colors } = useTheme();
  const [revealed, setRevealed] = useState(false);
  const lastFlickTime = useRef(0);
  const hasRevealed = useRef(false);

  const coverTranslateY = useSharedValue(0);
  const coverOpacity = useSharedValue(1);
  const contentOpacity = useSharedValue(0);
  const hintScale = useSharedValue(1);

  // Pulse the hint icon
  useEffect(() => {
    const interval = setInterval(() => {
      if (!hasRevealed.current) {
        hintScale.value = withSequence(
          withTiming(1.15, { duration: 300 }),
          withTiming(1, { duration: 300 }),
        );
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [hintScale]);

  useEffect(() => {
    Accelerometer.setUpdateInterval(50);

    const subscription = Accelerometer.addListener(({ x, y, z }) => {
      if (hasRevealed.current) return;

      const magnitude = Math.sqrt(x * x + y * y + z * z);
      const now = Date.now();

      if (magnitude > FLICK_THRESHOLD && now - lastFlickTime.current > COOLDOWN_MS) {
        lastFlickTime.current = now;
        hasRevealed.current = true;

        // Animate the cover flying off
        coverTranslateY.value = withTiming(-800, {
          duration: 500,
          easing: Easing.out(Easing.cubic),
        });
        coverOpacity.value = withTiming(0, { duration: 400 });
        contentOpacity.value = withTiming(1, { duration: 600 });

        setRevealed(true);
        setTimeout(() => onRevealed(), 0);
      }
    });

    return () => subscription.remove();
  }, [coverTranslateY, coverOpacity, contentOpacity, onRevealed]);

  const coverStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: coverTranslateY.value }],
    opacity: coverOpacity.value,
  }));

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }));

  const hintStyle = useAnimatedStyle(() => ({
    transform: [{ scale: hintScale.value }],
  }));

  return (
    <View
      className="flex-1 rounded-2xl overflow-hidden"
      style={{
        ...colors.bgCard,
        borderWidth: 1,
        borderColor: colors.isDark ? colors.accentBorder : colors.cardBorder,
      }}
    >
      {/* Message underneath */}
      <Animated.View
        style={[StyleSheet.absoluteFill, contentStyle]}
        className="items-center justify-center p-8"
      >
        <Text
          className="text-xl text-center leading-relaxed"
          style={{ color: colors.textPrimary }}
        >
          {content}
        </Text>
      </Animated.View>

      {/* Cover on top */}
      {!revealed && (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            coverStyle,
            {
              ...colors.revealCoverBg,
              borderWidth: 1,
              borderColor: colors.revealCoverBorder,
            },
          ]}
          className="items-center justify-center"
        >
          <Animated.View style={hintStyle} className="items-center">
            <Text className="text-6xl mb-4">🫰</Text>
            <Text
              className="text-lg font-bold text-center"
              style={{ color: colors.isDark ? colors.accent : colors.textPrimary }}
            >
              Flick to reveal
            </Text>
            <Text
              className="text-sm mt-2 text-center px-8"
              style={{ color: colors.textSecondary }}
            >
              Give your phone a quick flick!
            </Text>
          </Animated.View>
        </Animated.View>
      )}
    </View>
  );
}
