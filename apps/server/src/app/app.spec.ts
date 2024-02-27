import { afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import Fastify, { FastifyInstance } from 'fastify';
import { app } from './app';

describe('GET /', () => {
  let server: FastifyInstance;

  beforeEach(() => {
    server = Fastify();
    server.register(app);
  });

  afterEach(() => server.close());

  // TODO: find a better way of exiting at the of tests run successfully
  afterAll(() => process.exit());

  it('should respond with a message', async () => {
    const response = await server.inject({
      method: 'GET',
      url: '/echo',
    });

    expect(response.json()).toEqual({ message: 'Echo route' });
  });
});
