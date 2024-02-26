import { PoolClient } from 'pg';

export type User = {
  id: string;
  username: string;
  _email: string;
  _password?: string;
  _role: string;
};

export type ClientCallback<T = any> = (client: PoolClient) => Promise<T>;
