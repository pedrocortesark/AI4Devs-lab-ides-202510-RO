import { z } from 'zod';

// Education schema for validation
export const educationSchema = z.object({
    institution: z.string().min(1, 'Institution is required').max(255),
    degree: z.string().min(1, 'Degree is required').max(255),
    fieldOfStudy: z.string().max(255).optional(),
    startDate: z.string().datetime('Invalid date format'),
    endDate: z.string().datetime('Invalid date format').optional(),
    current: z.boolean().default(false),
});

// Work experience schema for validation
export const workExperienceSchema = z.object({
    company: z.string().min(1, 'Company is required').max(255),
    position: z.string().min(1, 'Position is required').max(255),
    description: z.string().optional(),
    startDate: z.string().datetime('Invalid date format'),
    endDate: z.string().datetime('Invalid date format').optional(),
    current: z.boolean().default(false),
});

// Create candidate request schema
export const createCandidateSchema = z.object({
    firstName: z.string().min(1, 'First name is required').max(100),
    lastName: z.string().min(1, 'Last name is required').max(100),
    email: z.string().email('Invalid email format').max(255),
    phone: z.string().max(50).optional(),
    address: z.string().max(500).optional(),
    educations: z.array(educationSchema).optional(),
    workExperiences: z.array(workExperienceSchema).optional(),
});

// TypeScript types inferred from schemas
export type Education = z.infer<typeof educationSchema>;
export type WorkExperience = z.infer<typeof workExperienceSchema>;
export type CreateCandidateRequest = z.infer<typeof createCandidateSchema>;

// Response types
export interface Candidate
{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string;
    educations: EducationRecord[];
    workExperiences: WorkExperienceRecord[];
    cvDocument?: CVDocument;
    createdAt: string;
    updatedAt: string;
}

export interface EducationRecord
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

export interface WorkExperienceRecord
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

export interface ListCandidatesResponse
{
    candidates: Candidate[];
    total: number;
}
