import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function RevealScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
      <Text className="text-xl font-semibold text-gray-900 dark:text-white">Reveal</Text>
      <Text className="mt-2 text-gray-500 dark:text-gray-400">
        Message ID: {id}
      </Text>
    </View>
  );
}
