/**
 * Standardized error response format
 */
export interface ErrorResponse
{
    error: {
        code: string;
        message: string;
        details?: any;
        timestamp: string;
    };
}

/**
 * Create standardized error response
 */
export function createErrorResponse(
    code: string,
    message: string,
    details?: any
): ErrorResponse
{
    return {
        error: {
            code,
            message,
            details,
            timestamp: new Date().toISOString()
        }
    };
}

/**
 * Common error codes
 */
export const ErrorCodes = {
    VALIDATION_ERROR: 'VALIDATION_ERROR',
    EMAIL_DUPLICATE: 'EMAIL_DUPLICATE',
    CANDIDATE_NOT_FOUND: 'CANDIDATE_NOT_FOUND',
    NO_FILE_PROVIDED: 'NO_FILE_PROVIDED',
    INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
    FILE_TOO_LARGE: 'FILE_TOO_LARGE',
    CV_ALREADY_EXISTS: 'CV_ALREADY_EXISTS',
    INTERNAL_ERROR: 'INTERNAL_ERROR'
} as const;
