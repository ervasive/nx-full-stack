import { PoolClient } from 'pg';
import { createSession } from './create-session';
import { User } from './types';

/**
 * Become user with active session
 *
 * @param client - pool client
 * @param userOrUserId - user object or user id to become as
 *
 * @returns void
 */
export async function becomeUser(
  client: PoolClient,
  userOrUserId: User | string | null
) {
  let user: User;

  const session = userOrUserId
    ? await createSession(
        client,
        typeof userOrUserId === 'string' ? userOrUserId : userOrUserId.id
      )
    : null;

  if (!userOrUserId || typeof userOrUserId === 'string') {
    const result = await client.query<User>(
      `--sql
        select * from app_public.users where id = $1
      `,
      [userOrUserId]
    );

    user = result.rows[0];
  } else {
    user = userOrUserId;
  }

  if (session) {
    await client.query(
      `--sql
        select
          set_config('role', $1::text, true),
          set_config('jwt.claims.session_id', $2::text, true)
      `,
      [user._role, session.id]
    );
  }
}
