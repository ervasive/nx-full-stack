import { getEnv } from '@/env';
import { DatabaseError, PoolClient } from 'pg';
import { becomeUser } from './become-user';
import { createUsers } from './create-users';
import { poolFromUrl } from './pool-from-url';
import { ClientCallback, User } from './types';

const { TEST_DATABASE_URL } = getEnv();

/**
 *
 * @param url
 * @param fn
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
    await pool.end();
  }
}

/**
 *
 * @param fn
 * @returns
 */
export function withRootDb<T>(fn: ClientCallback<T>) {
  return withDbFromUrl(TEST_DATABASE_URL, fn);
}

/**
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
 *
 * @param fn
 * @returns
 */
export function withUserDb<T>(
  fn: (client: PoolClient, user: User) => Promise<T>
) {
  return withRootDb(async (client) => {
    const [user] = await createUsers(client);

    await becomeUser(client, user.id);
    await fn(client, user);
  });
}
