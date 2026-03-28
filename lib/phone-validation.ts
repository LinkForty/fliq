import { sendOtp } from './auth';

/**
 * Validate a phone number by sending an OTP via Twilio.
 * Returns { valid: true, formatted, needsOtp } on success,
 * or { valid: false, error } on failure.
 *
 * If the phone is already verified server-side, the token is
 * automatically saved and needsOtp is false.
 */
export async function validatePhoneNumber(phone: string): Promise<{
  valid: boolean;
  formatted: string;
  needsOtp: boolean;
  error?: string;
}> {
  const result = await sendOtp(phone);

  if (result.error) {
    return { valid: false, formatted: phone, needsOtp: false, error: result.error };
  }

  if (result.alreadyVerified) {
    return { valid: true, formatted: phone, needsOtp: false };
  }

  // OTP sent — caller needs to show code entry UI
  return { valid: true, formatted: phone, needsOtp: true };
}
