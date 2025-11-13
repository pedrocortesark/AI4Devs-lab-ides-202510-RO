import { Request, Response, NextFunction } from 'express';
import { validateRequest } from '../validateRequest';
import { z } from 'zod';

describe('validateRequest middleware', () =>
{
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() =>
    {
        mockRequest = {
            body: {},
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        mockNext = jest.fn();
    });

    afterEach(() =>
    {
        jest.clearAllMocks();
    });

    it('should call next() when validation passes', async () =>
    {
        const schema = z.object({
            firstName: z.string(),
            lastName: z.string(),
        });

        mockRequest.body = {
            firstName: 'John',
            lastName: 'Doe',
        };

        const middleware = validateRequest(schema);
        await middleware(mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockNext).toHaveBeenCalledTimes(1);
        expect(mockNext).toHaveBeenCalledWith();
        expect(mockResponse.status).not.toHaveBeenCalled();
    });

    it('should return 400 with error details when validation fails', async () =>
    {
        const schema = z.object({
            firstName: z.string().min(1, 'First name is required'),
            lastName: z.string().min(1, 'Last name is required'),
            email: z.string().email('Invalid email format'),
        });

        mockRequest.body = {
            firstName: '',
            lastName: 'Doe',
            email: 'invalid-email',
        };

        const middleware = validateRequest(schema);
        await middleware(mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith(
            expect.objectContaining({
                error: expect.objectContaining({
                    code: 'VALIDATION_ERROR',
                    message: expect.any(String),
                    details: expect.any(Array),
                }),
            })
        );
        expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle missing required fields', async () =>
    {
        const schema = z.object({
            firstName: z.string(),
            lastName: z.string(),
            email: z.string(),
        });

        mockRequest.body = {
            firstName: 'John',
            // lastName is missing
            // email is missing
        };

        const middleware = validateRequest(schema);
        await middleware(mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith(
            expect.objectContaining({
                error: expect.objectContaining({
                    code: 'VALIDATION_ERROR',
                }),
            })
        );
        expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle nested object validation', async () =>
    {
        const schema = z.object({
            firstName: z.string(),
            lastName: z.string(),
            education: z.object({
                institution: z.string().min(1),
                degree: z.string().min(1),
            }),
        });

        mockRequest.body = {
            firstName: 'John',
            lastName: 'Doe',
            education: {
                institution: '',
                degree: 'Bachelor',
            },
        };

        const middleware = validateRequest(schema);
        await middleware(mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith(
            expect.objectContaining({
                error: expect.objectContaining({
                    code: 'VALIDATION_ERROR',
                }),
            })
        );
        expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle array validation', async () =>
    {
        const schema = z.object({
            firstName: z.string(),
            educations: z.array(
                z.object({
                    institution: z.string().min(1),
                    degree: z.string().min(1),
                })
            ),
        });

        mockRequest.body = {
            firstName: 'John',
            educations: [
                {
                    institution: 'MIT',
                    degree: 'Bachelor',
                },
                {
                    institution: '',
                    degree: 'Master',
                },
            ],
        };

        const middleware = validateRequest(schema);
        await middleware(mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith(
            expect.objectContaining({
                error: expect.objectContaining({
                    code: 'VALIDATION_ERROR',
                }),
            })
        );
        expect(mockNext).not.toHaveBeenCalled();
    });

    it('should accept optional fields when not provided', async () =>
    {
        const schema = z.object({
            firstName: z.string(),
            lastName: z.string(),
            phone: z.string().optional(),
            address: z.string().optional(),
        });

        mockRequest.body = {
            firstName: 'John',
            lastName: 'Doe',
            // phone and address are optional and not provided
        };

        const middleware = validateRequest(schema);
        await middleware(mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockNext).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).not.toHaveBeenCalled();
    });
});
