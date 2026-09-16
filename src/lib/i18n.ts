import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'uz',
    supportedLngs: ['uz', 'ru', 'en'],
    load: 'languageOnly',
    detection: {
      // A first visit opens in Uzbek; only a language the visitor picked
      // (stored under `language`) or a `?lng=` link overrides that. The
      // browser language is deliberately not consulted: most browsers here
      // are set to Russian or English. The custom key also retires values
      // the default detector cached from the browser before this change.
      order: ['querystring', 'localStorage'],
      caches: ['localStorage'],
      lookupLocalStorage: 'language',
    },
    interpolation: {
      escapeValue: false
    },
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'
    }
  });

// Keep <html lang> in step with the active language for screen readers and search engines.
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
});

export default i18n;
