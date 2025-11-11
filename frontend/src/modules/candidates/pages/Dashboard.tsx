import React from 'react';
import { useI18n } from '../../../shared/hooks/useI18n';
import './Dashboard.css';

export const Dashboard: React.FC = () => {
  const { t, language, changeLanguage } = useI18n();

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>{t('dashboard.title')}</h1>
        <div className="language-switcher">
          <button
            onClick={() => changeLanguage('es')}
            className={language === 'es' ? 'active' : ''}
          >
            ES
          </button>
          <button
            onClick={() => changeLanguage('en')}
            className={language === 'en' ? 'active' : ''}
          >
            EN
          </button>
        </div>
      </div>

      <div className="dashboard-welcome">
        <p>{t('dashboard.welcome')}</p>
      </div>

      <div className="dashboard-actions">
        <button className="btn btn-primary">{t('dashboard.addCandidate')}</button>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-card">
          <h2>{t('candidates.title')}</h2>
          <p>{t('candidates.noCandidates')}</p>
        </div>
      </div>
    </div>
  );
};
