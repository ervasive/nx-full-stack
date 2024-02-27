import { getEnv } from '@/env';
import { DatabaseError } from 'pg';
import { becomeUser } from '.';
import { createUsers } from './create-users';
import { poolFromUrl } from './pool-from-url';
import { ClientCallback, ClientWithUserCallback } from './types';

const { TEST_DATABASE_URL, APP_VISITOR } = getEnv();

/**
 * Initiate database queries within a transaction with automatic clean up
 *
 * @param url - database connection string
 * @param fn - client callback
 */
async function withDbFromUrl<T>(url: string, fn: ClientCallback<T>) {
  const pool = poolFromUrl(url);
  const client = await pool.connect();

  await client.query(`begin isolation level serializable`);

  try {
    await fn(client);
  } catch (e) {
    if (e instanceof DatabaseError && e.code?.match(/^[0-9A-Z]{5}$/)) {
      console.error([e.message, e.code, e.detail, e.hint, e.where].join('\n'));
    }

    throw e;
  } finally {
    await client.query(`rollback`);
    await client.query(`reset all`);
    await client.release();
  }
}

/**
 * Issue queries as database owner
 *
 * @param fn
 * @returns
 */
export function withRootDb<T>(fn: ClientCallback<T>) {
  return withDbFromUrl(TEST_DATABASE_URL, fn);
}

/**
 * Issue queries as anonymous user
 *
 * @param fn
 * @returns
 */
export function withAnonymousDb<T>(fn: ClientCallback<T>) {
  return withRootDb(async (client) => {
    await becomeUser(client, null);
    await fn(client);
  });
}

/**
 * Issue queries as logged in user
 *
 * @param fn
 * @returns
 */
export function withUserDb<T>(fn: ClientWithUserCallback<T>): Promise<void>;
export function withUserDb<T>(
  userRole: string,
  fn: ClientWithUserCallback
): Promise<void>;
export function withUserDb<T>(
  roleOrFn: string | ClientWithUserCallback,
  fn?: ClientWithUserCallback
): Promise<void> {
  const userRole = typeof roleOrFn === 'string' ? roleOrFn : APP_VISITOR;
  const handler =
    typeof roleOrFn === 'string' ? fn || (() => undefined) : roleOrFn;

  return withRootDb(async (client) => {
    const [user] = await createUsers(client, { role: userRole });

    await becomeUser(client, user);
    await handler(client, user);
  });
}
