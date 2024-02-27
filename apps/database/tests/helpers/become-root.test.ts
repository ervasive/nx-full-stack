import { getEnv } from '@/env';
import { becomeRoot } from './become-root';
import { withAnonymousDb, withUserDb } from './with-db';

const { DB_OWNER_USER } = getEnv();

describe('becomeRoot', () => {
  it('should be able to switch to owner role from visitor', async () => {
    withAnonymousDb(async (client) => {
      await becomeRoot(client);

      const result = await client.query<{ result: string }>(
        'select current_role as result'
      );

      expect(result).toBeDefined();
      expect(result.rows.length).toBe(1);
      expect(result.rows[0].result).toBe(DB_OWNER_USER);
    });
  });

  it('should be able to switch to owner role from authenticated user', async () => {
    withUserDb(async (client) => {
      await becomeRoot(client);

      const result = await client.query<{ result: string }>(
        'select current_role as result'
      );

      expect(result).toBeDefined();
      expect(result.rows.length).toBe(1);
      expect(result.rows[0].result).toBe(DB_OWNER_USER);
    });
  });
});
