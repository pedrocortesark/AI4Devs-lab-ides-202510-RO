import { Router } from 'express';
import { HealthController } from '../controllers/healthController';

export const healthRoutes = Router();
const healthController = new HealthController();

healthRoutes.get('/', (req, res) => healthController.check(req, res));
