const { join } = require('path');
const config = require('./src/lib/configuration/theme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  ...config,
  content: [join(__dirname, 'src/**/*.tsx')],
};
