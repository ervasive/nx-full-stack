import { getEnv } from '@/common';
import Fastify from 'fastify';
import { app } from './app/app';

const { SERVER_PORT, SERVER_HOST } = getEnv();

// Instantiate Fastify with some config
const server = Fastify({
  logger: true,
});

// Register your application as a normal plugin.
server.register(app);

// Start listening.
server.listen({ port: SERVER_PORT, host: SERVER_HOST }, (err) => {
  if (err) {
    server.log.error(err);
    process.exit(1);
  } else {
    console.log(`[ ready ] http://${SERVER_HOST}:${SERVER_PORT}`);
  }
});
