import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { createErrorResponse, ErrorCodes } from '../utils/errorResponse';

/**
 * Middleware to validate request body against Zod schema
 */
export function validateRequest(schema: z.ZodSchema)
{
    return async (req: Request, res: Response, next: NextFunction) =>
    {
        try
        {
            req.body = await schema.parseAsync(req.body);
            next();
        } catch (error)
        {
            if (error instanceof z.ZodError)
            {
                return res.status(400).json(
                    createErrorResponse(
                        ErrorCodes.VALIDATION_ERROR,
                        'Errores de validación en los datos enviados',
                        error.errors
                    )
                );
            }
            next(error);
        }
    };
}
