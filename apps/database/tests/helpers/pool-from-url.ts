import { Pool } from 'pg';

const pools: Record<string, Pool> = {};

/**
 * Get or create database pool
 *
 * @param url - database connection string
 * @returns node-postgres pool
 */
export function poolFromUrl(url: string) {
  if (!pools[url]) {
    pools[url] = new Pool({ connectionString: url });
  }

  return pools[url];
}
