import { useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  PanResponder,
  LayoutChangeEvent,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  content: string;
  onRevealed: () => void;
};

const GRID_SIZE = 8; // 8x8 grid = 64 cells
const REVEAL_THRESHOLD = 0.55; // Auto-reveal at 55%

export function ScratchReveal({ content, onRevealed }: Props) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [scratchedCells, setScratchedCells] = useState<Set<string>>(new Set());
  const isRevealed = useRef(false);
  const overlayOpacity = useSharedValue(1);

  const totalCells = GRID_SIZE * GRID_SIZE;

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setDimensions({ width, height });
  }, []);

  const scratchAt = useCallback(
    (x: number, y: number) => {
      if (isRevealed.current || dimensions.width === 0) return;

      const cellW = dimensions.width / GRID_SIZE;
      const cellH = dimensions.height / GRID_SIZE;
      const col = Math.floor(x / cellW);
      const row = Math.floor(y / cellH);

      if (col < 0 || col >= GRID_SIZE || row < 0 || row >= GRID_SIZE) return;

      const key = `${row}-${col}`;

      setScratchedCells((prev) => {
        if (prev.has(key)) return prev;
        const next = new Set(prev);
        next.add(key);

        // Check threshold
        if (next.size / totalCells >= REVEAL_THRESHOLD && !isRevealed.current) {
          isRevealed.current = true;
          overlayOpacity.value = withTiming(0, { duration: 500 });
          onRevealed();
        }

        return next;
      });
    },
    [dimensions, totalCells, onRevealed, overlayOpacity],
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        scratchAt(locationX, locationY);
      },
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        scratchAt(locationX, locationY);
      },
    }),
  ).current;

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const cellW = dimensions.width / GRID_SIZE;
  const cellH = dimensions.height / GRID_SIZE;

  return (
    <View
      className="flex-1 rounded-2xl bg-gray-100 dark:bg-gray-800 overflow-hidden"
      onLayout={handleLayout}
    >
      {/* The actual message underneath */}
      <View className="absolute inset-0 items-center justify-center p-8">
        <Text className="text-xl text-gray-900 dark:text-white text-center leading-relaxed">
          {content}
        </Text>
      </View>

      {/* Scratch overlay */}
      <Animated.View
        style={overlayStyle}
        className="absolute inset-0"
        {...panResponder.panHandlers}
      >
        {/* Instruction text */}
        <View className="absolute inset-0 items-center justify-center z-10 pointer-events-none">
          {scratchedCells.size === 0 && (
            <View className="items-center">
              <Text className="text-6xl mb-4">🎟️</Text>
              <Text className="text-lg font-semibold text-gray-700 dark:text-gray-300 text-center">
                Scratch to reveal
              </Text>
              <Text className="text-sm text-gray-400 dark:text-gray-500 mt-2 text-center">
                Drag your finger to scratch off the surface
              </Text>
            </View>
          )}
        </View>

        {/* Grid cells */}
        {dimensions.width > 0 &&
          Array.from({ length: GRID_SIZE }, (_, row) =>
            Array.from({ length: GRID_SIZE }, (_, col) => {
              const key = `${row}-${col}`;
              const scratched = scratchedCells.has(key);
              return (
                <View
                  key={key}
                  style={{
                    position: 'absolute',
                    left: col * cellW,
                    top: row * cellH,
                    width: cellW,
                    height: cellH,
                    backgroundColor: scratched ? 'transparent' : '#d1d5db',
                  }}
                />
              );
            }),
          )}
      </Animated.View>
    </View>
  );
}
