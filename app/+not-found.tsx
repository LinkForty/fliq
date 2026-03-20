import { Link, Stack } from 'expo-router';
import { View, Text } from 'react-native';
import { useTheme } from '@/lib/theme';

export default function NotFoundScreen() {
  const { colors } = useTheme();

  return (
    <>
      <Stack.Screen options={{ title: 'Not Found' }} />
      <View
        className="flex-1 items-center justify-center p-5"
        style={{ backgroundColor: colors.bg }}
      >
        <Text
          className="text-xl font-bold"
          style={{ color: colors.textPrimary }}
        >
          This screen doesn't exist.
        </Text>
        <Link href="/" className="mt-4">
          <Text className="text-base" style={{ color: colors.accent }}>Go to home screen</Text>
        </Link>
      </View>
    </>
  );
}
