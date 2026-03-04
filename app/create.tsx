import { View, Text } from 'react-native';

export default function CreateScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
      <Text className="text-xl font-semibold text-gray-900 dark:text-white">Create Secret</Text>
      <Text className="mt-2 text-gray-500 dark:text-gray-400">
        Compose a secret message and choose a reveal style
      </Text>
    </View>
  );
}
