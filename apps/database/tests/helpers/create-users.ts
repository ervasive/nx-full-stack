import { getEnv } from '@/env';
import { PoolClient } from 'pg';
import { User } from './types';

const { APP_VISITOR } = getEnv();

let userCreationCounter = 0;

beforeEach(() => {
  userCreationCounter = 0;
});

/**
 * Enables multiple calls to `createUsers` within the same test to still have
 * deterministic results without conflicts.
 *
 * @param client - pool client
 * @param options
 * @param options.count - number of users to create
 * @param options.role - application role to assign to created users
 *
 * @returns an array of created users
 */
export async function createUsers(
  client: PoolClient,
  { count = 1, role = APP_VISITOR }: { count?: number; role?: string } = {}
) {
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
        [email, password, `testuser_${userLetter}`, null, role]
      )
    ).rows[0];

    expect(user.id).not.toBeNull();

    user._email = email;
    user._password = password;
    user._role = role;
    users.push(user);

    userCreationCounter++;
  }

  return users;
}
