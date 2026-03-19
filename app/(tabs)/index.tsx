import { useCallback, useState } from 'react';
import { View, Text, FlatList, Pressable, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { getMessages, deleteMessage } from '@/lib/storage';
import { trackEvent } from '@/lib/sdk';
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

  const handleDelete = useCallback((id: string, name: string) => {
    Alert.alert('Delete Message', `Delete secret from ${name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteMessage(id);
          trackEvent('message_deleted', { direction: 'manual' });
          setMessages((prev) => prev.filter((m) => m.id !== id));
        },
      },
    ]);
  }, []);

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      {messages.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <View className="w-16 h-16 items-center justify-center mb-4" style={{ overflow: 'visible' }}>
            <Text style={{ fontSize: 48, lineHeight: 58 }}>🤫</Text>
          </View>
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
          contentContainerClassName="px-4 pt-2 pb-4"
          renderItem={({ item }) => (
            <SwipeableMessageCard
              message={item}
              onPress={() => router.push(`/reveal/${item.id}`)}
              onDelete={() =>
                handleDelete(
                  item.id,
                  item.direction === 'sent' ? 'You' : item.senderName,
                )
              }
            />
          )}
          ItemSeparatorComponent={() => <View className="h-3" />}
        />
      )}

      {/* FAB */}
      <Pressable
        onPress={() => router.push('/create')}
        className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-brand-500 items-center justify-center shadow-lg active:bg-brand-600"
      >
        <Text className="text-white text-3xl font-light leading-none">+</Text>
      </Pressable>
    </View>
  );
}

function SwipeableMessageCard({
  message,
  onPress,
  onDelete,
}: {
  message: Message;
  onPress: () => void;
  onDelete: () => void;
}) {
  return (
    <Swipeable
      friction={2}
      rightThreshold={40}
      renderRightActions={() => (
        <Pressable
          onPress={onDelete}
          className="bg-red-500 rounded-2xl justify-center items-center px-5 ml-3"
        >
          <Text className="text-white text-xs font-semibold">Delete</Text>
        </Pressable>
      )}
    >
      <MessageCard message={message} onPress={onPress} />
    </Swipeable>
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
      className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 active:opacity-80 overflow-visible"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View className="w-9 h-9 items-center justify-center mr-3" style={{ overflow: 'visible' }}>
            <Text style={{ fontSize: 24, lineHeight: 32 }}>{style.emoji}</Text>
          </View>
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
                <View className="w-2 h-2 rounded-full bg-brand-500 ml-2" />
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
