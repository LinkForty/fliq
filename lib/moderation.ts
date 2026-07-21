import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiBase } from './push';
import { getAuthHeaders } from './auth';

const BLOCKLIST_KEY = '@fliq/blocked_phones';

export type ReportReason = 'harassment' | 'hate' | 'sexual' | 'violence' | 'spam' | 'other';

export const REPORT_REASONS: { value: ReportReason; label: string }[] = [
  { value: 'harassment', label: 'Harassment or bullying' },
  { value: 'hate', label: 'Hate speech' },
  { value: 'sexual', label: 'Sexual content' },
  { value: 'violence', label: 'Violence or threats' },
  { value: 'spam', label: 'Spam' },
  { value: 'other', label: 'Something else' },
];

/** Digits-only normalization, matching the server's normalizePhone. */
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return '1' + digits;
  return digits;
}

/**
 * Report a message to the developer. Reports are reviewed within 24 hours.
 * The decrypted content is included because the server only ever stores
 * ciphertext — the report is the only way a moderator can see what was sent.
 */
export async function reportMessage(params: {
  senderPhone?: string;
  senderName?: string;
  messageId?: string;
  content?: string;
  reason: ReportReason;
  details?: string;
}): Promise<{ ok: true } | { error: string }> {
  try {
    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${getApiBase()}/api/reports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body: JSON.stringify({
        senderPhone: params.senderPhone || undefined,
        senderName: params.senderName || undefined,
        messageId: params.messageId || undefined,
        messageContent: params.content || undefined,
        reason: params.reason,
        details: params.details || undefined,
      }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { error: data.message || 'Failed to submit report. Please try again.' };
    }
    return { ok: true };
  } catch {
    return { error: 'Could not reach the server. Check your connection and try again.' };
  }
}

// ── Blocklist ──────────────────────────────────────────────────────────
// The server enforces blocks (drops messages from blocked senders); a local
// copy lets the app hide already-received messages and render the list offline.

export async function getLocalBlocklist(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(BLOCKLIST_KEY);
  if (!raw) return [];
  return JSON.parse(raw) as string[];
}

async function saveLocalBlocklist(phones: string[]): Promise<void> {
  await AsyncStorage.setItem(BLOCKLIST_KEY, JSON.stringify(phones));
}

export async function isBlocked(phone: string): Promise<boolean> {
  const blocklist = await getLocalBlocklist();
  return blocklist.includes(normalizePhone(phone));
}

export async function blockSender(phone: string): Promise<{ ok: true } | { error: string }> {
  const normalized = normalizePhone(phone);
  try {
    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${getApiBase()}/api/blocks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders },
      body: JSON.stringify({ phone: normalized }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { error: data.message || 'Failed to block. Please try again.' };
    }
  } catch {
    return { error: 'Could not reach the server. Check your connection and try again.' };
  }

  const blocklist = await getLocalBlocklist();
  if (!blocklist.includes(normalized)) {
    await saveLocalBlocklist([...blocklist, normalized]);
  }
  return { ok: true };
}

export async function unblockSender(phone: string): Promise<{ ok: true } | { error: string }> {
  const normalized = normalizePhone(phone);
  try {
    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${getApiBase()}/api/blocks/${encodeURIComponent(normalized)}`, {
      method: 'DELETE',
      headers: { ...authHeaders },
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { error: data.message || 'Failed to unblock. Please try again.' };
    }
  } catch {
    return { error: 'Could not reach the server. Check your connection and try again.' };
  }

  const blocklist = await getLocalBlocklist();
  await saveLocalBlocklist(blocklist.filter((p) => p !== normalized));
  return { ok: true };
}

/** Refresh the local blocklist from the server. Best-effort. */
export async function syncBlocklist(): Promise<string[]> {
  try {
    const authHeaders = await getAuthHeaders();
    const res = await fetch(`${getApiBase()}/api/blocks`, { headers: { ...authHeaders } });
    if (res.ok) {
      const data = await res.json();
      const phones = (data.blocks as { phone: string }[]).map((b) => b.phone);
      await saveLocalBlocklist(phones);
      return phones;
    }
  } catch {
    // Offline — fall back to the cached copy
  }
  return getLocalBlocklist();
}
