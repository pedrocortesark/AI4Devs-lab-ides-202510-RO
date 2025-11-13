// Candidate entity
export interface Candidate
{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string;
    educations: Education[];
    workExperiences: WorkExperience[];
    cvDocument?: CVDocument;
    createdAt: string;
    updatedAt: string;
}

// Education entity
export interface Education
{
    id: string;
    candidateId: string;
    institution: string;
    degree: string;
    fieldOfStudy?: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    createdAt: string;
}

// Work experience entity
export interface WorkExperience
{
    id: string;
    candidateId: string;
    company: string;
    position: string;
    description?: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    createdAt: string;
}

// CV document entity
export interface CVDocument
{
    id: string;
    candidateId: string;
    filename: string;
    originalName: string;
    mimeType: string;
    sizeBytes: number;
    storagePath: string;
    uploadedAt: string;
}

// Request DTOs
export interface CreateCandidateRequest
{
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string;
    educations?: Array<{
        institution: string;
        degree: string;
        fieldOfStudy?: string;
        startDate: string;
        endDate?: string;
        current: boolean;
    }>;
    workExperiences?: Array<{
        company: string;
        position: string;
        description?: string;
        startDate: string;
        endDate?: string;
        current: boolean;
    }>;
}

// Response DTOs
export type CreateCandidateResponse = Candidate;
export type GetCandidateResponse = Candidate;

export interface UploadCVResponse
{
    id: string;
    candidateId: string;
    filename: string;
    originalName: string;
    mimeType: string;
    sizeBytes: number;
    uploadedAt: string;
}

export interface ListCandidatesResponse
{
    candidates: Candidate[];
    total: number;
}

// API Error response
export interface APIError
{
    error: {
        code: string;
        message: string;
        details?: any;
        timestamp: string;
    };
}
