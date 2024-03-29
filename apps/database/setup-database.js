const { execSync } = require('child_process');
const pg = require('pg');
const { setTimeout } = require('timers/promises');

const {
  NODE_ENV,
  DB_ROOT_USER,
  DB_ROOT_PASS,
  DB_OWNER_USER,
  DB_OWNER_PASS,
  DB_AUTH_USER,
  DB_AUTH_PASS,
  DB_HOST,
  DB_NAME,
  DB_PORT,
  APP_VISITOR,
  APP_MANAGER,
  APP_ADMIN,
} = process.env;

async function main() {
  const pool = new pg.Pool({
    connectionString: `postgres://${DB_ROOT_USER}:${DB_ROOT_PASS}@${DB_HOST}:${DB_PORT}/postgres`,
  });

  pool.on('error', (e) => {
    console.error(
      'An error occurred whilst trying to talk to the database: ' + e.message
    );
  });

  console.log('Installing or reinstalling the roles and database...');

  let attempts = 0;

  /* eslint-disable-next-line */
  while (true) {
    try {
      await pool.query(`--sql
        select true as "Connection test"
      `);

      break;
    } catch (e) {
      if (!(e instanceof Error)) return;

      if (e instanceof pg.DatabaseError && e.code === '28P01') {
        throw e;
      }

      attempts++;

      if (attempts <= 30) {
        console.log(
          `Database is not ready yet (attempt ${attempts}): ${e.message})`
        );
      } else {
        console.log(`Database never came up, aborting :(`);
        process.exit(1);
      }

      await setTimeout(1000);
    }
  }

  const client = await pool.connect();

  try {
    // RESET database
    console.log('Dropping main database...');
    await client.query(`drop database if exists ${DB_NAME}`);

    console.log('Dropping shadow database...');
    await client.query(`drop database if exists ${DB_NAME}_shadow;`);

    console.log('Dropping test database...');
    await client.query(`drop database if exists ${DB_NAME}_test;`);

    console.log('Dropping roles...');
    await client.query(`drop role if exists ${DB_AUTH_USER};`);
    await client.query(`drop role if exists ${DB_OWNER_USER};`);
    await client.query(`drop role if exists ${APP_VISITOR};`);
    await client.query(`drop role if exists ${APP_MANAGER};`);
    await client.query(`drop role if exists ${APP_ADMIN};`);

    // This is the root role for the database`);
    console.log('Creating root role...');

    // IMPORTANT: don't grant SUPERUSER in production, we only need this so we
    // can load the watch fixtures!
    await client.query(
      NODE_ENV === 'development'
        ? `create role ${DB_OWNER_USER} with login password '${DB_OWNER_PASS}' superuser`
        : `create role ${DB_OWNER_USER} with login password '${DB_OWNER_PASS}'`
    );

    // These are the roles that PostGraphile will switch to (from DB_AUTH_USER)
    // during a GraphQL request
    console.log('Creating application roles...');

    await client.query(`create role ${APP_VISITOR}`);

    await client.query(`create role ${APP_MANAGER}`);
    await client.query(`grant ${APP_VISITOR} to ${APP_MANAGER}`);

    await client.query(`create role ${APP_ADMIN}`);
    await client.query(`grant ${APP_VISITOR} to ${APP_ADMIN}`);

    console.log('Creating auth role...');
    // This is the no-access role that PostGraphile will run as by default`);
    await client.query(
      `create role ${DB_AUTH_USER} with login password '${DB_AUTH_PASS}' noinherit`
    );

    await client.query(`grant ${APP_VISITOR} to ${DB_AUTH_USER}`);
    await client.query(`grant ${APP_MANAGER} to ${DB_AUTH_USER}`);
    await client.query(`grant ${APP_ADMIN} to ${DB_AUTH_USER}`);

    // Reset databases with graphile-migrate
    const opts = {
      encoding: 'utf-8',
      stdio: 'inherit',
    };

    console.log('Resetting database...');
    execSync('pnpm nx run database:cli reset --erase', opts);

    console.log('Resetting shadow database...');
    execSync('pnpm nx run database:cli reset --erase --shadow', opts);
  } finally {
    await client.release();
  }

  await pool.end();
}

main()
  .then(() => console.log('✅ Setup success'))
  .catch((e) =>
    console.error('Something went wrong while setting up the database', e)
  );
