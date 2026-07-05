const { encrypt, decrypt } = require('../crypto');

async function notesRoutes(fastify, { repository }) {
  fastify.post('/api/notes', async (request, reply) => {
    const { content, passphrase } = request.body || {};

    if (typeof content !== 'string' || content.length === 0) {
      return reply.code(400).send({ error: 'content is required' });
    }
    if (typeof passphrase !== 'string' || passphrase.length < 4) {
      return reply.code(400).send({ error: 'passphrase must be at least 4 characters' });
    }

    const encryptedRecord = encrypt(content, passphrase);
    const created = await repository.create(encryptedRecord);

    return reply.code(201).send(created);
  });

  fastify.get('/api/notes', async () => {
    const notes = await repository.listMeta();
    return notes;
  });

  fastify.post('/api/notes/:id/reveal', async (request, reply) => {
    const { id } = request.params;
    const { passphrase } = request.body || {};

    if (typeof passphrase !== 'string' || passphrase.length === 0) {
      return reply.code(400).send({ error: 'passphrase is required' });
    }

    const note = await repository.findById(id);
    if (!note) {
      return reply.code(404).send({ error: 'note not found' });
    }

    try {
      const content = decrypt(note, passphrase);
      return reply.code(200).send({ content });
    } catch {
      return reply.code(403).send({ error: 'incorrect passphrase' });
    }
  });
}

module.exports = notesRoutes;
