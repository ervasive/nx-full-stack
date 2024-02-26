import { createSession } from './create-session';
import { withUserDb } from './with-db';

describe('createSession', () => {
  it('should create user session', async () => {
    await withUserDb(async (client, user) => {
      const session = await createSession(client, user.id);
      expect(session).not.toBeNull();
    });
  });
});
