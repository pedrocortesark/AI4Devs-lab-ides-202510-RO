import { Router } from 'express';
import { CandidateController } from '../controllers/CandidateController';
import { upload } from '@shared/infrastructure/http/middlewares/uploadConfig';

const router = Router();
const candidateController = new CandidateController();

/**
 * POST /api/candidates
 * Create a new candidate with optional CV upload
 * 
 * Accepts:
 * - application/json (candidate data, no file)
 * - multipart/form-data (candidate data + cv file)
 * 
 * Request body:
 * {
 *   "firstName": "string",
 *   "lastName": "string",
 *   "email": "string",
 *   "phone": "string (E.164 format, optional)",
 *   "addressLine1": "string (optional)",
 *   "addressLine2": "string (optional)",
 *   "city": "string (optional)",
 *   "state": "string (optional)",
 *   "postalCode": "string (optional)",
 *   "country": "string (optional)",
 *   "education": [
 *     {
 *       "institution": "string (required)",
 *       "degree": "string (optional)",
 *       "fieldOfStudy": "string (optional)",
 *       "startYear": number (optional),
 *       "endYear": number (optional)
 *     }
 *   ],
 *   "experience": [
 *     {
 *       "company": "string (required)",
 *       "title": "string (required)",
 *       "description": "string (optional)",
 *       "startDate": "ISO 8601 date (optional)",
 *       "endDate": "ISO 8601 date (optional)"
 *     }
 *   ]
 * }
 * 
 * File field (for multipart): cv (PDF only, max 10MB)
 * 
 * Responses:
 * - 201: Candidate created successfully
 * - 400: Validation error (invalid fields)
 * - 409: Duplicate email
 * - 413: File too large (>10MB)
 * - 415: Unsupported media type (not PDF)
 */
router.post(
    '/',
    upload.single('cv'), // Optional CV file upload
    candidateController.createCandidate
);

/**
 * GET /api/candidates/:id
 * Get a candidate by ID
 * 
 * Responses:
 * - 200: Candidate found
 * - 404: Candidate not found
 */
router.get('/:id', candidateController.getCandidateById);

/**
 * GET /api/candidates
 * List all candidates (not deleted)
 * 
 * Responses:
 * - 200: Array of candidates
 */
router.get('/', candidateController.listCandidates);

export { router as candidateRoutes };
