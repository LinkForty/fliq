import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const AUTH_TOKEN_KEY = '@fliq/auth_token';

function getApiBase(): string {
  if (__DEV__) {
    return Platform.OS === 'android' ? 'http://10.0.2.2:3100' : 'http://localhost:3100';
  }
  return Constants.expoConfig?.extra?.pushApiUrl ?? 'https://fliq-api.example.com';
}

export async function getAuthToken(): Promise<string | null> {
  return AsyncStorage.getItem(AUTH_TOKEN_KEY);
}

export async function saveAuthToken(token: string): Promise<void> {
  await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
}

export async function clearAuthToken(): Promise<void> {
  await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
}

/**
 * Get auth headers for API requests.
 * Returns empty object if no token is stored.
 */
export async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await getAuthToken();
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

/**
 * Send an OTP code to the given phone number.
 * Returns { sent: true } if OTP was sent, { alreadyVerified: true, token } if phone was cached,
 * or { error } on failure.
 */
export async function sendOtp(phone: string): Promise<
  | { sent: true; alreadyVerified?: never; token?: never; error?: never }
  | { sent?: never; alreadyVerified: true; token: string; error?: never }
  | { sent?: never; alreadyVerified?: never; token?: never; error: string }
> {
  try {
    const res = await fetch(`${getApiBase()}/api/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.message || 'Failed to send verification code.' };
    }

    if (data.alreadyVerified && data.token) {
      await saveAuthToken(data.token);
      return { alreadyVerified: true, token: data.token };
    }

    return { sent: true };
  } catch {
    return { error: 'Could not reach the server. Check your connection and try again.' };
  }
}

/**
 * Verify an OTP code and receive a JWT token.
 */
export async function verifyOtp(phone: string, code: string): Promise<
  | { token: string; error?: never }
  | { token?: never; error: string }
> {
  try {
    const res = await fetch(`${getApiBase()}/api/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, code }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.message || 'Verification failed.' };
    }

    await saveAuthToken(data.token);
    return { token: data.token };
  } catch {
    return { error: 'Could not reach the server. Check your connection and try again.' };
  }
}
