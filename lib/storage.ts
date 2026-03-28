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

export async function hasMessageWithPushId(pushMessageId: string): Promise<boolean> {
  const messages = await getMessages();
  return messages.some((m) => m.pushMessageId === pushMessageId);
}

export async function findMessageByPushId(pushMessageId: string): Promise<Message | undefined> {
  const messages = await getMessages();
  return messages.find((m) => m.pushMessageId === pushMessageId);
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

// -- Recent Recipients --

const RECIPIENTS_KEY = '@fliq/recent_recipients';

export interface RecentRecipient {
  phone: string;
  name?: string;
  lastUsed: string;
}

export async function getRecentRecipients(): Promise<RecentRecipient[]> {
  const raw = await AsyncStorage.getItem(RECIPIENTS_KEY);
  if (!raw) return [];
  return JSON.parse(raw) as RecentRecipient[];
}

/**
 * Save or update a recent recipient. Moves them to the top of the list.
 * Keeps a maximum of 20 recipients.
 */
export async function saveRecentRecipient(phone: string, name?: string): Promise<void> {
  const recipients = await getRecentRecipients();
  const filtered = recipients.filter((r) => r.phone !== phone);
  filtered.unshift({ phone, name, lastUsed: new Date().toISOString() });
  await AsyncStorage.setItem(RECIPIENTS_KEY, JSON.stringify(filtered.slice(0, 20)));
}

export async function clearRecentRecipients(): Promise<void> {
  await AsyncStorage.removeItem(RECIPIENTS_KEY);
}
