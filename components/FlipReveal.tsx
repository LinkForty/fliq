import { useRef } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';

type Props = {
  content: string;
  onRevealed: () => void;
};

const FLIP_DURATION = 600;

export function FlipReveal({ content, onRevealed }: Props) {
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

  // Front face (cover) — visible from 0° to 90°
  const frontStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 1000 },
      { rotateY: `${rotation.value}deg` },
    ],
    backfaceVisibility: 'hidden',
    opacity: rotation.value < 90 ? 1 : 0,
  }));

  // Back face (message) — visible from 90° to 180°
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
          style={[StyleSheet.absoluteFill, backStyle]}
          className="items-center justify-center bg-gray-100 dark:bg-gray-800 p-8 rounded-2xl"
        >
          <Text className="text-xl text-gray-900 dark:text-white text-center leading-relaxed">
            {content}
          </Text>
        </Animated.View>

        {/* Front face (cover) */}
        <Animated.View
          style={[StyleSheet.absoluteFill, frontStyle]}
          className="items-center justify-center bg-indigo-500 dark:bg-indigo-600 p-8 rounded-2xl"
        >
          <Text className="text-6xl mb-4">🃏</Text>
          <Text className="text-lg font-semibold text-white text-center">
            Tap to flip
          </Text>
          <Text className="text-sm text-indigo-200 mt-2 text-center">
            Flip the card to reveal the secret
          </Text>
        </Animated.View>
      </View>
    </Pressable>
  );
}
