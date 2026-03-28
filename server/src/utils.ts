/**
 * Normalize a phone number to digits only with country code.
 * "+1 949-554-4488" → "19495544488"
 * "9495544488" → "19495544488" (assumes US/Canada for 10-digit numbers)
 */
export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  // 10 digits without country code → prepend 1 (US/Canada)
  if (digits.length === 10) return '1' + digits;
  return digits;
}

/**
 * Convert a normalized phone number to E.164 format for Twilio.
 * "19495544488" → "+19495544488"
 */
export function toE164(normalized: string): string {
  return '+' + normalized;
}
