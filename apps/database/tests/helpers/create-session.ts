import { PoolClient } from 'pg';

let userSessionsCounter = 0;

beforeEach(() => {
  userSessionsCounter = 0;
});

/**
 * Create session for an existing user
 *
 * @param client - pool client
 * @param userId - id of an existing user
 *
 * @returns session object
 */
export async function createSession(client: PoolClient, userId: string) {
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
