import { createUsers } from './create-users';
import { withRootDb } from './with-db';

describe('createUsers', () => {
  it.skip('should create a single user with default role if no options are provided', async () => {
    withRootDb(async (client) => {
      const users = await createUsers(client);

      expect(users.length).toBe(1);
      expect(users[0]).toEqual({});
    });
  });

  it('should create a single user with custom role', async () => {
    withRootDb(async (client) => {
      const users = await createUsers(client, { role: 'manager' });

      expect(users.length).toBe(1);
      expect(users[0]._role).toBe('manager');
    });
  });
});
