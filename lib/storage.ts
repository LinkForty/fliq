import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Message } from './types';

const MESSAGES_KEY = '@fliq/messages';

export async function getMessages(): Promise<Message[]> {
  const raw = await AsyncStorage.getItem(MESSAGES_KEY);
  if (!raw) return [];
  return JSON.parse(raw) as Message[];
}

export async function saveMessage(message: Message): Promise<void> {
  const messages = await getMessages();
  messages.unshift(message);
  await AsyncStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
}

export async function markAsRead(id: string): Promise<void> {
  const messages = await getMessages();
  const updated = messages.map((m) =>
    m.id === id ? { ...m, isRead: true } : m,
  );
  await AsyncStorage.setItem(MESSAGES_KEY, JSON.stringify(updated));
}

export async function deleteMessage(id: string): Promise<void> {
  const messages = await getMessages();
  const filtered = messages.filter((m) => m.id !== id);
  await AsyncStorage.setItem(MESSAGES_KEY, JSON.stringify(filtered));
}

export async function clearMessages(): Promise<void> {
  await AsyncStorage.removeItem(MESSAGES_KEY);
}
