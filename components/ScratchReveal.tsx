import { useRef, useState, useCallback } from 'react';
import { View, Text, LayoutChangeEvent, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useTheme } from '@/lib/theme';

type Props = {
  content: string;
  onRevealed: () => void;
};

const GRID_SIZE = 16;
const TOTAL_CELLS = GRID_SIZE * GRID_SIZE;
const REVEAL_THRESHOLD = 0.45;
const BRUSH_RADIUS = 1; // scratch a 3x3 area around touch point

export function ScratchReveal({ content, onRevealed }: Props) {
  const { colors } = useTheme();
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [scratchedCells, setScratchedCells] = useState<Set<string>>(new Set());
  const isRevealed = useRef(false);
  const overlayOpacity = useSharedValue(1);
  const dimensionsRef = useRef(dimensions);
  dimensionsRef.current = dimensions;

  const handleLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setDimensions({ width, height });
  }, []);

  const scratchAt = useCallback(
    (x: number, y: number) => {
      const dims = dimensionsRef.current;
      if (isRevealed.current || dims.width === 0) return;

      const cellW = dims.width / GRID_SIZE;
      const cellH = dims.height / GRID_SIZE;
      const col = Math.floor(x / cellW);
      const row = Math.floor(y / cellH);

      setScratchedCells((prev) => {
        let changed = false;
        const next = new Set(prev);

        // Scratch a brush-sized area around the touch point
        for (let dr = -BRUSH_RADIUS; dr <= BRUSH_RADIUS; dr++) {
          for (let dc = -BRUSH_RADIUS; dc <= BRUSH_RADIUS; dc++) {
            const r = row + dr;
            const c = col + dc;
            if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE) {
              const key = `${r}-${c}`;
              if (!next.has(key)) {
                next.add(key);
                changed = true;
              }
            }
          }
        }

        if (!changed) return prev;

        if (next.size / TOTAL_CELLS >= REVEAL_THRESHOLD && !isRevealed.current) {
          isRevealed.current = true;
          overlayOpacity.value = withTiming(0, { duration: 400 });
          setTimeout(() => onRevealed(), 0);
        }

        return next;
      });
    },
    [onRevealed, overlayOpacity],
  );

  const gesture = Gesture.Pan()
    .onBegin((e) => {
      runOnJS(scratchAt)(e.x, e.y);
    })
    .onUpdate((e) => {
      runOnJS(scratchAt)(e.x, e.y);
    })
    .minDistance(0);

  const overlayStyle = useAnimatedStyle(() => ({
    opacity: overlayOpacity.value,
  }));

  const cellW = dimensions.width / GRID_SIZE;
  const cellH = dimensions.height / GRID_SIZE;

  return (
    <View
      className="flex-1 rounded-2xl overflow-hidden"
      style={{
        ...colors.bgCard,
        borderWidth: 1,
        borderColor: colors.cardBorder,
      }}
      onLayout={handleLayout}
    >
      {/* The actual message underneath */}
      <View className="absolute inset-0 items-center justify-center p-8">
        <Text
          className="text-xl text-center leading-relaxed"
          style={{ color: colors.textPrimary }}
        >
          {content}
        </Text>
      </View>

      {/* Scratch overlay */}
      <GestureDetector gesture={gesture}>
        <Animated.View style={[StyleSheet.absoluteFill, overlayStyle]}>
          {/* Instruction text */}
          <View className="absolute inset-0 items-center justify-center z-10 pointer-events-none">
            {scratchedCells.size === 0 && (
              <View className="items-center">
                <Text className="text-6xl mb-4">🎟️</Text>
                <Text
                  className="text-lg font-bold text-center"
                  style={{ color: colors.isDark ? colors.accent : colors.textPrimary }}
                >
                  Scratch to reveal
                </Text>
                <Text
                  className="text-sm mt-2 text-center"
                  style={{ color: colors.textSecondary }}
                >
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
                      width: cellW + 1,
                      height: cellH + 1,
                      backgroundColor: scratched
                        ? 'transparent'
                        : colors.isDark
                          ? 'rgba(57, 255, 20, 0.08)'
                          : '#9ca3af',
                      borderWidth: scratched ? 0 : colors.isDark ? 0.5 : 0,
                      borderColor: colors.isDark ? 'rgba(57, 255, 20, 0.1)' : 'transparent',
                    }}
                  />
                );
              }),
            )}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
