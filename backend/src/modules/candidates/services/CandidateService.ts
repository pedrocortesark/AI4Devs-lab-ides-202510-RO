import { prisma } from '@shared/infrastructure/database/prismaClient';
import { Prisma } from '@prisma/client';
import { CreateCandidateDTO, CandidateResponseDTO } from '../dto/CreateCandidateDTO';
import { CandidateDocumentService } from './CandidateDocumentService';
import { logger } from '@shared/infrastructure/logger/logger';

/**
 * Custom error for candidate-related operations
 */
export class CandidateError extends Error
{
    constructor(
        message: string,
        public readonly statusCode: number = 400,
        public readonly code?: string
    )
    {
        super(message);
        this.name = 'CandidateError';
    }
}

/**
 * Service for managing candidate domain operations
 */
export class CandidateService
{
    private documentService: CandidateDocumentService;

    constructor()
    {
        this.documentService = new CandidateDocumentService();
    }

    /**
     * Normalizes email to lowercase for consistent storage and comparison
     * @param email Email to normalize
     * @returns Lowercase email
     */
    private normalizeEmail(email: string): string
    {
        return email.toLowerCase().trim();
    }

    /**
     * Creates a new candidate with optional education, experience, and document
     * @param data Candidate data
     * @param cvFile Optional CV file (Multer file object)
     * @returns Created candidate with relations
     */
    async createCandidate(
        data: CreateCandidateDTO,
        cvFile?: Express.Multer.File
    ): Promise<CandidateResponseDTO>
    {
        // Normalize email to lowercase
        const normalizedEmail = this.normalizeEmail(data.email);

        try
        {
            // Check if email already exists (case-insensitive due to normalization)
            const existingCandidate = await prisma.candidate.findUnique({
                where: { email: normalizedEmail }
            });

            if (existingCandidate)
            {
                throw new CandidateError(
                    'A candidate with this email already exists',
                    409,
                    'DUPLICATE_EMAIL'
                );
            }

            // Prepare candidate data with normalized email
            const candidateData: Prisma.CandidateCreateInput = {
                firstName: data.firstName,
                lastName: data.lastName,
                email: normalizedEmail,
                phone: data.phone,
                addressLine1: data.addressLine1,
                addressLine2: data.addressLine2,
                city: data.city,
                state: data.state,
                postalCode: data.postalCode,
                country: data.country,
                education: data.education && data.education.length > 0 ? {
                    create: data.education.map(edu => ({
                        institution: edu.institution,
                        degree: edu.degree,
                        fieldOfStudy: edu.fieldOfStudy,
                        startYear: edu.startYear,
                        endYear: edu.endYear
                    }))
                } : undefined,
                experience: data.experience && data.experience.length > 0 ? {
                    create: data.experience.map(exp => ({
                        company: exp.company,
                        title: exp.title,
                        description: exp.description,
                        startDate: exp.startDate ? new Date(exp.startDate) : undefined,
                        endDate: exp.endDate ? new Date(exp.endDate) : undefined
                    }))
                } : undefined
            };

            // Create candidate with relations in a transaction
            const candidate = await prisma.candidate.create({
                data: candidateData,
                include: {
                    education: true,
                    experience: true,
                    documents: true
                }
            });

            // Handle CV upload if provided
            if (cvFile)
            {
                try
                {
                    const { filePath, fileName } = await this.documentService.saveDocument(
                        candidate.id,
                        cvFile
                    );

                    // Save document metadata to database
                    const document = await prisma.candidateDocument.create({
                        data: {
                            candidateId: candidate.id,
                            documentKind: 'CV',
                            filePath,
                            fileName,
                            fileSize: cvFile.size,
                            mimeType: cvFile.mimetype
                        }
                    });

                    candidate.documents.push(document);
                }
                catch (error)
                {
                    // If document upload fails, delete the candidate to maintain consistency
                    await prisma.candidate.delete({ where: { id: candidate.id } });
                    throw error;
                }
            }

            logger.info('Candidate created successfully', {
                candidateId: candidate.id,
                email: normalizedEmail
            });

            return this.mapToResponseDTO(candidate);
        }
        catch (error)
        {
            if (error instanceof CandidateError)
            {
                throw error;
            }

            // Handle Prisma unique constraint violation
            if (error instanceof Prisma.PrismaClientKnownRequestError)
            {
                if (error.code === 'P2002')
                {
                    throw new CandidateError(
                        'A candidate with this email already exists',
                        409,
                        'DUPLICATE_EMAIL'
                    );
                }
            }

            logger.error('Failed to create candidate', { error });
            throw new CandidateError(
                'Failed to create candidate',
                500,
                'INTERNAL_ERROR'
            );
        }
    }

    /**
     * Maps Prisma candidate model to response DTO
     */
    private mapToResponseDTO(candidate: any): CandidateResponseDTO
    {
        return {
            id: candidate.id,
            firstName: candidate.firstName,
            lastName: candidate.lastName,
            email: candidate.email,
            phone: candidate.phone,
            addressLine1: candidate.addressLine1,
            addressLine2: candidate.addressLine2,
            city: candidate.city,
            state: candidate.state,
            postalCode: candidate.postalCode,
            country: candidate.country,
            createdAt: candidate.createdAt,
            updatedAt: candidate.updatedAt,
            education: candidate.education.map((edu: any) => ({
                id: edu.id,
                institution: edu.institution,
                degree: edu.degree,
                fieldOfStudy: edu.fieldOfStudy,
                startYear: edu.startYear,
                endYear: edu.endYear
            })),
            experience: candidate.experience.map((exp: any) => ({
                id: exp.id,
                company: exp.company,
                title: exp.title,
                description: exp.description,
                startDate: exp.startDate,
                endDate: exp.endDate
            })),
            documents: candidate.documents.map((doc: any) => ({
                id: doc.id,
                documentKind: doc.documentKind,
                fileName: doc.fileName,
                fileSize: doc.fileSize,
                createdAt: doc.createdAt
            }))
        };
    }

    /**
     * Gets a candidate by ID
     * @param id Candidate ID
     * @returns Candidate or null if not found
     */
    async getCandidateById(id: string): Promise<CandidateResponseDTO | null>
    {
        const candidate = await prisma.candidate.findUnique({
            where: { id, isDeleted: false },
            include: {
                education: true,
                experience: true,
                documents: true
            }
        });

        if (!candidate)
        {
            return null;
        }

        return this.mapToResponseDTO(candidate);
    }

    /**
     * Lists all candidates (not deleted)
     * @returns Array of candidates
     */
    async listCandidates(): Promise<CandidateResponseDTO[]>
    {
        const candidates = await prisma.candidate.findMany({
            where: { isDeleted: false },
            include: {
                education: true,
                experience: true,
                documents: true
            },
            orderBy: { createdAt: 'desc' }
        });

        return candidates.map(c => this.mapToResponseDTO(c));
    }
}
