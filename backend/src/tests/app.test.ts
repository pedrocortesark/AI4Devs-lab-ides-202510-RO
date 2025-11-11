import request from 'supertest';
import { app } from '../app';

describe('App', () =>
{
    it('should return 404 for unknown routes', async () =>
    {
        const response = await request(app).get('/unknown-route');
        expect(response.statusCode).toBe(404);
        expect(response.body.title).toBe('Not Found');
    });

    it('should have CORS headers', async () =>
    {
        const response = await request(app).get('/health');
        expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
    });
});
