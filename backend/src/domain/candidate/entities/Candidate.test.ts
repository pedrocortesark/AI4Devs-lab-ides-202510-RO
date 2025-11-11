import { prisma } from '@shared/infrastructure/database/prismaClient';
import { CandidateDocument } from '@prisma/client';

describe('Candidate Domain - Database Integration', () =>
{
    // Clean up test data after each test
    afterEach(async () =>
    {
        await prisma.candidateDocument.deleteMany();
        await prisma.candidateExperience.deleteMany();
        await prisma.candidateEducation.deleteMany();
        await prisma.candidate.deleteMany();
    });

    afterAll(async () =>
    {
        await prisma.$disconnect();
    });

    describe('Candidate model', () =>
    {
        it('should create a candidate with required fields', async () =>
        {
            const candidate = await prisma.candidate.create({
                data: {
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john.doe@example.com' // Will be normalized to lowercase in app layer
                }
            });

            expect(candidate.id).toBeDefined();
            expect(candidate.firstName).toBe('John');
            expect(candidate.lastName).toBe('Doe');
            expect(candidate.email).toBe('john.doe@example.com');
            expect(candidate.isDeleted).toBe(false);
            expect(candidate.createdAt).toBeInstanceOf(Date);
        });

        it('should create a candidate with full address details', async () =>
        {
            const candidate = await prisma.candidate.create({
                data: {
                    firstName: 'Jane',
                    lastName: 'Smith',
                    email: 'jane.smith@example.com',
                    phone: '+1234567890',
                    addressLine1: '123 Main St',
                    addressLine2: 'Apt 4B',
                    city: 'New York',
                    state: 'NY',
                    postalCode: '10001',
                    country: 'USA'
                }
            });

            expect(candidate.phone).toBe('+1234567890');
            expect(candidate.addressLine1).toBe('123 Main St');
            expect(candidate.city).toBe('New York');
            expect(candidate.country).toBe('USA');
        });

        it('should enforce unique email constraint', async () =>
        {
            await prisma.candidate.create({
                data: {
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'duplicate@example.com'
                }
            });

            await expect(
                prisma.candidate.create({
                    data: {
                        firstName: 'Jane',
                        lastName: 'Doe',
                        email: 'duplicate@example.com' // Same email
                    }
                })
            ).rejects.toThrow(); // Prisma will throw unique constraint violation
        });

        it('should support soft delete with isDeleted flag', async () =>
        {
            const candidate = await prisma.candidate.create({
                data: {
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'softdelete@example.com'
                }
            });

            const updated = await prisma.candidate.update({
                where: { id: candidate.id },
                data: { isDeleted: true }
            });

            expect(updated.isDeleted).toBe(true);
        });
    });

    describe('CandidateEducation model', () =>
    {
        it('should create education entry for a candidate', async () =>
        {
            const candidate = await prisma.candidate.create({
                data: {
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john.education@example.com'
                }
            });

            const education = await prisma.candidateEducation.create({
                data: {
                    candidateId: candidate.id,
                    institution: 'MIT',
                    degree: 'Bachelor of Science',
                    fieldOfStudy: 'Computer Science',
                    startYear: 2015,
                    endYear: 2019
                }
            });

            expect(education.id).toBeDefined();
            expect(education.institution).toBe('MIT');
            expect(education.degree).toBe('Bachelor of Science');
            expect(education.candidateId).toBe(candidate.id);
        });

        it('should cascade delete education when candidate is deleted', async () =>
        {
            const candidate = await prisma.candidate.create({
                data: {
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'cascade.education@example.com',
                    education: {
                        create: {
                            institution: 'Stanford',
                            degree: 'Master',
                            fieldOfStudy: 'AI'
                        }
                    }
                }
            });

            await prisma.candidate.delete({
                where: { id: candidate.id }
            });

            const educationCount = await prisma.candidateEducation.count({
                where: { candidateId: candidate.id }
            });

            expect(educationCount).toBe(0);
        });
    });

    describe('CandidateExperience model', () =>
    {
        it('should create experience entry for a candidate', async () =>
        {
            const candidate = await prisma.candidate.create({
                data: {
                    firstName: 'Jane',
                    lastName: 'Smith',
                    email: 'jane.experience@example.com'
                }
            });

            const experience = await prisma.candidateExperience.create({
                data: {
                    candidateId: candidate.id,
                    company: 'Google',
                    title: 'Software Engineer',
                    description: 'Developed scalable systems',
                    startDate: new Date('2020-01-01'),
                    endDate: new Date('2022-12-31')
                }
            });

            expect(experience.id).toBeDefined();
            expect(experience.company).toBe('Google');
            expect(experience.title).toBe('Software Engineer');
            expect(experience.candidateId).toBe(candidate.id);
        });

        it('should cascade delete experience when candidate is deleted', async () =>
        {
            const candidate = await prisma.candidate.create({
                data: {
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'cascade.experience@example.com',
                    experience: {
                        create: {
                            company: 'Microsoft',
                            title: 'Senior Developer'
                        }
                    }
                }
            });

            await prisma.candidate.delete({
                where: { id: candidate.id }
            });

            const experienceCount = await prisma.candidateExperience.count({
                where: { candidateId: candidate.id }
            });

            expect(experienceCount).toBe(0);
        });
    });

    describe('CandidateDocument model', () =>
    {
        it('should create CV document for a candidate', async () =>
        {
            const candidate = await prisma.candidate.create({
                data: {
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john.documents@example.com'
                }
            });

            const document = await prisma.candidateDocument.create({
                data: {
                    candidateId: candidate.id,
                    documentKind: 'CV',
                    filePath: `./uploads/cv/${candidate.id}/abc-123.pdf`,
                    fileName: 'john_doe_cv.pdf',
                    fileSize: 1048576, // 1MB
                    mimeType: 'application/pdf'
                }
            });

            expect(document.id).toBeDefined();
            expect(document.documentKind).toBe('CV');
            expect(document.fileName).toBe('john_doe_cv.pdf');
            expect(document.mimeType).toBe('application/pdf');
        });

        it('should support multiple document types', async () =>
        {
            const candidate = await prisma.candidate.create({
                data: {
                    firstName: 'Jane',
                    lastName: 'Smith',
                    email: 'jane.multidocs@example.com',
                    documents: {
                        create: [
                            {
                                documentKind: 'CV',
                                filePath: './uploads/cv/jane/cv.pdf',
                                fileName: 'cv.pdf',
                                fileSize: 500000,
                                mimeType: 'application/pdf'
                            },
                            {
                                documentKind: 'COVER_LETTER',
                                filePath: './uploads/cv/jane/cover.pdf',
                                fileName: 'cover_letter.pdf',
                                fileSize: 200000,
                                mimeType: 'application/pdf'
                            },
                            {
                                documentKind: 'PORTFOLIO',
                                filePath: './uploads/cv/jane/portfolio.pdf',
                                fileName: 'portfolio.pdf',
                                fileSize: 3000000,
                                mimeType: 'application/pdf'
                            }
                        ]
                    }
                },
                include: { documents: true }
            });

            expect(candidate.documents.length).toBe(3);
            expect(candidate.documents.map((d: CandidateDocument) => d.documentKind).sort()).toEqual(['COVER_LETTER', 'CV', 'PORTFOLIO']);
        });

        it('should cascade delete documents when candidate is deleted', async () =>
        {
            const candidate = await prisma.candidate.create({
                data: {
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'cascade.documents@example.com',
                    documents: {
                        create: {
                            documentKind: 'CV',
                            filePath: './uploads/cv/test.pdf',
                            fileName: 'test.pdf',
                            fileSize: 100000,
                            mimeType: 'application/pdf'
                        }
                    }
                }
            });

            await prisma.candidate.delete({
                where: { id: candidate.id }
            });

            const documentCount = await prisma.candidateDocument.count({
                where: { candidateId: candidate.id }
            });

            expect(documentCount).toBe(0);
        });
    });

    describe('Full candidate creation with relations', () =>
    {
        it('should create candidate with education, experience, and documents in one transaction', async () =>
        {
            const candidate = await prisma.candidate.create({
                data: {
                    firstName: 'Alice',
                    lastName: 'Johnson',
                    email: 'alice.full@example.com',
                    phone: '+1987654321',
                    city: 'San Francisco',
                    country: 'USA',
                    education: {
                        create: [
                            {
                                institution: 'UC Berkeley',
                                degree: 'Bachelor',
                                fieldOfStudy: 'Engineering',
                                startYear: 2010,
                                endYear: 2014
                            }
                        ]
                    },
                    experience: {
                        create: [
                            {
                                company: 'Tesla',
                                title: 'Engineer',
                                startDate: new Date('2014-06-01')
                            }
                        ]
                    },
                    documents: {
                        create: [
                            {
                                documentKind: 'CV',
                                filePath: './uploads/cv/alice/cv.pdf',
                                fileName: 'alice_cv.pdf',
                                fileSize: 800000,
                                mimeType: 'application/pdf'
                            }
                        ]
                    }
                },
                include: {
                    education: true,
                    experience: true,
                    documents: true
                }
            });

            expect(candidate.id).toBeDefined();
            expect(candidate.education.length).toBe(1);
            expect(candidate.experience.length).toBe(1);
            expect(candidate.documents.length).toBe(1);
            expect(candidate.education[0].institution).toBe('UC Berkeley');
            expect(candidate.experience[0].company).toBe('Tesla');
            expect(candidate.documents[0].documentKind).toBe('CV');
        });
    });
});
