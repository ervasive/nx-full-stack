import { withUserDb } from './helpers/helpers';

describe('test helpers', () => {
  it('should create and become user', async () => {
    await withUserDb(async (client, user) => {
      expect(user).not.toBeNull();

      const {
        rows: [{ current_session_id }],
      } = await client.query<{ current_session_id: string }>(`--sql
        select * from app_public.current_session_id()
      `);

      expect(current_session_id).toBeTruthy();

      const {
        rows: [{ current_user_id }],
      } = await client.query<{ current_user_id: string }>(`--sql
        select * from app_hidden.current_user_id()
      `);

      expect(current_user_id).toBeTruthy();
    });
  });
});
