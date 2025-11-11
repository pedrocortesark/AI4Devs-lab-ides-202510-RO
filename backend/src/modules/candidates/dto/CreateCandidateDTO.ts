import { z } from 'zod';

/**
 * Schema for candidate education entry
 * Institution is required, other fields are optional
 */
export const CandidateEducationSchema = z.object({
    institution: z.string().min(1, 'Institution is required'),
    degree: z.string().optional(),
    fieldOfStudy: z.string().optional(),
    startYear: z.number().int().min(1900).max(new Date().getFullYear() + 10).optional(),
    endYear: z.number().int().min(1900).max(new Date().getFullYear() + 10).optional()
}).refine(
    (data) =>
    {
        if (data.startYear && data.endYear)
        {
            return data.endYear >= data.startYear;
        }
        return true;
    },
    {
        message: 'End year must be greater than or equal to start year',
        path: ['endYear']
    }
);

/**
 * Schema for candidate work experience entry
 * Company and title are required
 */
export const CandidateExperienceSchema = z.object({
    company: z.string().min(1, 'Company is required'),
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    startDate: z.string().datetime().optional().or(z.date().optional()),
    endDate: z.string().datetime().optional().or(z.date().optional())
}).refine(
    (data) =>
    {
        if (data.startDate && data.endDate)
        {
            const start = new Date(data.startDate);
            const end = new Date(data.endDate);
            return end >= start;
        }
        return true;
    },
    {
        message: 'End date must be after or equal to start date',
        path: ['endDate']
    }
);

/**
 * Schema for creating a new candidate
 * Required: firstName, lastName, email
 * Optional: phone (E.164 format), address fields, education, experience
 */
export const CreateCandidateSchema = z.object({
    firstName: z.string().min(1, 'First name is required').max(100),
    lastName: z.string().min(1, 'Last name is required').max(100),
    email: z.string().email('Invalid email format'),

    // Phone in E.164 format: +[country code][number]
    phone: z.string()
        .regex(/^\+[1-9]\d{1,14}$/, 'Phone must be in E.164 format (e.g., +1234567890)')
        .optional(),

    // Granular address fields
    addressLine1: z.string().max(255).optional(),
    addressLine2: z.string().max(255).optional(),
    city: z.string().max(100).optional(),
    state: z.string().max(100).optional(),
    postalCode: z.string().max(20).optional(),
    country: z.string().max(100).optional(),

    // Arrays of related entities
    education: z.array(CandidateEducationSchema).optional().default([]),
    experience: z.array(CandidateExperienceSchema).optional().default([])
});

/**
 * TypeScript types inferred from Zod schemas
 */
export type CreateCandidateDTO = z.infer<typeof CreateCandidateSchema>;
export type CandidateEducationDTO = z.infer<typeof CandidateEducationSchema>;
export type CandidateExperienceDTO = z.infer<typeof CandidateExperienceSchema>;

/**
 * Response DTO for created candidate
 */
export interface CandidateResponseDTO
{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    createdAt: Date;
    updatedAt: Date;
    education: Array<{
        id: string;
        institution: string;
        degree?: string;
        fieldOfStudy?: string;
        startYear?: number;
        endYear?: number;
    }>;
    experience: Array<{
        id: string;
        company: string;
        title: string;
        description?: string;
        startDate?: Date;
        endDate?: Date;
    }>;
    documents: Array<{
        id: string;
        documentKind: string;
        fileName: string;
        fileSize: number;
        createdAt: Date;
    }>;
}
