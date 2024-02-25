import { getEnv } from '@/env';
import { beforeEach, expect } from '@jest/globals';
import { DatabaseError, Pool, PoolClient } from 'pg';

const { TEST_DATABASE_URL, APP_VISITOR } = getEnv();

const pools: Record<string, Pool> = {};

function poolFromUrl(url: string) {
  if (!pools[url]) {
    pools[url] = new Pool({ connectionString: url });
  }

  return pools[url];
}

export type User = {
  id: string;
  username: string;
  _email: string;
  _password?: string;
  _role: string;
};

type ClientCallback<T = any> = (client: PoolClient) => Promise<T>;

// Enables multiple calls to `createUsers` within the same test to still have
// deterministic results without conflicts.
let userCreationCounter = 0;

beforeEach(() => {
  userCreationCounter = 0;
});

async function createUsers(client: PoolClient, count = 1) {
  const users: User[] = [];

  if (userCreationCounter > 25) {
    throw new Error('Too many users created!');
  }

  for (let i = 0; i < count; i++) {
    const userLetter = 'abcdefghijklmnopqrstuvwxyz'[userCreationCounter];
    const email = `${userLetter}${i || ''}@b.c`;
    const password = userLetter.repeat(12);
    const user = (
      await client.query<User>(
        `--sql
          select * from app_private.create_user($1, $2, $3, $4, $5)
        `,
        [email, password, `testuser_${userLetter}`, null, 'visitor']
      )
    ).rows[0];

    expect(user.id).not.toBeNull();

    user._email = email;
    user._password = password;
    user._role = 'visitor';
    users.push(user);

    userCreationCounter++;
  }

  return users;
}

async function withDbFromUrl<T>(url: string, fn: ClientCallback<T>) {
  const pool = poolFromUrl(url);
  const client = await pool.connect();

  await client.query(`--sql
    begin isolation level serializable
  `);

  try {
    await fn(client);
  } catch (e) {
    if (e instanceof DatabaseError && e.code?.match(/^[0-9A-Z]{5}$/)) {
      console.error([e.message, e.code, e.detail, e.hint, e.where].join('\n'));
    }

    throw e;
  } finally {
    await client.query(`--sql
      rollback
    `);

    await client.query(`--sql
      reset all
    `);

    await client.release();
    await pool.end();
  }
}

let userSessionsCounter = 0;

beforeEach(() => {
  userSessionsCounter = 0;
});

async function createSession(client: PoolClient, userId: string) {
  const {
    rows: [session],
  } = await client.query<{ id: string }>(
    `--sql
      insert into app_private.user_sessions (id, user_id, expires_at)
        values ($1, $2::uuid, now() + interval '1 day') returning *
    `,
    [`${userSessionsCounter++}${userId}`, userId]
  );

  return session;
}

async function becomeRoot(client: PoolClient) {
  client.query('reset role');
}

export async function becomeUser(
  client: PoolClient,
  userOrUserId: User | string | null
) {
  await becomeRoot(client);
  const session = userOrUserId
    ? await createSession(
        client,
        typeof userOrUserId === 'string' ? userOrUserId : userOrUserId.id
      )
    : null;

  if (session) {
    await client.query(
      `--sql
        select
          set_config('role', $1::text, true),
          set_config('jwt.claims.session_id', $2::text, true)
      `,
      [APP_VISITOR, session.id]
    );
  }
}

export const withRootDb = <T>(fn: ClientCallback<T>) =>
  withDbFromUrl(TEST_DATABASE_URL, fn);

export function withUserDb<T>(
  fn: (client: PoolClient, user: User) => Promise<T>
) {
  return withRootDb(async (client) => {
    // TODO: add ability to set role
    const [user] = await createUsers(client, 1);

    await becomeUser(client, user.id);
    await fn(client, user);
  });
}

export function withAnonymousDb<T>(fn: (client: PoolClient) => Promise<T>) {
  return withRootDb(async (client) => {
    await becomeUser(client, null);
    await fn(client);
  });
}
