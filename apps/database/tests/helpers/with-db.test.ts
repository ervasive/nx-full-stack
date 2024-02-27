import { getEnv } from '@/env';
import { withAnonymousDb, withRootDb, withUserDb } from './with-db';

const { DB_OWNER_USER, APP_VISITOR, APP_MANAGER } = getEnv();

describe('database helpers', () => {
  describe('withRootDb', () => {
    it('should be able to query DB', async () => {
      withRootDb(async (client) => {
        expect(client).toBeDefined();

        const result = await client.query<{ result: number }>(
          'select 1 + 1 as result'
        );

        expect(result).toBeDefined();
        expect(result.rows.length).toBe(1);
        expect(result.rows[0].result).toBe(2);
      });
    });

    it('should posses the "database owner" role', async () => {
      withRootDb(async (client) => {
        const result = await client.query<{ result: string }>(
          'select current_user as result'
        );

        expect(result).toBeDefined();
        expect(result.rows.length).toBe(1);
        expect(result.rows[0].result).toBe(DB_OWNER_USER);
      });
    });

    it('should posses the "visitor" role on anonymous access', async () => {
      withAnonymousDb(async (client) => {
        const result = await client.query<{ result: string }>(
          'select current_role as result'
        );

        expect(result).toBeDefined();
        expect(result.rows.length).toBe(1);
        expect(result.rows[0].result).toBe(APP_VISITOR);
      });
    });

    it('should posses the specified user role on authenticated access', async () => {
      withUserDb(async (client, user) => {
        expect(user).toBeDefined();
        expect(typeof user.id).toBe('string');
        expect(typeof user.username).toBe('string');
        expect(typeof user.email).toBe('string');
        expect(typeof user.password).toBe('string');
        expect(typeof user.role).toBe('string');

        const result = await client.query<{ result: string }>(
          'select current_role as result'
        );

        expect(result).toBeDefined();
        expect(result.rows.length).toBe(1);
        expect(result.rows[0].result).toBe(user.role);
      });
    });

    it('should posses the custom user role on authenticated access', async () => {
      withUserDb(APP_MANAGER, async (client, user) => {
        expect(user).toBeDefined();
        expect(typeof user.id).toBe('string');
        expect(typeof user.username).toBe('string');
        expect(typeof user.email).toBe('string');
        expect(typeof user.password).toBe('string');
        expect(user.role).toBe(APP_MANAGER);

        const result = await client.query<{ result: string }>(
          'select current_role as result'
        );

        expect(result).toBeDefined();
        expect(result.rows.length).toBe(1);
        expect(result.rows[0].result).toBe(user.role);
      });
    });
  });
});
