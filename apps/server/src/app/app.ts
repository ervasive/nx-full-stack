import AutoLoad from '@fastify/autoload';
import { FastifyInstance } from 'fastify';
import * as path from 'path';
import postgraphile from 'postgraphile';
import { grafserv } from 'postgraphile/grafserv/fastify/v4';
import config from '../graphile.config';

/* eslint-disable-next-line */
export interface AppOptions {}

const pgl = postgraphile(config);

export async function app(fastify: FastifyInstance, opts: AppOptions) {
  // Place here your custom code!

  // Create a Grafserv instance
  const serv = pgl.createServ(grafserv);

  serv.addTo(fastify).catch((e) => {
    console.error(e);
    process.exit(1);
  });

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: { ...opts },
  });

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: { ...opts },
  });
}
