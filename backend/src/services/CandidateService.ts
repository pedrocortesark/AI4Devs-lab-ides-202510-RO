import { PrismaClient } from '@prisma/client';
import { CreateCandidateRequest } from '../types/candidate';

const prisma = new PrismaClient();

export class CandidateService
{
    /**
     * Create a new candidate with optional education and work experience
     */
    static async create(data: CreateCandidateRequest)
    {
        return await prisma.candidate.create({
            data: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone,
                address: data.address,
                educations: data.educations ? {
                    create: data.educations
                } : undefined,
                workExperiences: data.workExperiences ? {
                    create: data.workExperiences
                } : undefined
            },
            include: {
                educations: true,
                workExperiences: true,
                cvDocument: true
            }
        });
    }

    /**
     * Find candidate by ID with all relations
     */
    static async findById(id: string)
    {
        return await prisma.candidate.findUnique({
            where: { id },
            include: {
                educations: {
                    orderBy: { startDate: 'desc' }
                },
                workExperiences: {
                    orderBy: { startDate: 'desc' }
                },
                cvDocument: true
            }
        });
    }

    /**
     * Find all candidates (summary view without relations)
     */
    static async findAll(page: number = 1, limit: number = 10)
    {
        const skip = (page - 1) * limit;

        const [candidates, total] = await Promise.all([
            prisma.candidate.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    phone: true,
                    address: true,
                    createdAt: true,
                    updatedAt: true
                }
            }),
            prisma.candidate.count()
        ]);

        return {
            candidates,
            total
        };
    }

    /**
     * Upload CV document for a candidate
     */
    static async uploadCV(candidateId: string, file: Express.Multer.File)
    {
        return await prisma.cVDocument.create({
            data: {
                candidateId,
                filename: file.filename,
                originalName: file.originalname,
                mimeType: file.mimetype,
                sizeBytes: file.size,
                storagePath: file.path.replace(/\\/g, '/')
            }
        });
    }
}
