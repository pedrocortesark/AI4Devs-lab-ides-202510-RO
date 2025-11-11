import React from 'react';
import { useI18n } from '../../hooks/useI18n';
import './LanguageSwitcher.css';

export const LanguageSwitcher: React.FC = () =>
{
    const { language, changeLanguage } = useI18n();

    return (
        <div className="language-switcher">
            <button
                className={`lang-btn ${language === 'en' ? 'active' : ''}`}
                onClick={() => changeLanguage('en')}
                aria-label="Switch to English"
            >
                EN
            </button>
            <button
                className={`lang-btn ${language === 'es' ? 'active' : ''}`}
                onClick={() => changeLanguage('es')}
                aria-label="Cambiar a Español"
            >
                ES
            </button>
        </div>
    );
};
