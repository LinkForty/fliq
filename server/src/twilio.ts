import Twilio from 'twilio';

let client: ReturnType<typeof Twilio> | null = null;

function getClient() {
  if (!client) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    if (!accountSid || !authToken) {
      throw new Error('TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN must be set');
    }
    client = Twilio(accountSid, authToken);
  }
  return client;
}

function getServiceSid(): string {
  const sid = process.env.TWILIO_VERIFY_SERVICE_SID;
  if (!sid) {
    throw new Error('TWILIO_VERIFY_SERVICE_SID must be set');
  }
  return sid;
}

export async function sendOtp(phoneE164: string): Promise<void> {
  const twilio = getClient();
  await twilio.verify.v2
    .services(getServiceSid())
    .verifications.create({ to: phoneE164, channel: 'sms' });
}

export async function checkOtp(phoneE164: string, code: string): Promise<boolean> {
  const twilio = getClient();
  const check = await twilio.verify.v2
    .services(getServiceSid())
    .verificationChecks.create({ to: phoneE164, code });
  return check.status === 'approved';
}
