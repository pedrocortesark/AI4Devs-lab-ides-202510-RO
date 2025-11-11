import { Translations, Language } from './types';

const en: Translations = {
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    back: 'Back',
    search: 'Search',
    noResults: 'No results found',
  },
  dashboard: {
    title: 'Dashboard',
    welcome: 'Welcome to LTI - Applicant Tracking System',
    addCandidate: 'Add Candidate',
  },
  candidates: {
    title: 'Candidates',
    list: 'Candidate List',
    add: 'Add Candidate',
    edit: 'Edit Candidate',
    delete: 'Delete Candidate',
    details: 'Candidate Details',
    noCandidates: 'No candidates yet',
  },
  errors: {
    generic: 'An unexpected error occurred',
    network: 'Network error. Please check your connection',
    notFound: 'Resource not found',
    validation: 'Please check the form fields',
  },
};

const es: Translations = {
  common: {
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    cancel: 'Cancelar',
    save: 'Guardar',
    delete: 'Eliminar',
    edit: 'Editar',
    back: 'Volver',
    search: 'Buscar',
    noResults: 'No se encontraron resultados',
  },
  dashboard: {
    title: 'Panel de Control',
    welcome: 'Bienvenido a LTI - Sistema de Seguimiento de Candidatos',
    addCandidate: 'Agregar Candidato',
  },
  candidates: {
    title: 'Candidatos',
    list: 'Lista de Candidatos',
    add: 'Agregar Candidato',
    edit: 'Editar Candidato',
    delete: 'Eliminar Candidato',
    details: 'Detalles del Candidato',
    noCandidates: 'Aún no hay candidatos',
  },
  errors: {
    generic: 'Ocurrió un error inesperado',
    network: 'Error de red. Por favor verifica tu conexión',
    notFound: 'Recurso no encontrado',
    validation: 'Por favor verifica los campos del formulario',
  },
};

export const translations: Record<Language, Translations> = {
  en,
  es,
};

export const DEFAULT_LANGUAGE: Language = 'es';
