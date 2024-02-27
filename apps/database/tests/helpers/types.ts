import { PoolClient } from 'pg';

export type UserDetails = {
  id: string;
  username: string;
  email: string;
  role: string;
  password: string;
};

export type ClientCallback<T = any> = (client: PoolClient) => Promise<T>;
export type ClientWithUserCallback<T = any> = (
  client: PoolClient,
  user: UserDetails
) => Promise<T>;
