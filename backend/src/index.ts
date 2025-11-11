import dotenv from 'dotenv';
import { app } from './app';
import { logger } from '@shared/infrastructure/logger/logger';
import { prisma } from '@shared/infrastructure/database/prismaClient';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3010;

// Graceful shutdown
const gracefulShutdown = async (signal: string) =>
{
  logger.info(`${signal} received, closing server gracefully...`);

  await prisma.$disconnect();
  logger.info('Database connection closed');

  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Start server
const server = app.listen(PORT, () =>
{
  logger.info(`🚀 LTI Backend running on http://localhost:${PORT}`);
  logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) =>
{
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  server.close(() =>
  {
    process.exit(1);
  });
});

export default server;
