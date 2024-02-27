import { getEnv } from '@/common';
import { makePgService } from 'postgraphile/adaptors/pg';
import { PostGraphileAmberPreset } from 'postgraphile/presets/amber';
import { PostGraphileRelayPreset } from 'postgraphile/presets/relay';

const { IS_DEV, DATABASE_URL, ROOT_DATABASE_URL } = getEnv();

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
          role: 'visitor',
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
