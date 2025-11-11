import { Request, Response } from 'express';
import { prisma } from '@shared/infrastructure/database/prismaClient';
import { logger } from '@shared/infrastructure/logger/logger';

export class HealthController
{
    /**
     * Health check endpoint
     * Returns server status and database connectivity
     */
    public async check(_req: Request, res: Response): Promise<void>
    {
        const startTime = Date.now();

        try
        {
            // Check database connectivity
            await prisma.$queryRaw`SELECT 1`;

            const responseTime = Date.now() - startTime;

            res.status(200).json({
                status: 'healthy',
                timestamp: new Date().toISOString(),
                service: 'lti-backend',
                version: process.env.npm_package_version || '1.0.0',
                uptime: process.uptime(),
                database: 'connected',
                responseTime: `${responseTime}ms`,
            });
        } catch (error)
        {
            logger.error('Health check failed', error);

            res.status(503).json({
                status: 'unhealthy',
                timestamp: new Date().toISOString(),
                service: 'lti-backend',
                database: 'disconnected',
                error: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }
}
