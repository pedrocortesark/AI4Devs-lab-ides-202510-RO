import { Request, Response } from 'express';
import { HealthController } from './healthController';
import { prisma } from '@shared/infrastructure/database/prismaClient';

jest.mock('@shared/infrastructure/database/prismaClient', () => ({
    prisma: {
        $queryRaw: jest.fn(),
    },
}));

describe('HealthController', () =>
{
    let healthController: HealthController;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let jsonMock: jest.Mock;
    let statusMock: jest.Mock;

    beforeEach(() =>
    {
        healthController = new HealthController();
        mockRequest = {};
        jsonMock = jest.fn();
        statusMock = jest.fn().mockReturnValue({ json: jsonMock });
        mockResponse = {
            status: statusMock,
            json: jsonMock,
        };
    });

    afterEach(() =>
    {
        jest.clearAllMocks();
    });

    describe('check', () =>
    {
        it('should return 200 with healthy status when database is connected', async () =>
        {
            (prisma.$queryRaw as jest.Mock).mockResolvedValue([{ 1: 1 }]);

            await healthController.check(mockRequest as Request, mockResponse as Response);

            expect(statusMock).toHaveBeenCalledWith(200);
            expect(jsonMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: 'healthy',
                    database: 'connected',
                    service: 'lti-backend',
                })
            );
        });

        it('should return 503 with unhealthy status when database is disconnected', async () =>
        {
            (prisma.$queryRaw as jest.Mock).mockRejectedValue(new Error('Database connection failed'));

            await healthController.check(mockRequest as Request, mockResponse as Response);

            expect(statusMock).toHaveBeenCalledWith(503);
            expect(jsonMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    status: 'unhealthy',
                    database: 'disconnected',
                    error: 'Database connection failed',
                })
            );
        });

        it('should include response time in health check', async () =>
        {
            (prisma.$queryRaw as jest.Mock).mockResolvedValue([{ 1: 1 }]);

            await healthController.check(mockRequest as Request, mockResponse as Response);

            expect(jsonMock).toHaveBeenCalledWith(
                expect.objectContaining({
                    responseTime: expect.stringMatching(/\d+ms/),
                })
            );
        });
    });
});
