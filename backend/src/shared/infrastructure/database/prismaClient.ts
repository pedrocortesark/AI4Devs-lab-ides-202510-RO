import { PrismaClient } from '@prisma/client';
import { logger } from '../logger/logger';

const prismaClientSingleton = () =>
{
    return new PrismaClient({
        log: [
            { emit: 'event', level: 'query' },
            { emit: 'event', level: 'error' },
            { emit: 'event', level: 'warn' },
        ],
    });
};

declare global
{
    // eslint-disable-next-line no-var
    var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

// Log database queries in development
if (process.env.NODE_ENV === 'development')
{
    prisma.$on('query', (e) =>
    {
        logger.debug(`Query: ${e.query}`);
        logger.debug(`Duration: ${e.duration}ms`);
    });
}

prisma.$on('error', (e) =>
{
    logger.error(`Database error: ${e.message}`);
});

prisma.$on('warn', (e) =>
{
    logger.warn(`Database warning: ${e.message}`);
});

if (process.env.NODE_ENV !== 'production')
{
    globalThis.prismaGlobal = prisma;
}

export default prisma;
