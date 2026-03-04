import { Link, Stack } from 'expo-router';
import { View, Text } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Not Found' }} />
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900 p-5">
        <Text className="text-xl font-bold text-gray-900 dark:text-white">
          This screen doesn't exist.
        </Text>
        <Link href="/" className="mt-4">
          <Text className="text-indigo-500 text-base">Go to home screen</Text>
        </Link>
      </View>
    </>
  );
}
