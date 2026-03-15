import Fastify from 'fastify';
import { initializeDatabase, cleanupMessages } from './database.js';
import { registerRoutes } from './routes.js';

const start = async () => {
  const fastify = Fastify({ logger: true });

  // CORS — allow requests from anywhere (mobile app)
  fastify.addHook('onRequest', (_request, reply, done) => {
    reply.header('Access-Control-Allow-Origin', '*');
    reply.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    reply.header('Access-Control-Allow-Headers', 'Content-Type');
    done();
  });

  // Handle preflight
  fastify.options('*', (_request, reply) => {
    reply.status(204).send();
  });

  // Initialize database
  await initializeDatabase();

  // Register routes
  await fastify.register(registerRoutes);

  // Error handler
  fastify.setErrorHandler((error, _request, reply) => {
    fastify.log.error(error);

    if (error.validation) {
      return reply.status(400).send({
        error: 'validation_error',
        message: 'Invalid request data.',
      });
    }

    return reply.status(500).send({
      error: 'internal_error',
      message: process.env.NODE_ENV === 'production'
        ? 'Internal server error'
        : error.message,
    });
  });

  // Cleanup expired messages every hour
  setInterval(async () => {
    try {
      const count = await cleanupMessages();
      if (count > 0) {
        fastify.log.info(`Cleaned up ${count} expired/fetched message(s)`);
      }
    } catch (err) {
      fastify.log.error(err, 'Message cleanup failed');
    }
  }, 60 * 60 * 1000);

  // Run cleanup on startup
  const cleaned = await cleanupMessages();
  if (cleaned > 0) {
    fastify.log.info(`Startup cleanup: removed ${cleaned} stale message(s)`);
  }

  const host = process.env.HOST || '0.0.0.0';
  const port = parseInt(process.env.PORT || '3100');

  await fastify.listen({ host, port });
  console.log(`Fliq server running at http://${host}:${port}`);
};

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
