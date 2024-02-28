/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
  locales: ['en', 'ru', 'ro'],
  sourceLocale: 'en',
  catalogs: [
    {
      path: '<rootDir>/libs/admin/i18n/src/lib/messages/{locale}/index',
      include: ['apps/admin/src', 'libs/admin'],
    },
    {
      path: '<rootDir>/libs/storefront/i18n/src/lib/messages/{locale}/index',
      include: ['apps/storefront/src', 'libs/storefront'],
    },
  ],
  format: 'po',
};
