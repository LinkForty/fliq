import { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  content: string;
  onRevealed: () => void;
};

const CHAR_DELAY = 45; // ms per character

export function TypewriterReveal({ content, onRevealed }: Props) {
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
        <View className="flex-1 rounded-2xl bg-gray-100 dark:bg-gray-800 overflow-hidden items-center justify-center p-8">
          <Text className="text-6xl mb-4">⌨️</Text>
          <Text className="text-lg font-semibold text-gray-700 dark:text-gray-300 text-center">
            Tap to start typing
          </Text>
          <Text className="text-sm text-gray-400 dark:text-gray-500 mt-2 text-center">
            Watch the secret message type itself out
          </Text>
        </View>
      </Pressable>
    );
  }

  const done = visibleCount >= content.length;

  return (
    <View className="flex-1 rounded-2xl bg-gray-100 dark:bg-gray-800 overflow-hidden items-center justify-center p-8">
      <Text className="text-xl text-gray-900 dark:text-white text-center leading-relaxed">
        {content.slice(0, visibleCount)}
        {!done && (
          <Animated.Text style={cursorStyle} className="text-indigo-500">
            |
          </Animated.Text>
        )}
      </Text>
    </View>
  );
}
