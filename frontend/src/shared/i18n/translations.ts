import { Translations, Language } from './types';

const en: Translations = {
    common: {
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        cancel: 'Cancel',
        save: 'Save',
        saving: 'Saving...',
        delete: 'Delete',
        edit: 'Edit',
        back: 'Back',
        search: 'Search',
        noResults: 'No results found',
        remove: 'Remove',
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
    candidateForm: {
        title: 'Add New Candidate',
        personalInfo: 'Personal Information',
        cv: 'Curriculum Vitae',
        uploadCV: 'Click to upload CV (PDF only, max 10MB)',
        cvHelp: 'Only PDF files are accepted, maximum 10MB',
        success: 'Candidate created successfully!',
        fields: {
            firstName: 'First Name',
            lastName: 'Last Name',
            email: 'Email',
            phone: 'Phone',
            addressLine1: 'Address Line 1',
            addressLine2: 'Address Line 2',
            city: 'City',
            state: 'State/Province',
            postalCode: 'Postal Code',
            country: 'Country',
        },
        errors: {
            generic: 'Error creating candidate',
            pdfOnly: 'Only PDF files are allowed',
            fileTooLarge: 'File size exceeds 10MB limit',
        },
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
        saving: 'Guardando...',
        delete: 'Eliminar',
        edit: 'Editar',
        back: 'Volver',
        search: 'Buscar',
        noResults: 'No se encontraron resultados',
        remove: 'Eliminar',
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
    candidateForm: {
        title: 'Agregar Nuevo Candidato',
        personalInfo: 'Información Personal',
        cv: 'Currículum Vitae',
        uploadCV: 'Haz clic para subir CV (solo PDF, máx 10MB)',
        cvHelp: 'Solo se aceptan archivos PDF, máximo 10MB',
        success: '¡Candidato creado exitosamente!',
        fields: {
            firstName: 'Nombre',
            lastName: 'Apellido',
            email: 'Correo Electrónico',
            phone: 'Teléfono',
            addressLine1: 'Dirección Línea 1',
            addressLine2: 'Dirección Línea 2',
            city: 'Ciudad',
            state: 'Estado/Provincia',
            postalCode: 'Código Postal',
            country: 'País',
        },
        errors: {
            generic: 'Error al crear candidato',
            pdfOnly: 'Solo se permiten archivos PDF',
            fileTooLarge: 'El tamaño del archivo excede el límite de 10MB',
        },
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
