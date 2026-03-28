import { useCallback, useState } from 'react';
import { View, Text, FlatList, Pressable, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { getMessages, deleteMessage } from '@/lib/storage';
import { trackEvent } from '@/lib/sdk';
import { timeAgo } from '@/lib/time';
import { REVEAL_STYLES } from '@/lib/reveal-styles';
import { useTheme } from '@/lib/theme';
import type { Message } from '@/lib/types';

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
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
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {messages.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 24,
              backgroundColor: colors.accentBg,
              borderWidth: 1,
              borderColor: colors.accentBorder,
              ...(colors.isDark && {
                shadowColor: colors.accent,
                shadowOpacity: 0.3,
                shadowRadius: 20,
                shadowOffset: { width: 0, height: 0 },
              }),
            }}
          >
            <Text style={{ fontSize: 36, lineHeight: 44 }}>🤫</Text>
          </View>
          <Text style={{ fontSize: 20, fontWeight: '700', color: colors.textPrimary, textAlign: 'center' }}>
            No secrets yet
          </Text>
          <Text style={{ marginTop: 8, color: colors.textSecondary, textAlign: 'center' }}>
            Send your first secret message
          </Text>
        </View>
      ) : (
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: insets.bottom + 80 }}
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
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      )}

      {/* FAB */}
      <Pressable
        onPress={() => router.push('/create')}
        style={{
          position: 'absolute',
          bottom: insets.bottom + 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: colors.accent,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: colors.accent,
          shadowOpacity: 0.4,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
          elevation: 8,
        }}
      >
        <Text style={{ color: colors.accentText, fontSize: 30, fontWeight: '300', lineHeight: 32 }}>+</Text>
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
          style={{
            backgroundColor: '#ef4444',
            borderRadius: 16,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 20,
            marginLeft: 12,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>Delete</Text>
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
  const { colors } = useTheme();
  const style = REVEAL_STYLES[message.revealStyle];
  const senderLabel =
    message.direction === 'sent' ? 'You' : message.senderName;

  return (
    <Pressable
      onPress={onPress}
      style={{
        borderRadius: 16,
        padding: 16,
        ...colors.bgCard,
        borderWidth: 1,
        borderColor: message.isRead ? colors.cardBorder : colors.cardBorderUnread,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
              backgroundColor: colors.accentBg,
              borderWidth: 1,
              borderColor: colors.accentBorder,
            }}
          >
            <Text style={{ fontSize: 20, lineHeight: 26 }}>{style.emoji}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontWeight: '700', color: colors.textPrimary }}>
                {senderLabel}
              </Text>
              <View
                style={{
                  marginLeft: 8,
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderRadius: 4,
                  backgroundColor: colors.accentBg,
                }}
              >
                <Text style={{ color: colors.accent, fontSize: 10, fontWeight: '700', textTransform: 'uppercase' }}>
                  {style.label}
                </Text>
              </View>
              {!message.isRead && (
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: colors.accent,
                    marginLeft: 8,
                  }}
                />
              )}
            </View>
            <Text style={{ fontSize: 12, color: colors.textTertiary, marginTop: 2 }}>
              {message.direction === 'sent' ? '↑ Sent' : '↓ Received'} · {timeAgo(message.createdAt)}
            </Text>
          </View>
        </View>
        <Text style={{ color: colors.textTertiary, fontSize: 18 }}>›</Text>
      </View>
    </Pressable>
  );
}
