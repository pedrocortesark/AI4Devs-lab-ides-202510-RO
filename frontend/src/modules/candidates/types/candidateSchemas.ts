import { z } from 'zod';

/**
 * Frontend validation schemas matching backend DTOs
 */

export const CandidateEducationSchema = z
  .object({
    institution: z.string().min(1, 'Institution is required'),
    degree: z.string().optional(),
    fieldOfStudy: z.string().optional(),
    startYear: z
      .number()
      .int()
      .min(1900)
      .max(new Date().getFullYear() + 10)
      .optional(),
    endYear: z
      .number()
      .int()
      .min(1900)
      .max(new Date().getFullYear() + 10)
      .optional(),
  })
  .refine(
    (data) => {
      if (data.startYear && data.endYear) {
        return data.endYear >= data.startYear;
      }
      return true;
    },
    {
      message: 'End year must be greater than or equal to start year',
      path: ['endYear'],
    }
  );

export const CandidateExperienceSchema = z
  .object({
    company: z.string().min(1, 'Company is required'),
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        const start = new Date(data.startDate);
        const end = new Date(data.endDate);
        return end >= start;
      }
      return true;
    },
    {
      message: 'End date must be after or equal to start date',
      path: ['endDate'],
    }
  );

export const CreateCandidateSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Invalid email format'),
  phone: z
    .string()
    .regex(/^\+[1-9]\d{1,14}$/, 'Phone must be in E.164 format (e.g., +1234567890)')
    .optional()
    .or(z.literal('')),
  addressLine1: z.string().max(255).optional(),
  addressLine2: z.string().max(255).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  postalCode: z.string().max(20).optional(),
  country: z.string().max(100).optional(),
  education: z.array(CandidateEducationSchema).optional().default([]),
  experience: z.array(CandidateExperienceSchema).optional().default([]),
});

export type CreateCandidateFormData = z.infer<typeof CreateCandidateSchema>;
export type CandidateEducationFormData = z.infer<typeof CandidateEducationSchema>;
export type CandidateExperienceFormData = z.infer<typeof CandidateExperienceSchema>;
