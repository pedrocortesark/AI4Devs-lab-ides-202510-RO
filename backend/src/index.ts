import { Request, Response, NextFunction } from 'express';
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import candidateRoutes from './routes/candidateRoutes';

dotenv.config();
const prisma = new PrismaClient();

export const app = express();
export default prisma;

const port = 3010;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) =>
{
  res.send('Hola LTI!');
});

app.use('/api/candidates', candidateRoutes);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) =>
{
  console.error(err.stack);
  res.type('text/plain');
  res.status(500).send('Something broke!');
});

app.listen(port, () =>
{
  console.log(`Server is running at http://localhost:${port}`);
});
