import { Router, Request, Response, NextFunction } from 'express';
import { CandidateService } from '../services/CandidateService';
import { validateRequest } from '../middleware/validateRequest';
import { createCandidateSchema } from '../types/candidate';
import { createErrorResponse } from '../utils/errorResponse';
import { uploadCV } from '../middleware/upload';

const router = Router();

/**
 * POST /api/candidates
 * Create a new candidate with basic information
 */
router.post(
    '/',
    validateRequest(createCandidateSchema),
    async (req: Request, res: Response, next: NextFunction) =>
    {
        try
        {
            const candidate = await CandidateService.create(req.body);

            res.status(201).json({
                success: true,
                data: candidate,
            });
        } catch (error: any)
        {
            // Handle unique constraint violation (duplicate email)
            if (error.code === 'P2002' && error.meta?.target?.includes('email'))
            {
                return res.status(409).json(
                    createErrorResponse(
                        'EMAIL_DUPLICATE',
                        'A candidate with this email already exists'
                    )
                );
            }

            // Handle other errors
            console.error('Error creating candidate:', error);
            return res.status(500).json(
                createErrorResponse(
                    'INTERNAL_ERROR',
                    'An error occurred while creating the candidate'
                )
            );
        }
    }
);

/**
 * GET /api/candidates/:id
 * Get a single candidate by ID
 */
router.get(
    '/:id',
    async (req: Request, res: Response, next: NextFunction) =>
    {
        try
        {
            const { id } = req.params;
            const candidate = await CandidateService.findById(id);

            if (!candidate)
            {
                return res.status(404).json(
                    createErrorResponse(
                        'NOT_FOUND',
                        'Candidate not found'
                    )
                );
            }

            res.status(200).json({
                success: true,
                data: candidate,
            });
        } catch (error: any)
        {
            console.error('Error fetching candidate:', error);
            return res.status(500).json(
                createErrorResponse(
                    'INTERNAL_ERROR',
                    'An error occurred while fetching the candidate'
                )
            );
        }
    }
);

/**
 * GET /api/candidates
 * Get all candidates with pagination
 */
router.get(
    '/',
    async (req: Request, res: Response, next: NextFunction) =>
    {
        try
        {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const result = await CandidateService.findAll(page, limit);

            res.status(200).json({
                success: true,
                data: result.candidates,
                pagination: {
                    page,
                    limit,
                    total: result.total,
                    totalPages: Math.ceil(result.total / limit),
                },
            });
        } catch (error: any)
        {
            console.error('Error fetching candidates:', error);
            return res.status(500).json(
                createErrorResponse(
                    'INTERNAL_ERROR',
                    'An error occurred while fetching candidates'
                )
            );
        }
    }
);

/**
 * POST /api/candidates/:id/cv
 * Upload CV document for a candidate
 */
router.post(
    '/:id/cv',
    uploadCV.single('cv'),
    async (req: Request, res: Response, next: NextFunction) =>
    {
        try
        {
            const { id } = req.params;

            if (!req.file)
            {
                return res.status(400).json(
                    createErrorResponse(
                        'VALIDATION_ERROR',
                        'No file uploaded'
                    )
                );
            }

            // Check if candidate exists
            const candidate = await CandidateService.findById(id);
            if (!candidate)
            {
                return res.status(404).json(
                    createErrorResponse(
                        'NOT_FOUND',
                        'Candidate not found'
                    )
                );
            }

            const cvDocument = await CandidateService.uploadCV(id, req.file);

            res.status(201).json({
                success: true,
                data: cvDocument,
            });
        } catch (error: any)
        {
            console.error('Error uploading CV:', error);

            // Handle Multer errors
            if (error.message?.includes('Invalid file type'))
            {
                return res.status(400).json(
                    createErrorResponse(
                        'VALIDATION_ERROR',
                        error.message
                    )
                );
            }

            if (error.message?.includes('File too large'))
            {
                return res.status(400).json(
                    createErrorResponse(
                        'VALIDATION_ERROR',
                        'File size exceeds 10MB limit'
                    )
                );
            }

            return res.status(500).json(
                createErrorResponse(
                    'INTERNAL_ERROR',
                    'An error occurred while uploading the CV'
                )
            );
        }
    }
);

export default router;
