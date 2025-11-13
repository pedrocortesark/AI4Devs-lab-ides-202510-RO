import { CandidateService } from '../CandidateService';
import { PrismaClient } from '@prisma/client';

// Mock Prisma Client
jest.mock('@prisma/client', () =>
{
    const mockPrismaClient = {
        candidate: {
            create: jest.fn(),
            findUnique: jest.fn(),
            findMany: jest.fn(),
            count: jest.fn(),
        },
        cVDocument: {
            create: jest.fn(),
        },
    };
    return {
        PrismaClient: jest.fn(() => mockPrismaClient),
    };
});

describe('CandidateService', () =>
{
    let mockPrisma: any;

    beforeEach(() =>
    {
        mockPrisma = new PrismaClient();
    });

    afterEach(() =>
    {
        jest.clearAllMocks();
    });

    describe('create', () =>
    {
        it('should create a candidate with educations and work experiences', async () =>
        {
            const candidateData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phone: '+1234567890',
                address: '123 Main St',
                educations: [
                    {
                        institution: 'MIT',
                        degree: 'Bachelor',
                        fieldOfStudy: 'Computer Science',
                        startDate: '2015-09-01',
                        endDate: '2019-06-01',
                        current: false,
                    },
                ],
                workExperiences: [
                    {
                        company: 'Tech Corp',
                        position: 'Software Engineer',
                        description: 'Developed web applications',
                        startDate: '2019-07-01',
                        endDate: undefined,
                        current: true,
                    },
                ],
            };

            const mockCreatedCandidate = {
                id: '123e4567-e89b-12d3-a456-426614174000',
                ...candidateData,
                educations: candidateData.educations.map((e, idx) => ({ ...e, id: `edu-${idx}` })),
                workExperiences: candidateData.workExperiences.map((w, idx) => ({ ...w, id: `work-${idx}` })),
                cvDocument: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockPrisma.candidate.create.mockResolvedValue(mockCreatedCandidate);

            const result = await CandidateService.create(candidateData);

            expect(mockPrisma.candidate.create).toHaveBeenCalledWith({
                data: {
                    firstName: candidateData.firstName,
                    lastName: candidateData.lastName,
                    email: candidateData.email,
                    phone: candidateData.phone,
                    address: candidateData.address,
                    educations: {
                        create: candidateData.educations,
                    },
                    workExperiences: {
                        create: candidateData.workExperiences,
                    },
                },
                include: {
                    educations: true,
                    workExperiences: true,
                    cvDocument: true,
                },
            });
            expect(result).toEqual(mockCreatedCandidate);
        });

        it('should create a candidate without educations and work experiences', async () =>
        {
            const candidateData = {
                firstName: 'Jane',
                lastName: 'Smith',
                email: 'jane.smith@example.com',
                phone: '+9876543210',
                address: '456 Oak Ave',
            };

            const mockCreatedCandidate = {
                id: '223e4567-e89b-12d3-a456-426614174001',
                ...candidateData,
                educations: [],
                workExperiences: [],
                cvDocument: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockPrisma.candidate.create.mockResolvedValue(mockCreatedCandidate);

            const result = await CandidateService.create(candidateData);

            expect(mockPrisma.candidate.create).toHaveBeenCalledWith({
                data: {
                    firstName: candidateData.firstName,
                    lastName: candidateData.lastName,
                    email: candidateData.email,
                    phone: candidateData.phone,
                    address: candidateData.address,
                },
                include: {
                    educations: true,
                    workExperiences: true,
                    cvDocument: true,
                },
            });
            expect(result).toEqual(mockCreatedCandidate);
        });
    });

    describe('findById', () =>
    {
        it('should return a candidate with all relations', async () =>
        {
            const candidateId = '123e4567-e89b-12d3-a456-426614174000';
            const mockCandidate = {
                id: candidateId,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john.doe@example.com',
                phone: '+1234567890',
                address: '123 Main St',
                educations: [
                    {
                        id: 'edu-1',
                        institution: 'MIT',
                        degree: 'Bachelor',
                        fieldOfStudy: 'Computer Science',
                        startDate: '2015-09-01',
                        endDate: '2019-06-01',
                        current: false,
                    },
                ],
                workExperiences: [
                    {
                        id: 'work-1',
                        company: 'Tech Corp',
                        position: 'Software Engineer',
                        description: 'Developed web applications',
                        startDate: '2019-07-01',
                        endDate: null,
                        current: true,
                    },
                ],
                cvDocument: {
                    id: 'cv-1',
                    filename: 'john_doe_cv.pdf',
                    filePath: 'uploads/cv/123e4567-e89b-12d3-a456-426614174000/cv.pdf',
                    fileSize: 102400,
                    mimeType: 'application/pdf',
                },
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockPrisma.candidate.findUnique.mockResolvedValue(mockCandidate);

            const result = await CandidateService.findById(candidateId);

            expect(mockPrisma.candidate.findUnique).toHaveBeenCalledWith({
                where: { id: candidateId },
                include: {
                    educations: {
                        orderBy: { startDate: 'desc' }
                    },
                    workExperiences: {
                        orderBy: { startDate: 'desc' }
                    },
                    cvDocument: true,
                },
            });
            expect(result).toEqual(mockCandidate);
        });

        it('should return null if candidate not found', async () =>
        {
            const candidateId = 'nonexistent-id';
            mockPrisma.candidate.findUnique.mockResolvedValue(null);

            const result = await CandidateService.findById(candidateId);

            expect(result).toBeNull();
        });
    });

    describe('findAll', () =>
    {
        it('should return paginated candidates', async () =>
        {
            const mockCandidates = [
                {
                    id: '123e4567-e89b-12d3-a456-426614174000',
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john.doe@example.com',
                    phone: '+1234567890',
                    address: '123 Main St',
                    educations: [],
                    workExperiences: [],
                    cvDocument: null,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    id: '223e4567-e89b-12d3-a456-426614174001',
                    firstName: 'Jane',
                    lastName: 'Smith',
                    email: 'jane.smith@example.com',
                    phone: '+9876543210',
                    address: '456 Oak Ave',
                    educations: [],
                    workExperiences: [],
                    cvDocument: null,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ];

            mockPrisma.candidate.findMany.mockResolvedValue(mockCandidates);
            mockPrisma.candidate.count.mockResolvedValue(2);

            const result = await CandidateService.findAll(1, 10);

            expect(mockPrisma.candidate.findMany).toHaveBeenCalledWith({
                skip: 0,
                take: 10,
                orderBy: {
                    createdAt: 'desc',
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    phone: true,
                    address: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
            expect(mockPrisma.candidate.count).toHaveBeenCalled();
            expect(result).toEqual({
                candidates: mockCandidates,
                total: 2,
            });
        });

        it('should handle page 2 correctly', async () =>
        {
            mockPrisma.candidate.findMany.mockResolvedValue([]);
            mockPrisma.candidate.count.mockResolvedValue(15);

            const result = await CandidateService.findAll(2, 10);

            expect(mockPrisma.candidate.findMany).toHaveBeenCalledWith({
                skip: 10,
                take: 10,
                orderBy: {
                    createdAt: 'desc',
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    phone: true,
                    address: true,
                    createdAt: true,
                    updatedAt: true,
                },
            });
        });
    });

    describe('uploadCV', () =>
    {
        it('should create CV document for candidate', async () =>
        {
            const candidateId = '123e4567-e89b-12d3-a456-426614174000';
            const mockFile = {
                filename: 'cv-uuid.pdf',
                originalname: 'john_doe_cv.pdf',
                mimetype: 'application/pdf',
                size: 102400,
                path: 'uploads\\cv\\123e4567-e89b-12d3-a456-426614174000\\cv-uuid.pdf',
            } as Express.Multer.File;

            const mockCVDocument = {
                id: 'cv-1',
                candidateId,
                filename: mockFile.filename,
                originalName: mockFile.originalname,
                mimeType: mockFile.mimetype,
                sizeBytes: mockFile.size,
                storagePath: 'uploads/cv/123e4567-e89b-12d3-a456-426614174000/cv-uuid.pdf',
                uploadedAt: new Date(),
            };

            mockPrisma.cVDocument.create.mockResolvedValue(mockCVDocument);

            const result = await CandidateService.uploadCV(candidateId, mockFile);

            expect(mockPrisma.cVDocument.create).toHaveBeenCalledWith({
                data: {
                    candidateId,
                    filename: mockFile.filename,
                    originalName: mockFile.originalname,
                    mimeType: mockFile.mimetype,
                    sizeBytes: mockFile.size,
                    storagePath: 'uploads/cv/123e4567-e89b-12d3-a456-426614174000/cv-uuid.pdf',
                },
            });
            expect(result).toEqual(mockCVDocument);
        });
    });
});
