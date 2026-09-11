import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import as from './as.json';
import kha from './kha.json';
import miz from './miz.json';
import brx from './brx.json';
import mni from './mni.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    as: { translation: as },
    kha: { translation: kha },
    miz: { translation: miz },
    brx: { translation: brx },
    mni: { translation: mni },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
