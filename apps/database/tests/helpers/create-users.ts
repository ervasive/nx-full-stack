import { beforeEach, expect } from '@jest/globals';
import { PoolClient } from 'pg';
import { UserDetails } from './types';

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
  { count = 1, role }: { count?: number; role?: string } = {}
) {
  const users: UserDetails[] = [];

  if (userCreationCounter > 25) {
    throw new Error('Too many users created!');
  }

  for (let i = 0; i < count; i++) {
    const userLetter = 'abcdefghijklmnopqrstuvwxyz'[userCreationCounter];
    const email = `${userLetter}${i || ''}@b.c`;
    const password = userLetter.repeat(12);
    let id: string;

    if (role) {
      const result = (
        await client.query<{ id: string }>(
          `--sql
            select id from app_private.create_user($1, $2, $3, $4, $5)
          `,
          [email, password, `testuser_${userLetter}`, null, role]
        )
      ).rows[0];

      id = result.id;
    } else {
      const result = (
        await client.query<{ id: string }>(
          `--sql
            select id from app_private.create_user($1, $2, $3)
          `,
          [email, password, `testuser_${userLetter}`]
        )
      ).rows[0];

      id = result.id;
    }

    expect(id).not.toBeNull();

    const details = (
      await client.query<{
        id: string;
        username: string;
        email: string;
        role: string;
      }>(
        `--sql
          select * from app_private.user_details where id = $1
        `,
        [id]
      )
    ).rows[0];

    users.push({ ...details, password });

    userCreationCounter++;
  }

  return users;
}
