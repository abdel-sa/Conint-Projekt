function createPostgresNoteRepository(pool) {
  return {
    async create(encryptedRecord) {
      const { ciphertext, iv, salt, authTag } = encryptedRecord;
      const result = await pool.query(
        `INSERT INTO notes (ciphertext, iv, salt, auth_tag)
         VALUES ($1, $2, $3, $4)
         RETURNING id, created_at`,
        [ciphertext, iv, salt, authTag]
      );
      const row = result.rows[0];
      return { id: row.id, createdAt: row.created_at };
    },

    async findById(id) {
      const result = await pool.query(
        `SELECT id, ciphertext, iv, salt, auth_tag AS "authTag", created_at AS "createdAt"
         FROM notes WHERE id = $1`,
        [id]
      );
      return result.rows[0] || null;
    },

    async listMeta() {
      const result = await pool.query(
        `SELECT id, created_at AS "createdAt" FROM notes ORDER BY created_at DESC`
      );
      return result.rows;
    },
  };
}

module.exports = { createPostgresNoteRepository };
