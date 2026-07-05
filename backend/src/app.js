const Fastify = require('fastify');
const notesRoutes = require('./routes/notes');

function buildApp({ repository }) {
  const fastify = Fastify({ logger: false });

  fastify.get('/health', async () => ({ status: 'ok' }));

  fastify.register(notesRoutes, { repository });

  return fastify;
}

module.exports = { buildApp };
