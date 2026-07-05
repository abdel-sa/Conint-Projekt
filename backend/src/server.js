require('dotenv').config();
const { Pool } = require('pg');
const { buildApp } = require('./app');
const { createPostgresNoteRepository } = require('./repository/postgresNoteRepository');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const repository = createPostgresNoteRepository(pool);
const app = buildApp({ repository });

const port = process.env.PORT || 3000;

app.listen({ port, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  }
  // eslint-disable-next-line no-console
  console.log(`secret-notes-backend listening on ${address}`);
});
