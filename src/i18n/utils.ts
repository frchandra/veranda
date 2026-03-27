import en from './en';
import id from './id';
import ja from './ja';

const translations = { en, id, ja };

export function useTranslations(lang: keyof typeof translations) {
  return function t(key: keyof typeof en) {
    return translations[lang]?.[key] || translations['en'][key];
  };
}
