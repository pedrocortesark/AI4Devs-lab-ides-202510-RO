import { Request, Response, NextFunction } from 'express';
import { DomainError } from '@shared/domain/errors/domainError';
import { logger } from '@shared/infrastructure/logger/logger';

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    _next: NextFunction
) =>
{
    logger.error(`Error: ${err.message}`, {
        method: req.method,
        path: req.path,
        stack: err.stack,
    });

    // Domain errors (expected errors)
    if (err instanceof DomainError)
    {
        return res.status(err.statusCode).json({
            type: 'about:blank',
            title: err.name,
            status: err.statusCode,
            detail: err.message,
            instance: req.path,
            code: err.code,
        });
    }

    // Unexpected errors
    return res.status(500).json({
        type: 'about:blank',
        title: 'Internal Server Error',
        status: 500,
        detail: process.env.NODE_ENV === 'production'
            ? 'An unexpected error occurred'
            : err.message,
        instance: req.path,
    });
};
