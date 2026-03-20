import { useRef } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { useTheme } from '@/lib/theme';

type Props = {
  content: string;
  onRevealed: () => void;
};

const FLIP_DURATION = 600;

export function FlipReveal({ content, onRevealed }: Props) {
  const { colors } = useTheme();
  const rotation = useSharedValue(0); // 0 = front showing, 180 = back showing
  const hasRevealed = useRef(false);

  function handleFlip() {
    if (hasRevealed.current) return;
    hasRevealed.current = true;

    rotation.value = withTiming(
      180,
      { duration: FLIP_DURATION, easing: Easing.inOut(Easing.cubic) },
      () => {
        runOnJS(onRevealed)();
      },
    );
  }

  // Front face (cover) — visible from 0deg to 90deg
  const frontStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: `${rotation.value}deg` },
    ],
    backfaceVisibility: 'hidden',
    opacity: rotation.value < 90 ? 1 : 0,
  }));

  // Back face (message) — visible from 90deg to 180deg
  const backStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: `${rotation.value - 180}deg` },
    ],
    backfaceVisibility: 'hidden',
    opacity: rotation.value >= 90 ? 1 : 0,
  }));

  return (
    <Pressable onPress={handleFlip} className="flex-1">
      <View className="flex-1 rounded-2xl overflow-hidden">
        {/* Back face (message) — rendered first so it's behind */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            backStyle,
            {
              ...colors.bgCard,
              borderWidth: 1,
              borderColor: colors.cardBorder,
            },
          ]}
          className="items-center justify-center p-8 rounded-2xl"
        >
          <Text
            className="text-xl text-center leading-relaxed"
            style={{ color: colors.textPrimary }}
          >
            {content}
          </Text>
        </Animated.View>

        {/* Front face (cover) */}
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            frontStyle,
            {
              ...colors.revealCoverBg,
              borderWidth: 1,
              borderColor: colors.revealCoverBorder,
            },
          ]}
          className="items-center justify-center p-8 rounded-2xl"
        >
          <Text className="text-6xl mb-4">🃏</Text>
          <Text
            className="text-lg font-bold text-center"
            style={{ color: colors.isDark ? colors.accent : '#ffffff' }}
          >
            Tap to flip
          </Text>
          <Text
            className="text-sm mt-2 text-center"
            style={{ color: colors.isDark ? colors.textSecondary : 'rgba(255,255,255,0.8)' }}
          >
            Flip the card to reveal the secret
          </Text>
        </Animated.View>
      </View>
    </Pressable>
  );
}
