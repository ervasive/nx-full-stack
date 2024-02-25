import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.string(),
  DB_ROOT_USER: z.string(),
  DB_ROOT_PASS: z.string(),
  DB_AUTH_USER: z.string(),
  DB_AUTH_PASS: z.string(),
  DB_HOST: z.string(),
  DB_PORT: z.number({ coerce: true }).default(5432),
  DB_NAME: z.string(),
  DB_OWNER_USER: z.string(),
  DB_OWNER_PASS: z.string(),
  APP_VISITOR: z.string(),
  APP_MANAGER: z.string(),
  APP_ADMIN: z.string(),
  SERVER_HOST: z.string().default('localhost'),
  SERVER_PORT: z.number({ coerce: true }).default(3000),
});

type Env = ReturnType<typeof schema.parse> & {
  IS_TEST: boolean;
  IS_DEV: boolean;
  ROOT_DATABASE_URL: string;
  DATABASE_URL: string;
  TEST_DATABASE_URL: string;
};

let env: Env;

export function getEnv(): Env {
  if (env) return env;

  try {
    const validated = schema.parse(process.env);

    return {
      ...validated,
      IS_TEST: validated.NODE_ENV === 'test',
      IS_DEV: validated.NODE_ENV === 'development',
      ROOT_DATABASE_URL: `postgres://${validated.DB_ROOT_USER}:${validated.DB_ROOT_PASS}@${validated.DB_HOST}:${validated.DB_PORT}/postgres`,
      DATABASE_URL: `postgres://${validated.DB_AUTH_USER}:${validated.DB_AUTH_PASS}@${validated.DB_HOST}:${validated.DB_PORT}/${validated.DB_NAME}`,
      TEST_DATABASE_URL: `postgres://${validated.DB_OWNER_USER}:${validated.DB_OWNER_PASS}@${validated.DB_HOST}:${validated.DB_PORT}/${validated.DB_NAME}_test`,
    };
  } catch (e) {
    if (e instanceof Error) {
      console.error('Error while validating environment variables:', e.message);
    }
  }

  return {} as Env;
}
