import { Request, Response, NextFunction } from 'express';
import { CandidateService, CandidateError } from '../services/CandidateService';
import { DocumentError } from '../services/CandidateDocumentService';
import { CreateCandidateSchema } from '../dto/CreateCandidateDTO';
import { logger } from '@shared/infrastructure/logger/logger';

/**
 * Controller for candidate-related HTTP endpoints
 */
export class CandidateController
{
    private candidateService: CandidateService;

    constructor()
    {
        this.candidateService = new CandidateService();
    }

    /**
     * POST /api/candidates
     * Creates a new candidate with optional CV upload
     * Accepts: application/json or multipart/form-data
     */
    createCandidate = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> =>
    {
        try
        {
            // Parse and validate request body
            // For multipart/form-data, parse JSON fields from body
            let candidateData = req.body;

            // If content-type is multipart, parse JSON strings
            if (req.is('multipart/form-data'))
            {
                // Parse education and experience arrays if sent as JSON strings
                if (typeof candidateData.education === 'string')
                {
                    candidateData.education = JSON.parse(candidateData.education);
                }
                if (typeof candidateData.experience === 'string')
                {
                    candidateData.experience = JSON.parse(candidateData.experience);
                }
            }

            // Validate with Zod schema
            const validated = CreateCandidateSchema.parse(candidateData);

            // Get uploaded CV file if present
            const cvFile = req.file;

            // Create candidate
            const candidate = await this.candidateService.createCandidate(
                validated,
                cvFile
            );

            res.status(201).json(candidate);
        }
        catch (error)
        {
            // Handle validation errors from Zod
            if (error instanceof Error && error.name === 'ZodError')
            {
                const zodError = error as any;
                const errors = zodError.errors.map((err: any) => ({
                    field: err.path.join('.'),
                    message: err.message,
                    code: err.code
                }));

                res.status(400).json({
                    type: 'https://lti-ats.com/errors/validation-error',
                    title: 'Validation Error',
                    status: 400,
                    detail: 'One or more fields failed validation',
                    errors
                });
                return;
            }

            // Handle document-related errors (413, 415)
            if (error instanceof DocumentError)
            {
                res.status(error.statusCode).json({
                    type: `https://lti-ats.com/errors/${error.code?.toLowerCase()}`,
                    title: error.name,
                    status: error.statusCode,
                    detail: error.message,
                    code: error.code
                });
                return;
            }

            // Handle candidate-related errors (409 for duplicate email)
            if (error instanceof CandidateError)
            {
                res.status(error.statusCode).json({
                    type: `https://lti-ats.com/errors/${error.code?.toLowerCase()}`,
                    title: error.name,
                    status: error.statusCode,
                    detail: error.message,
                    code: error.code
                });
                return;
            }

            // Log unexpected errors
            logger.error('Unexpected error in createCandidate', { error });

            // Pass to global error handler
            next(error);
        }
    };

    /**
     * GET /api/candidates/:id
     * Gets a candidate by ID
     */
    getCandidateById = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> =>
    {
        try
        {
            const { id } = req.params;
            const candidate = await this.candidateService.getCandidateById(id);

            if (!candidate)
            {
                res.status(404).json({
                    type: 'https://lti-ats.com/errors/not-found',
                    title: 'Not Found',
                    status: 404,
                    detail: 'Candidate not found'
                });
                return;
            }

            res.status(200).json(candidate);
        }
        catch (error)
        {
            logger.error('Error getting candidate', { error });
            next(error);
        }
    };

    /**
     * GET /api/candidates
     * Lists all candidates
     */
    listCandidates = async (
        _req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> =>
    {
        try
        {
            const candidates = await this.candidateService.listCandidates();
            res.status(200).json(candidates);
        }
        catch (error)
        {
            logger.error('Error listing candidates', { error });
            next(error);
        }
    };
}
