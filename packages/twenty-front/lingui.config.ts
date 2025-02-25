import { defineConfig } from '@lingui/cli';
import { APP_LOCALES } from 'twenty-shared';

export default defineConfig({
  sourceLocale: 'en',
  locales: Object.values(APP_LOCALES),
  pseudoLocale: 'pseudo-en',
  fallbackLocales: {
    'pseudo-en': 'en',
  },
  catalogs: [
    {
      path: '<rootDir>/src/locales/{locale}',
      include: ['src'],
    },
  ],
  catalogsMergePath: '<rootDir>/src/locales/generated/{locale}',
  compileNamespace: 'ts',
  ...(process.env.TRANSLATION_IO_API_KEY
    ? {
        service: {
          name: 'TranslationIO',
          apiKey: process.env.TRANSLATION_IO_API_KEY,
        },
      }
    : {}),
});
