const {
  NODE_ENV,
  DB_ROOT_USER,
  DB_ROOT_PASS,
  DB_OWNER_USER,
  DB_OWNER_PASS,
  DB_HOST,
  DB_NAME,
  DB_PORT,
} = process.env;

const isInTests = NODE_ENV === 'test';
const databaseShadow = isInTests ? `${DB_NAME}_test` : `${DB_NAME}_shadow`;

const config = {
  connectionString: `postgres://${DB_OWNER_USER}:${DB_OWNER_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`,
  shadowConnectionString: `postgres://${DB_OWNER_USER}:${DB_OWNER_PASS}@${DB_HOST}:${DB_PORT}/${databaseShadow}`,
  rootConnectionString: `postgres://${DB_ROOT_USER}:${DB_ROOT_PASS}@${DB_HOST}:${DB_PORT}/postgres`,
  pgSettings: {
    search_path: 'app_public,app_private,app_hidden,public',
  },
  placeholders: {
    ':DB_NAME': '!ENV',
    ':DB_OWNER_USER': '!ENV',
    ':DB_AUTH_USER': '!ENV',
    ':APP_VISITOR': '!ENV',
    ':APP_MANAGER': '!ENV',
    ':APP_ADMIN': '!ENV',
  },
  afterReset: ['after-reset.sql'],
  afterCurrent: ['seed.sql'],
};

if (isInTests) {
  config.afterCurrent.push({
    _: 'command',
    command: 'node ./migrations/after-current-in-tests.js',
  });
}

module.exports = config;
