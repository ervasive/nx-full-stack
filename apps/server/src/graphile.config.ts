import { makePgService } from 'postgraphile/adaptors/pg';
import { PostGraphileAmberPreset } from 'postgraphile/presets/amber';
import { PostGraphileRelayPreset } from 'postgraphile/presets/relay';
import { DATABASE_URL, IS_DEV, ROOT_DATABASE_URL } from './constants';

const preset: GraphileConfig.Preset = {
  extends: [PostGraphileAmberPreset, PostGraphileRelayPreset],
  pgServices: [
    makePgService({
      connectionString: DATABASE_URL,
      superuserConnectionString: ROOT_DATABASE_URL,
      schemas: ['app_public'],
      pubsub: true,
    }),
  ],
  gather: {
    pgStrictFunctions: true,
    installWatchFixtures: true,
  },
  schema: {
    // defaultBehavior: '+connection -list -interface:node',
    retryOnInitFail: true,
    dontSwallowErrors: true,
    exportSchemaSDLPath: IS_DEV ? `generated/schema.graphql` : undefined,
    exportSchemaIntrospectionResultPath: IS_DEV
      ? `generated/schema.json`
      : undefined,
    sortExport: true,
    pgForbidSetofFunctionsToReturnNull: true,
  },
  grafast: {
    explain: IS_DEV,
    context(requestContext, args) {
      return {
        pgSettings: {
          ...args.contextValue?.pgSettings,
        },
      };
    },
  },
  grafserv: {
    watch: IS_DEV,
    websockets: true,
  },
};

export default preset;
