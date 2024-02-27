import { PoolClient } from 'pg';

/**
 * Become root
 *
 * @param client - pool client
 *
 * @returns void
 */
export async function becomeRoot(client: PoolClient) {
  await client.query(`reset role`);
  await client.query(`select set_config('jwt.claims.session_id', null, true)`);
}
