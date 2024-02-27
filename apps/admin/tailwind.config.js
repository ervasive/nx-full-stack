const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');
const config = require('../../libs/admin/ui/src/lib/configuration/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...config,
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
};
