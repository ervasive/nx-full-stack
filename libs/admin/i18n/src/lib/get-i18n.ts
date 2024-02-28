import { setupI18n } from '@lingui/core';
import { cookies } from 'next/headers';
import { cache } from 'react';
import { messages as en } from './messages/en';
import { messages as ro } from './messages/ro';
import { messages as ru } from './messages/ru';

export const getI18n = cache(() => {
  const locales = ['en', 'ru', 'ro'];
  const defaultLocale = locales[1];
  const activeLocale = cookies().get('locale')?.value || defaultLocale;
  const instance = setupI18n({ messages: { en, ru, ro } });

  instance.activate(
    locales.includes(activeLocale) ? activeLocale : defaultLocale
  );

  return instance;
});
