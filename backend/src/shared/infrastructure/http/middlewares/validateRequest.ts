import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

/**
 * Middleware to validate request body against a Zod schema
 * Returns RFC 7807 Problem Details on validation error
 */
export const validateRequest = (schema: ZodSchema) =>
{
    return (req: Request, res: Response, next: NextFunction): void =>
    {
        try
        {
            // Parse and validate request body
            const validated = schema.parse(req.body);
            req.body = validated;
            next();
        }
        catch (error)
        {
            if (error instanceof ZodError)
            {
                // Format Zod errors as RFC 7807 Problem Details
                const errors = error.errors.map(err => ({
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

            // Unexpected error
            res.status(500).json({
                type: 'https://lti-ats.com/errors/internal-error',
                title: 'Internal Server Error',
                status: 500,
                detail: 'An unexpected error occurred during validation'
            });
        }
    };
};
