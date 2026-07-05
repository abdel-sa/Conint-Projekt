const { randomUUID } = require('crypto');

function createInMemoryNoteRepository() {
  const notes = new Map();

  return {
    async create(encryptedRecord) {
      const id = randomUUID();
      const note = { id, createdAt: new Date().toISOString(), ...encryptedRecord };
      notes.set(id, note);
      return { id, createdAt: note.createdAt };
    },

    async findById(id) {
      return notes.get(id) || null;
    },

    async listMeta() {
      return Array.from(notes.values()).map(({ id, createdAt }) => ({ id, createdAt }));
    },
  };
}

module.exports = { createInMemoryNoteRepository };
