import { Stack, useRouter } from 'expo-router';
import { Pressable, Text } from 'react-native';

export default function TabLayout() {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'Fliq',
          headerRight: () => (
            <Pressable onPress={() => router.push('/settings')} className="px-2">
              <Text className="text-2xl">⚙️</Text>
            </Pressable>
          ),
        }}
      />
    </Stack>
  );
}
