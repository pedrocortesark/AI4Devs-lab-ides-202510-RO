import { useState, useCallback, useEffect } from 'react';
import { translations, DEFAULT_LANGUAGE } from '../i18n/translations';
import { Language, Translations } from '../i18n/types';

const LANGUAGE_STORAGE_KEY = 'lti-language';

const getStoredLanguage = (): Language =>
{
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return (stored === 'en' || stored === 'es') ? stored : DEFAULT_LANGUAGE;
};

export const useI18n = () =>
{
    const [language, setLanguage] = useState<Language>(getStoredLanguage());

    useEffect(() =>
    {
        // Update localStorage when language changes
        localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }, [language]);

    const t = useCallback(
        (key: string): string =>
        {
            const keys = key.split('.');
            let value: any = translations[language];

            for (const k of keys)
            {
                value = value?.[k];
            }

            return value || key;
        },
        [language]
    );

    const changeLanguage = useCallback((newLanguage: Language) =>
    {
        setLanguage(newLanguage);
    }, []);

    return {
        t,
        language,
        changeLanguage,
        translations: translations[language] as Translations,
    };
};
