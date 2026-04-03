import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { getPool } from './database.js';
import { normalizePhone, toE164 } from './utils.js';
import { sendOtp, checkOtp } from './twilio.js';
import { signToken } from './auth.js';

const MAX_OTP_REQUESTS = 3;
const OTP_WINDOW_HOURS = 24;

// Demo account for App Store review — phone and code set via env vars
const DEMO_PHONE = process.env.DEMO_PHONE || '';
const DEMO_OTP_CODE = process.env.DEMO_OTP_CODE || '';

function isDemoPhone(normalized: string): boolean {
  return !!DEMO_PHONE && normalized === DEMO_PHONE;
}

const phoneSchema = z.object({
  phone: z.string().min(5).max(30),
});

const verifySchema = z.object({
  phone: z.string().min(5).max(30),
  code: z.string().min(4).max(10),
});

export async function registerAuthRoutes(fastify: FastifyInstance) {

  // ── POST /api/auth/send-otp ─────────────────────────────────────────
  fastify.post('/api/auth/send-otp', async (request, reply) => {
    const { phone } = phoneSchema.parse(request.body);
    const normalized = normalizePhone(phone);
    const db = getPool();

    // Check if already verified — issue token immediately (zero cost)
    const cached = await db.query(
      `SELECT phone_number FROM verified_phones WHERE phone_number = $1`,
      [normalized],
    );

    if (cached.rows.length > 0) {
      const token = signToken(normalized);
      return reply.send({ alreadyVerified: true, token });
    }

    // Rate limit: max 3 OTP requests per phone per 24 hours
    const rateCheck = await db.query(
      `SELECT COUNT(*) as count FROM otp_requests
       WHERE phone_number = $1 AND requested_at > NOW() - INTERVAL '${OTP_WINDOW_HOURS} hours'`,
      [normalized],
    );

    const count = parseInt(rateCheck.rows[0].count, 10);
    if (count >= MAX_OTP_REQUESTS) {
      return reply.status(429).send({
        error: 'rate_limited',
        message: `Too many verification attempts. Try again later.`,
      });
    }

    // Demo account — skip Twilio, accept fixed code
    if (isDemoPhone(normalized)) {
      return reply.send({ sent: true });
    }

    // Send OTP via Twilio
    try {
      await sendOtp(toE164(normalized));
    } catch (err) {
      fastify.log.error(err, 'Failed to send OTP');
      return reply.status(500).send({
        error: 'otp_failed',
        message: 'Failed to send verification code. Please try again.',
      });
    }

    // Record the attempt for rate limiting
    await db.query(
      `INSERT INTO otp_requests (phone_number) VALUES ($1)`,
      [normalized],
    );

    return reply.send({ sent: true });
  });

  // ── POST /api/auth/verify-otp ───────────────────────────────────────
  fastify.post('/api/auth/verify-otp', async (request, reply) => {
    const { phone, code } = verifySchema.parse(request.body);
    const normalized = normalizePhone(phone);
    const db = getPool();

    // Demo account — accept fixed code
    let approved: boolean;
    if (isDemoPhone(normalized) && DEMO_OTP_CODE && code === DEMO_OTP_CODE) {
      approved = true;
    } else if (isDemoPhone(normalized)) {
      approved = false;
    } else {
      try {
        approved = await checkOtp(toE164(normalized), code);
      } catch (err) {
        fastify.log.error(err, 'OTP verification check failed');
        return reply.status(500).send({
          error: 'verification_failed',
          message: 'Unable to verify code. Please try again.',
        });
      }
    }

    if (!approved) {
      return reply.status(400).send({
        error: 'invalid_code',
        message: 'Incorrect verification code.',
      });
    }

    // Cache as verified (skip OTP on future registrations)
    await db.query(
      `INSERT INTO verified_phones (phone_number, formatted)
       VALUES ($1, $2)
       ON CONFLICT (phone_number) DO UPDATE SET verified_at = NOW()`,
      [normalized, toE164(normalized)],
    );

    const token = signToken(normalized);
    return reply.send({ token, phone: normalized });
  });
}
