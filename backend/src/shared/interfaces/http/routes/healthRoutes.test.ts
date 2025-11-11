import request from 'supertest';
import { app } from '../../../../app';
import { prisma } from '@shared/infrastructure/database/prismaClient';

describe('Health Routes E2E', () =>
{
    afterAll(async () =>
    {
        await prisma.$disconnect();
    });

    describe('GET /health', () =>
    {
        it('should return 200 with health status', async () =>
        {
            const response = await request(app).get('/health');

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('status', 'healthy');
            expect(response.body).toHaveProperty('service', 'lti-backend');
            expect(response.body).toHaveProperty('database', 'connected');
            expect(response.body).toHaveProperty('timestamp');
            expect(response.body).toHaveProperty('uptime');
            expect(response.body).toHaveProperty('responseTime');
        });

        it('should return valid timestamp format', async () =>
        {
            const response = await request(app).get('/health');

            expect(response.status).toBe(200);
            const timestamp = new Date(response.body.timestamp);
            expect(timestamp).toBeInstanceOf(Date);
            expect(timestamp.getTime()).not.toBeNaN();
        });

        it('should return response time in milliseconds', async () =>
        {
            const response = await request(app).get('/health');

            expect(response.status).toBe(200);
            expect(response.body.responseTime).toMatch(/^\d+ms$/);
        });
    });
});
