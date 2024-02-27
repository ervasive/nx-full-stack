import { createUsers } from './create-users';
import { withRootDb } from './with-db';

describe('createUsers', () => {
  it.skip('should create a single user with default role if no options are provided', async () => {
    await withRootDb(async (client) => {
      const users = await createUsers(client);

      expect(users.length).toBe(1);
      expect(typeof users[0].id).toBe('string');
      expect(typeof users[0].email).toBe('string');
      expect(typeof users[0].password).toBe('string');
      expect(typeof users[0].username).toBe('string');
      expect(typeof users[0].role).toBe('number');
    });
  });

  it.skip('should create a single user with custom role', async () => {
    withRootDb(async (client) => {
      const users = await createUsers(client, { role: 'manager' });

      expect(users.length).toBe(1);
      expect(users[0].role).toBe('manager');
    });
  });
});
