import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false,
    },
    resources: {
      en: {
        translation: {
          language: 'Language',
        },
      },
      pt: {
        translation: {
          language: 'idioma',
        },
      },
      fr: {
        translation: {
          language: 'langue',
        },
      },
      es: {
        translation: {
          language: 'idioma',
        },
      },
      de: {
        translation: {
          language: 'Sprache',
        },
      },
      it: {
        translation: {
          language: 'Lingua',
        },
      },
    },
  });

export default i18n;
