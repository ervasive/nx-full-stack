import { FastifyInstance } from 'fastify';

export default async function (fastify: FastifyInstance) {
  fastify.get('/echo', async function () {
    return { message: 'Echo route' };
  });
}
