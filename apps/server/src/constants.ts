const {
  DB_ROOT_USER,
  DB_ROOT_PASS,
  DB_AUTH_USER,
  DB_AUTH_PASS,
  DB_HOST,
  DB_PORT,
  DB_NAME,
} = process.env;

export const IS_TEST = process.env.NODE_ENV === 'test';
export const IS_DEV = process.env.NODE_ENV === 'development';

export const ROOT_DATABASE_URL = `postgres://${DB_ROOT_USER}:${DB_ROOT_PASS}@${DB_HOST}:${DB_PORT}/postgres`;
export const DATABASE_URL = `postgres://${DB_AUTH_USER}:${DB_AUTH_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
