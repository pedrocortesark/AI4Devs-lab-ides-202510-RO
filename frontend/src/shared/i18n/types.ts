export type Language = 'en' | 'es';

export interface Translations {
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    save: string;
    saving: string;
    delete: string;
    edit: string;
    back: string;
    search: string;
    noResults: string;
    remove: string;
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
  candidateForm: {
    title: string;
    personalInfo: string;
    cv: string;
    uploadCV: string;
    cvHelp: string;
    success: string;
    fields: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      addressLine1: string;
      addressLine2: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
    errors: {
      generic: string;
      pdfOnly: string;
      fileTooLarge: string;
    };
  };
  errors: {
    generic: string;
    network: string;
    notFound: string;
    validation: string;
  };
}
