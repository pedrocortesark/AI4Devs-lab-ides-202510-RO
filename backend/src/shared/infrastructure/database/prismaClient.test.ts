import { prisma } from './prismaClient';

describe('Prisma Client', () =>
{
    afterAll(async () =>
    {
        await prisma.$disconnect();
    });

    it('should connect to database successfully', async () =>
    {
        await expect(prisma.$connect()).resolves.not.toThrow();
    });

    it('should execute raw query', async () =>
    {
        const result = await prisma.$queryRaw`SELECT 1 as value`;
        expect(result).toBeDefined();
        expect(Array.isArray(result)).toBe(true);
    });
});
