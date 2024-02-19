import { FastifyInstance } from 'fastify';

export default async function (fastify: FastifyInstance) {
  fastify.get('/', async function () {
    return { message: 'This is the message from a demo branch!' };
  });
}
