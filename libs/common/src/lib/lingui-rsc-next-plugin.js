const TRANS_VIRTUAL_MODULE_NAME = 'virtual-lingui-trans';

class LinguiTransRscResolver {
  rsc;

  constructor(rscImportPath) {
    this.rsc = rscImportPath;
  }

  apply(resolver) {
    const target = resolver.ensureHook('resolve');

    resolver
      .getHook('resolve')
      .tapAsync(
        'LinguiTransRscResolver',
        (request, resolveContext, callback) => {
          if (request.request === TRANS_VIRTUAL_MODULE_NAME) {
            const req = {
              ...request,
              request:
                request.context.issuerLayer === 'rsc'
                  ? // RSC Version without Context
                    this.rsc
                  : // Regular version
                    '@lingui/react',
            };

            return resolver.doResolve(
              target,
              req,
              null,
              resolveContext,
              callback
            );
          }

          callback();
        }
      );
  }
}

module.exports = (rscImportPath) => (config) => {
  if (!config.experimental) {
    config.experimental = {};
  }

  const swcPluginConfig = [
    '@lingui/swc-plugin',
    {
      runtimeModules: {
        trans: [TRANS_VIRTUAL_MODULE_NAME, 'Trans'],
      },
    },
  ];

  if (Array.isArray(config.experimental.swcPlugins)) {
    config.experimental.swcPlugins.push(swcPluginConfig);
  } else {
    config.experimental.swcPlugins = [swcPluginConfig];
  }

  config.webpack = (config) => {
    config.resolve.plugins.push(new LinguiTransRscResolver(rscImportPath));
    return config;
  };

  return config;
};
