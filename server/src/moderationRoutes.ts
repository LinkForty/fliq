import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { getPool } from './database.js';
import { authMiddleware } from './auth.js';
import { normalizePhone } from './utils.js';

const REPORT_REASONS = ['harassment', 'hate', 'sexual', 'violence', 'spam', 'other'] as const;

const reportSchema = z.object({
  senderPhone: z.string().min(5).max(20).optional(),
  senderName: z.string().max(100).optional(),
  messageId: z.string().max(64).optional(),
  // Plaintext as decrypted on the reporter's device — the server never sees
  // message plaintext otherwise, so the report must carry it for review.
  messageContent: z.string().max(4000).optional(),
  reason: z.enum(REPORT_REASONS),
  details: z.string().max(1000).optional(),
});

const blockSchema = z.object({
  phone: z.string().min(5).max(20),
});

/**
 * Notify the moderation inbox that a new report needs review (24h SLA).
 * Fire-and-forget: report storage must never fail because alerting did.
 */
async function notifyReport(report: { id: string; reason: string; senderPhone: string | null }) {
  const webhookUrl = process.env.REPORT_WEBHOOK_URL;
  if (!webhookUrl) return;
  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `New Fliq'd content report ${report.id}: reason=${report.reason} sender=${report.senderPhone || 'unknown'}. Review within 24h.`,
      }),
    });
  } catch {
    // Alerting is best-effort; the report is already stored
  }
}

function requireAdmin(request: FastifyRequest, reply: FastifyReply): boolean {
  const adminToken = process.env.ADMIN_TOKEN;
  if (!adminToken || request.headers['x-admin-token'] !== adminToken) {
    reply.status(401).send({ error: 'unauthorized', message: 'Invalid admin token' });
    return false;
  }
  return true;
}

export async function registerModerationRoutes(fastify: FastifyInstance) {

  // ── POST /api/reports ───────────────────────────────────────────────
  // Report objectionable content. Reviewed by the developer within 24h.
  fastify.post('/api/reports', { preHandler: authMiddleware }, async (request, reply) => {
    const data = reportSchema.parse(request.body);
    const db = getPool();

    const senderPhone = data.senderPhone ? normalizePhone(data.senderPhone) : null;
    const result = await db.query(
      `INSERT INTO reports (reporter_phone, sender_phone, sender_name, message_id, message_content, reason, details)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, created_at`,
      [request.phone, senderPhone, data.senderName || null, data.messageId || null,
       data.messageContent || null, data.reason, data.details || null],
    );

    const report = result.rows[0];
    void notifyReport({ id: report.id, reason: data.reason, senderPhone });

    return reply.status(201).send({ reportId: report.id, createdAt: report.created_at });
  });

  // ── POST /api/blocks ────────────────────────────────────────────────
  // Block a sender. Their future messages to this user are dropped.
  fastify.post('/api/blocks', { preHandler: authMiddleware }, async (request, reply) => {
    const { phone } = blockSchema.parse(request.body);
    const db = getPool();
    const blocked = normalizePhone(phone);

    if (blocked === request.phone) {
      return reply.status(400).send({ error: 'invalid_block', message: 'You cannot block yourself.' });
    }

    await db.query(
      `INSERT INTO blocks (blocker_phone, blocked_phone) VALUES ($1, $2)
       ON CONFLICT (blocker_phone, blocked_phone) DO NOTHING`,
      [request.phone, blocked],
    );

    return reply.status(201).send({ ok: true });
  });

  // ── DELETE /api/blocks/:phone ───────────────────────────────────────
  fastify.delete('/api/blocks/:phone', { preHandler: authMiddleware }, async (request, reply) => {
    const { phone } = request.params as { phone: string };
    const db = getPool();

    await db.query(
      `DELETE FROM blocks WHERE blocker_phone = $1 AND blocked_phone = $2`,
      [request.phone, normalizePhone(phone)],
    );

    return reply.send({ ok: true });
  });

  // ── GET /api/blocks ─────────────────────────────────────────────────
  fastify.get('/api/blocks', { preHandler: authMiddleware }, async (request, reply) => {
    const db = getPool();
    const result = await db.query(
      `SELECT blocked_phone, created_at FROM blocks WHERE blocker_phone = $1 ORDER BY created_at DESC`,
      [request.phone],
    );

    return reply.send({
      blocks: result.rows.map((row) => ({
        phone: row.blocked_phone,
        blockedAt: row.created_at,
      })),
    });
  });

  // ── Admin: GET /api/admin/reports ───────────────────────────────────
  fastify.get('/api/admin/reports', async (request, reply) => {
    if (!requireAdmin(request, reply)) return;
    const db = getPool();
    const { status } = request.query as { status?: string };

    const result = await db.query(
      `SELECT * FROM reports WHERE status = $1 ORDER BY created_at ASC`,
      [status || 'open'],
    );

    return reply.send({ reports: result.rows });
  });

  // ── Admin: POST /api/admin/reports/:id/resolve ──────────────────────
  fastify.post('/api/admin/reports/:id/resolve', async (request, reply) => {
    if (!requireAdmin(request, reply)) return;
    const { id } = request.params as { id: string };
    const { resolution } = z.object({ resolution: z.string().max(1000).optional() }).parse(request.body ?? {});
    const db = getPool();

    const result = await db.query(
      `UPDATE reports SET status = 'resolved', resolution = $2, resolved_at = NOW() WHERE id = $1 RETURNING id`,
      [id, resolution || null],
    );

    if (result.rows.length === 0) {
      return reply.status(404).send({ error: 'not_found', message: 'Report not found' });
    }

    return reply.send({ ok: true });
  });

  // ── Admin: POST /api/admin/ban ──────────────────────────────────────
  // Eject a user: ban the phone, remove their devices (kills push delivery),
  // and delete any of their undelivered messages.
  fastify.post('/api/admin/ban', async (request, reply) => {
    if (!requireAdmin(request, reply)) return;
    const { phone, reason } = z.object({
      phone: z.string().min(5).max(20),
      reason: z.string().max(1000).optional(),
    }).parse(request.body);
    const db = getPool();
    const normalized = normalizePhone(phone);

    await db.query(
      `INSERT INTO banned_phones (phone_number, reason) VALUES ($1, $2)
       ON CONFLICT (phone_number) DO UPDATE SET reason = EXCLUDED.reason, banned_at = NOW()`,
      [normalized, reason || null],
    );
    await db.query(`DELETE FROM devices WHERE phone_number = $1`, [normalized]);
    const removed = await db.query(`DELETE FROM messages WHERE sender_phone = $1`, [normalized]);

    return reply.send({ ok: true, phone: normalized, undeliveredMessagesRemoved: removed.rowCount || 0 });
  });

  // ── Admin: POST /api/admin/unban ────────────────────────────────────
  fastify.post('/api/admin/unban', async (request, reply) => {
    if (!requireAdmin(request, reply)) return;
    const { phone } = z.object({ phone: z.string().min(5).max(20) }).parse(request.body);
    const db = getPool();

    await db.query(`DELETE FROM banned_phones WHERE phone_number = $1`, [normalizePhone(phone)]);

    return reply.send({ ok: true });
  });
}
