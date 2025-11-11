import { useState, useCallback } from 'react';
import { translations, DEFAULT_LANGUAGE } from '../i18n/translations';
import { Language, Translations } from '../i18n/types';

export const useI18n = () => {
  const [language, setLanguage] = useState<Language>(DEFAULT_LANGUAGE);

  const t = useCallback(
    (key: string): string => {
      const keys = key.split('.');
      let value: any = translations[language];

      for (const k of keys) {
        value = value?.[k];
      }

      return value || key;
    },
    [language]
  );

  const changeLanguage = useCallback((newLanguage: Language) => {
    setLanguage(newLanguage);
  }, []);

  return {
    t,
    language,
    changeLanguage,
    translations: translations[language] as Translations,
  };
};
