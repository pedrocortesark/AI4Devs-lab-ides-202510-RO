import express, { Application } from 'express';
import cors from 'cors';
import { errorHandler } from '@shared/infrastructure/http/middlewares/errorHandler';
import { notFoundHandler } from '@shared/infrastructure/http/middlewares/notFoundHandler';
import { corsConfig } from '@shared/infrastructure/http/middlewares/corsConfig';
import { healthRoutes } from '@shared/interfaces/http/routes/healthRoutes';
import { candidateRoutes } from '@modules/candidates/routes/candidateRoutes';
import { lookupRoutes } from '@modules/lookups/routes/lookupRoutes';

export const app: Application = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsConfig));

// Routes
app.use('/health', healthRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/lookups', lookupRoutes);

// Error handlers (must be last)
app.use(notFoundHandler);
app.use(errorHandler);
