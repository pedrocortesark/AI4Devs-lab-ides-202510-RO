import express, { Application } from 'express';
import cors from 'cors';
import { errorHandler } from '@shared/infrastructure/http/middlewares/errorHandler';
import { notFoundHandler } from '@shared/infrastructure/http/middlewares/notFoundHandler';
import { corsConfig } from '@shared/infrastructure/http/middlewares/corsConfig';
import { healthRoutes } from '@shared/interfaces/http/routes/healthRoutes';

export const app: Application = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsConfig));

// Routes
app.use('/health', healthRoutes);

// Error handlers (must be last)
app.use(notFoundHandler);
app.use(errorHandler);
