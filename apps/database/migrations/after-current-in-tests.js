const pg = require('pg');

async function main() {
  const connectionString = process.env.GM_DBURL;

  if (!connectionString) {
    throw new Error('GM_DBURL is not set!');
  }

  const pool = new pg.Pool({ connectionString });

  try {
    // await pool.query('delete from graphile_worker.jobs');
  } finally {
    await pool.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
