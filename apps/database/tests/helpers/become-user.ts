import { getEnv } from '@/env';
import { PoolClient } from 'pg';
import { UserDetails } from './types';

const { APP_VISITOR } = getEnv();

let userSessionsCounter = 0;

beforeEach(() => {
  userSessionsCounter = 0;
});

/**
 * Become user with active session
 *
 * @param client - pool client
 * @param userOrUserId - user object or user id to become as
 *
 * @returns void
 */
export async function becomeUser(client: PoolClient, user: UserDetails | null) {
  if (user) {
    const {
      rows: [session],
    } = await client.query<{ id: string }>(
      `--sql
        insert into app_private.user_sessions (id, user_id, expires_at)
          values ($1, $2::uuid, now() + interval '1 day') returning *
      `,
      [`session-id-${userSessionsCounter++}`, user.id]
    );

    if (!session) return;

    await client.query(
      `--sql
        select
          set_config('role', $1::text, true),
          set_config('jwt.claims.session_id', $2::text, true)
      `,
      [user.role, session.id]
    );
  } else {
    await client.query(
      `--sql
        select
          set_config('role', $1::text, true),
          set_config('jwt.claims.session_id', null, true)
      `,
      [APP_VISITOR]
    );
  }
}
