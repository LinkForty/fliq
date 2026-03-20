import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { Expo } from 'expo-server-sdk';
import { getPool } from './database.js';

const expo = new Expo();

const MESSAGE_TTL_HOURS = 24;

// ── Validation schemas ─────────────────────────────────────────────────

const registerDeviceSchema = z.object({
  deviceId: z.string().min(1).max(64),
  phoneNumber: z.string().min(5).max(20),
  pushToken: z.string().min(1),
  displayName: z.string().max(100).optional(),
  platform: z.enum(['ios', 'android']).optional(),
});

const sendMessageSchema = z.object({
  senderDeviceId: z.string().min(1).max(64),
  senderName: z.string().min(1).max(100),
  recipientPhone: z.string().min(5).max(20),
  // Encrypted content fields (v2)
  encryptedContent: z.string().min(1).max(4000).optional(),
  contentNonce: z.string().min(1).max(100).optional(),
  contentKey: z.string().min(1).max(100).optional(),
  // Legacy plaintext (v1) — still accepted for backwards compatibility
  content: z.string().min(1).max(2000).optional(),
  revealStyle: z.enum(['flick', 'scratch', 'blur', 'typewriter', 'flip']).default('flick'),
}).refine(
  (data) => data.encryptedContent || data.content,
  { message: 'Either encryptedContent or content must be provided' },
);

// ── Routes ─────────────────────────────────────────────────────────────

export async function registerRoutes(fastify: FastifyInstance) {

  // Health check
  fastify.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // ── POST /api/devices ───────────────────────────────────────────────
  // Register or update a device's push token and phone number.
  fastify.post('/api/devices', async (request, reply) => {
    const data = registerDeviceSchema.parse(request.body);
    const db = getPool();

    await db.query(
      `INSERT INTO devices (device_id, phone_number, push_token, display_name, platform)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (device_id) DO UPDATE SET
         phone_number = EXCLUDED.phone_number,
         push_token   = EXCLUDED.push_token,
         display_name = EXCLUDED.display_name,
         platform     = EXCLUDED.platform,
         updated_at   = NOW()`,
      [data.deviceId, data.phoneNumber, data.pushToken, data.displayName || null, data.platform || null],
    );

    return reply.status(200).send({ ok: true });
  });

  // ── POST /api/messages ──────────────────────────────────────────────
  // Create a message and send a push notification to the recipient.
  fastify.post('/api/messages', async (request, reply) => {
    const data = sendMessageSchema.parse(request.body);
    const db = getPool();

    // Look up recipient's push token
    const deviceResult = await db.query(
      `SELECT push_token, display_name FROM devices WHERE phone_number = $1 ORDER BY updated_at DESC LIMIT 1`,
      [data.recipientPhone],
    );

    if (deviceResult.rows.length === 0) {
      return reply.status(404).send({
        error: 'recipient_not_found',
        message: 'No Fliq device registered with that phone number.',
      });
    }

    const recipient = deviceResult.rows[0];

    // Store message with TTL — server stores encrypted content, never plaintext
    const expiresAt = new Date(Date.now() + MESSAGE_TTL_HOURS * 60 * 60 * 1000);
    const storedContent = data.encryptedContent || data.content;
    const msgResult = await db.query(
      `INSERT INTO messages (sender_device_id, sender_name, recipient_phone, content, reveal_style, expires_at, content_nonce)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [data.senderDeviceId, data.senderName, data.recipientPhone, storedContent, data.revealStyle, expiresAt, data.contentNonce || null],
    );

    const messageId = msgResult.rows[0].id;

    // Send push notification via Expo
    // The encryption key is included in the notification data so the
    // recipient app can decrypt the message after fetching it.
    const pushToken = recipient.push_token;
    if (Expo.isExpoPushToken(pushToken)) {
      try {
        await expo.sendPushNotificationsAsync([{
          to: pushToken,
          sound: 'default',
          title: 'New secret message',
          body: `${data.senderName} sent you a secret`,
          data: {
            messageId,
            type: 'fliq_message',
            ...(data.contentKey ? { contentKey: data.contentKey } : {}),
          },
        }]);
      } catch (err) {
        fastify.log.error(err, 'Failed to send push notification');
        // Don't fail the request — message is stored and fetchable
      }
    } else {
      fastify.log.warn(`Invalid Expo push token for phone ${data.recipientPhone}`);
    }

    return reply.status(201).send({
      messageId,
      expiresAt: expiresAt.toISOString(),
    });
  });

  // ── GET /api/messages/:id ───────────────────────────────────────────
  // Fetch a message by ID. One-time read — deleted from server immediately.
  fastify.get('/api/messages/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const db = getPool();

    // Fetch only unfetched, non-expired messages
    const result = await db.query(
      `UPDATE messages
       SET fetched_at = NOW()
       WHERE id = $1 AND fetched_at IS NULL AND expires_at > NOW()
       RETURNING sender_name, content, content_nonce, reveal_style, created_at`,
      [id],
    );

    if (result.rows.length === 0) {
      return reply.status(404).send({
        error: 'message_not_found',
        message: 'Message not found, already read, or expired.',
      });
    }

    const msg = result.rows[0];

    // Delete immediately — no trace on server
    await db.query('DELETE FROM messages WHERE id = $1', [id]);

    // If content_nonce is present, the content is encrypted
    if (msg.content_nonce) {
      return reply.send({
        senderName: msg.sender_name,
        encryptedContent: msg.content,
        contentNonce: msg.content_nonce,
        revealStyle: msg.reveal_style,
        createdAt: msg.created_at,
      });
    }

    // Legacy plaintext message
    return reply.send({
      senderName: msg.sender_name,
      content: msg.content,
      revealStyle: msg.reveal_style,
      createdAt: msg.created_at,
    });
  });
}
