export type Language = 'en' | 'es';

export interface Translations {
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    back: string;
    search: string;
    noResults: string;
  };
  dashboard: {
    title: string;
    welcome: string;
    addCandidate: string;
  };
  candidates: {
    title: string;
    list: string;
    add: string;
    edit: string;
    delete: string;
    details: string;
    noCandidates: string;
  };
  errors: {
    generic: string;
    network: string;
    notFound: string;
    validation: string;
  };
}
