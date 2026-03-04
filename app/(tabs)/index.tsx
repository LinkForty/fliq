import { useCallback, useState } from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { getMessages } from '@/lib/storage';
import { timeAgo } from '@/lib/time';
import { REVEAL_STYLES } from '@/lib/reveal-styles';
import type { Message } from '@/lib/types';

export default function HomeScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);

  useFocusEffect(
    useCallback(() => {
      getMessages().then(setMessages);
    }, []),
  );

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      {messages.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="text-5xl mb-4">🤫</Text>
          <Text className="text-xl font-bold text-gray-900 dark:text-white text-center">
            No secrets yet
          </Text>
          <Text className="mt-2 text-gray-500 dark:text-gray-400 text-center">
            Create your first secret message and share it with someone!
          </Text>
        </View>
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerClassName="p-4"
          renderItem={({ item }) => (
            <MessageCard
              message={item}
              onPress={() => router.push(`/reveal/${item.id}`)}
            />
          )}
          ItemSeparatorComponent={() => <View className="h-3" />}
        />
      )}

      {/* FAB */}
      <Pressable
        onPress={() => router.push('/create')}
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-indigo-500 items-center justify-center shadow-lg active:bg-indigo-600"
      >
        <Text className="text-white text-3xl font-light leading-none">+</Text>
      </Pressable>
    </View>
  );
}

function MessageCard({
  message,
  onPress,
}: {
  message: Message;
  onPress: () => void;
}) {
  const style = REVEAL_STYLES[message.revealStyle];
  const senderLabel =
    message.direction === 'sent' ? 'You' : message.senderName;

  return (
    <Pressable
      onPress={onPress}
      className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 active:opacity-80"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <Text className="text-2xl mr-3">{style.emoji}</Text>
          <View className="flex-1">
            <View className="flex-row items-center">
              <Text
                className={`font-semibold ${
                  message.isRead
                    ? 'text-gray-700 dark:text-gray-300'
                    : 'text-gray-900 dark:text-white'
                }`}
              >
                {senderLabel}
              </Text>
              {!message.isRead && (
                <View className="w-2 h-2 rounded-full bg-indigo-500 ml-2" />
              )}
            </View>
            <Text className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {style.label} · {timeAgo(message.createdAt)}
            </Text>
          </View>
        </View>
        <Text className="text-xs text-gray-400 dark:text-gray-500">
          {message.direction === 'sent' ? '↑ Sent' : '↓ Received'}
        </Text>
      </View>
    </Pressable>
  );
}
