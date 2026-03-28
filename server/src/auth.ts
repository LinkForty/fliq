import jwt from 'jsonwebtoken';
import { FastifyRequest, FastifyReply } from 'fastify';

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET must be set');
  }
  return secret;
}

export function signToken(phone: string): string {
  return jwt.sign({ phone }, getSecret(), { expiresIn: '30d' });
}

export function verifyToken(token: string): { phone: string } {
  return jwt.verify(token, getSecret()) as { phone: string };
}

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  const header = request.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return reply.status(401).send({ error: 'unauthorized', message: 'Missing or invalid Authorization header' });
  }

  try {
    const payload = verifyToken(header.slice(7));
    request.phone = payload.phone;
  } catch {
    return reply.status(401).send({ error: 'unauthorized', message: 'Invalid or expired token' });
  }
}

// Augment Fastify request type
declare module 'fastify' {
  interface FastifyRequest {
    phone?: string;
  }
}
