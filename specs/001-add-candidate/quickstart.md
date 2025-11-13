# Quickstart Guide: Add Candidate to ATS

**Feature**: 001-add-candidate | **Date**: 2025-11-13  
**Target Audience**: Developers implementing this feature

This guide provides step-by-step instructions to implement the "Add Candidate" feature from scratch.

---

## Prerequisites

- ✅ Node.js 18+ and npm installed
- ✅ Docker and Docker Compose installed (for PostgreSQL)
- ✅ Git repository cloned
- ✅ Branch `001-add-candidate` checked out

**Verify environment**:
```bash
node --version  # Should be 18.x or higher
npm --version
docker --version
git branch      # Should show * 001-add-candidate
```

---

## Phase 1: Database Setup (30 minutes)

### 1.1 Update Prisma Schema

**File**: `backend/prisma/schema.prisma`

Add the following models at the end of the file:

```prisma
model Candidate {
  id               String   @id @default(uuid())
  firstName        String   @db.VarChar(100)
  lastName         String   @db.VarChar(100)
  email            String   @unique @db.VarChar(255)
  phone            String?  @db.VarChar(50)
  address          String?  @db.VarChar(500)
  
  educations       Education[]
  workExperiences  WorkExperience[]
  cvDocument       CVDocument?
  
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
  
  @@map("candidates")
  @@index([email])
}

model Education {
  id           String    @id @default(uuid())
  candidateId  String
  candidate    Candidate @relation(fields: [candidateId], references: [id], onDelete: Cascade)
  
  institution  String    @db.VarChar(255)
  degree       String    @db.VarChar(255)
  fieldOfStudy String?   @db.VarChar(255)
  startDate    DateTime
  endDate      DateTime?
  current      Boolean   @default(false)
  
  createdAt    DateTime  @default(now())
  
  @@map("education")
  @@index([candidateId])
}

model WorkExperience {
  id          String    @id @default(uuid())
  candidateId String
  candidate   Candidate @relation(fields: [candidateId], references: [id], onDelete: Cascade)
  
  company     String    @db.VarChar(255)
  position    String    @db.VarChar(255)
  description String?   @db.Text
  startDate   DateTime
  endDate     DateTime?
  current     Boolean   @default(false)
  
  createdAt   DateTime  @default(now())
  
  @@map("work_experience")
  @@index([candidateId])
}

model CVDocument {
  id           String    @id @default(uuid())
  candidateId  String    @unique
  candidate    Candidate @relation(fields: [candidateId], references: [id], onDelete: Cascade)
  
  filename     String    @db.VarChar(255)
  originalName String    @db.VarChar(255)
  mimeType     String    @db.VarChar(100)
  sizeBytes    Int
  storagePath  String    @db.VarChar(500)
  uploadedAt   DateTime  @default(now())
  
  @@map("cv_documents")
  @@index([candidateId])
}
```

### 1.2 Create Migration

```bash
cd backend
npx prisma migrate dev --name add_candidate_management
```

**Expected output**:
```
✔ Generated Prisma Client
✔ The migration has been applied successfully
```

### 1.3 Verify Database

```bash
npx prisma studio
```

Open http://localhost:5555 and verify:
- `candidates` table exists
- `education` table exists
- `work_experience` table exists
- `cv_documents` table exists

---

## Phase 2: Backend Implementation (2-3 hours)

### 2.1 Install Dependencies

```bash
cd backend
npm install multer @types/multer zod
```

### 2.2 Create TypeScript Types

**File**: `backend/src/types/candidate.ts`

```typescript
import { z } from 'zod';

export const educationSchema = z.object({
  institution: z.string().min(1).max(255),
  degree: z.string().min(1).max(255),
  fieldOfStudy: z.string().max(255).optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  current: z.boolean().default(false),
});

export const workExperienceSchema = z.object({
  company: z.string().min(1).max(255),
  position: z.string().min(1).max(255),
  description: z.string().optional(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  current: z.boolean().default(false),
});

export const createCandidateSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Invalid email format').max(255),
  phone: z.string().max(50).optional(),
  address: z.string().max(500).optional(),
  educations: z.array(educationSchema).optional(),
  workExperiences: z.array(workExperienceSchema).optional(),
});

export type CreateCandidateRequest = z.infer<typeof createCandidateSchema>;
```

### 2.3 Create File Upload Middleware

**File**: `backend/src/middleware/uploadCV.ts`

```typescript
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const candidateId = req.params.candidateId;
    const uploadPath = path.join(__dirname, '../../uploads/cv', candidateId);
    
    await fs.mkdir(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const uuid = uuidv4();
    const ext = path.extname(file.originalname);
    cb(null, `cv-${timestamp}-${uuid}${ext}`);
  }
});

const fileFilter = (
  req: any, 
  file: Express.Multer.File, 
  cb: multer.FileFilterCallback
) => {
  const allowedMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('INVALID_FILE_TYPE'));
  }
};

export const uploadCV = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});
```

### 2.4 Create Candidate Service

**File**: `backend/src/services/CandidateService.ts`

```typescript
import { PrismaClient } from '@prisma/client';
import { CreateCandidateRequest } from '../types/candidate';

const prisma = new PrismaClient();

export class CandidateService {
  static async create(data: CreateCandidateRequest) {
    return await prisma.candidate.create({
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        educations: {
          create: data.educations || []
        },
        workExperiences: {
          create: data.workExperiences || []
        }
      },
      include: {
        educations: true,
        workExperiences: true,
        cvDocument: true
      }
    });
  }

  static async findById(id: string) {
    return await prisma.candidate.findUnique({
      where: { id },
      include: {
        educations: { orderBy: { startDate: 'desc' } },
        workExperiences: { orderBy: { startDate: 'desc' } },
        cvDocument: true
      }
    });
  }

  static async findAll() {
    const candidates = await prisma.candidate.findMany({
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
    });
    return { candidates, total: candidates.length };
  }

  static async uploadCV(candidateId: string, file: Express.Multer.File) {
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
```

### 2.5 Create API Routes

**File**: `backend/src/api/candidateRoutes.ts`

```typescript
import { Router, Request, Response } from 'express';
import { CandidateService } from '../services/CandidateService';
import { createCandidateSchema } from '../types/candidate';
import { uploadCV } from '../middleware/uploadCV';
import fs from 'fs/promises';

const router = Router();

// POST /api/candidates
router.post('/', async (req: Request, res: Response) => {
  try {
    const validatedData = createCandidateSchema.parse(req.body);
    const candidate = await CandidateService.create(validatedData);
    res.status(201).json(candidate);
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Errores de validación en los datos enviados',
          details: error.errors,
          timestamp: new Date().toISOString()
        }
      });
    }
    
    if (error.code === 'P2002') { // Prisma unique constraint violation
      return res.status(409).json({
        error: {
          code: 'EMAIL_DUPLICATE',
          message: 'El email ya está registrado en el sistema',
          timestamp: new Date().toISOString()
        }
      });
    }
    
    console.error('Error creating candidate:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error interno del servidor',
        timestamp: new Date().toISOString()
      }
    });
  }
});

// GET /api/candidates/:candidateId
router.get('/:candidateId', async (req: Request, res: Response) => {
  try {
    const { candidateId } = req.params;
    const candidate = await CandidateService.findById(candidateId);
    
    if (!candidate) {
      return res.status(404).json({
        error: {
          code: 'CANDIDATE_NOT_FOUND',
          message: 'Candidato no encontrado',
          timestamp: new Date().toISOString()
        }
      });
    }
    
    res.status(200).json(candidate);
  } catch (error) {
    console.error('Error fetching candidate:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error interno del servidor',
        timestamp: new Date().toISOString()
      }
    });
  }
});

// GET /api/candidates
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await CandidateService.findAll();
    res.status(200).json(result);
  } catch (error) {
    console.error('Error listing candidates:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error interno del servidor',
        timestamp: new Date().toISOString()
      }
    });
  }
});

// POST /api/candidates/:candidateId/cv
router.post('/:candidateId/cv', uploadCV.single('cv'), async (req: Request, res: Response) => {
  try {
    const { candidateId } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        error: {
          code: 'NO_FILE_PROVIDED',
          message: 'No se proporcionó ningún archivo',
          timestamp: new Date().toISOString()
        }
      });
    }

    const candidate = await CandidateService.findById(candidateId);
    if (!candidate) {
      await fs.unlink(file.path); // Clean up uploaded file
      return res.status(404).json({
        error: {
          code: 'CANDIDATE_NOT_FOUND',
          message: 'Candidato no encontrado',
          timestamp: new Date().toISOString()
        }
      });
    }

    if (candidate.cvDocument) {
      await fs.unlink(file.path); // Clean up uploaded file
      return res.status(409).json({
        error: {
          code: 'CV_ALREADY_EXISTS',
          message: 'El candidato ya tiene un CV',
          timestamp: new Date().toISOString()
        }
      });
    }

    const cvDocument = await CandidateService.uploadCV(candidateId, file);
    res.status(200).json(cvDocument);
  } catch (error: any) {
    if (error.message === 'INVALID_FILE_TYPE') {
      return res.status(400).json({
        error: {
          code: 'INVALID_FILE_TYPE',
          message: 'Tipo de archivo inválido. Solo se permiten PDF, DOC y DOCX',
          timestamp: new Date().toISOString()
        }
      });
    }
    
    console.error('Error uploading CV:', error);
    res.status(500).json({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Error al guardar el archivo',
        timestamp: new Date().toISOString()
      }
    });
  }
});

export default router;
```

### 2.6 Register Routes in Express App

**File**: `backend/src/index.ts`

```typescript
import express from 'express';
import cors from 'cors';
import candidateRoutes from './api/candidateRoutes';

const app = express();

app.use(cors());
app.use(express.json());

// Register routes
app.use('/api/candidates', candidateRoutes);

const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
```

### 2.7 Test Backend

```bash
cd backend
npm run dev
```

Test endpoints with cURL:

```bash
# Create candidate
curl -X POST http://localhost:3010/api/candidates \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "María",
    "lastName": "González",
    "email": "maria.gonzalez@example.com",
    "phone": "+34 612 345 678"
  }'

# List candidates
curl http://localhost:3010/api/candidates

# Get candidate by ID
curl http://localhost:3010/api/candidates/{CANDIDATE_ID}
```

---

## Phase 3: Frontend Implementation (3-4 hours)

### 3.1 Install Dependencies

```bash
cd frontend
npm install react-hook-form @hookform/resolvers zod
```

### 3.2 Create TypeScript Types

**File**: `frontend/src/types/candidate.ts`

(Copy the same file from `backend/src/types/candidate.ts`, excluding backend-specific Zod schemas if preferred)

### 3.3 Create API Service

**File**: `frontend/src/services/candidateService.ts`

```typescript
import { CreateCandidateRequest } from '../types/candidate';

const API_BASE = 'http://localhost:3010/api';

export const candidateService = {
  async create(data: CreateCandidateRequest) {
    const response = await fetch(`${API_BASE}/candidates`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to create candidate');
    return await response.json();
  },

  async getById(id: string) {
    const response = await fetch(`${API_BASE}/candidates/${id}`);
    if (!response.ok) throw new Error('Failed to fetch candidate');
    return await response.json();
  },

  async getAll() {
    const response = await fetch(`${API_BASE}/candidates`);
    if (!response.ok) throw new Error('Failed to fetch candidates');
    return await response.json();
  },

  async uploadCV(candidateId: string, file: File) {
    const formData = new FormData();
    formData.append('cv', file);

    const response = await fetch(`${API_BASE}/candidates/${candidateId}/cv`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to upload CV');
    return await response.json();
  }
};
```

### 3.4 Create Candidate Form Component

**File**: `frontend/src/components/CandidateForm.tsx`

```typescript
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCandidateSchema, CreateCandidateRequest } from '../types/candidate';
import { candidateService } from '../services/candidateService';

export const CandidateForm = () => {
  const { register, control, handleSubmit, formState: { errors } } = useForm<CreateCandidateRequest>({
    resolver: zodResolver(createCandidateSchema),
  });

  const { fields: educationFields, append: addEducation, remove: removeEducation } = useFieldArray({
    control,
    name: 'educations',
  });

  const { fields: workFields, append: addWork, remove: removeWork } = useFieldArray({
    control,
    name: 'workExperiences',
  });

  const onSubmit = async (data: CreateCandidateRequest) => {
    try {
      const candidate = await candidateService.create(data);
      alert(`Candidato creado: ${candidate.id}`);
      // Navigate to candidate detail or reset form
    } catch (error) {
      alert('Error al crear candidato');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Añadir Candidato</h1>

      <details open>
        <summary className="cursor-pointer font-medium text-lg mb-4">Información Básica</summary>
        <div className="space-y-4">
          <div>
            <label>Nombre *</label>
            <input {...register('firstName')} className="w-full border p-2" />
            {errors.firstName && <p className="text-red-500">{errors.firstName.message}</p>}
          </div>

          <div>
            <label>Apellidos *</label>
            <input {...register('lastName')} className="w-full border p-2" />
            {errors.lastName && <p className="text-red-500">{errors.lastName.message}</p>}
          </div>

          <div>
            <label>Email *</label>
            <input {...register('email')} type="email" className="w-full border p-2" />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label>Teléfono</label>
            <input {...register('phone')} className="w-full border p-2" />
          </div>

          <div>
            <label>Dirección</label>
            <input {...register('address')} className="w-full border p-2" />
          </div>
        </div>
      </details>

      <details className="mt-6">
        <summary className="cursor-pointer font-medium text-lg mb-4">Educación</summary>
        {educationFields.map((field, index) => (
          <div key={field.id} className="border p-4 mb-4">
            <input {...register(`educations.${index}.institution`)} placeholder="Institución" className="w-full border p-2 mb-2" />
            <input {...register(`educations.${index}.degree`)} placeholder="Título" className="w-full border p-2 mb-2" />
            <button type="button" onClick={() => removeEducation(index)}>Eliminar</button>
          </div>
        ))}
        <button type="button" onClick={() => addEducation({ institution: '', degree: '', current: false, startDate: '' })}>
          Agregar Educación
        </button>
      </details>

      <button type="submit" className="mt-6 bg-orange-500 text-white px-6 py-2 rounded">
        Guardar Candidato
      </button>
    </form>
  );
};
```

### 3.5 Add Styling (Apple-inspired)

**File**: `frontend/src/App.css`

```css
:root {
  --color-primary: #FF9800;
  --color-neutral-50: #FAFAFA;
  --font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}

body {
  font-family: var(--font-family);
  background-color: var(--color-neutral-50);
}

input, textarea {
  border-radius: 6px;
  height: 44px;
  border: 1px solid #E5E5E5;
  padding: 0 12px;
}

button {
  border-radius: 6px;
  padding: 12px 24px;
  font-weight: 500;
  cursor: pointer;
}

button[type="submit"] {
  background-color: var(--color-primary);
  color: white;
  border: none;
}

button[type="submit"]:hover {
  background-color: #FB8C00;
}
```

### 3.6 Test Frontend

```bash
cd frontend
npm start
```

Navigate to http://localhost:3000 and test the form.

---

## Phase 4: Integration Testing (1 hour)

### 4.1 Backend Tests

**File**: `backend/src/tests/candidateRoutes.test.ts`

```typescript
import request from 'supertest';
import app from '../index';

describe('POST /api/candidates', () => {
  it('should create a candidate', async () => {
    const response = await request(app)
      .post('/api/candidates')
      .send({
        firstName: 'Test',
        lastName: 'User',
        email: `test${Date.now()}@example.com`,
      })
      .expect(201);

    expect(response.body.id).toBeDefined();
  });

  it('should reject duplicate email', async () => {
    const email = `duplicate${Date.now()}@example.com`;
    
    await request(app)
      .post('/api/candidates')
      .send({ firstName: 'Test', lastName: 'User', email });

    await request(app)
      .post('/api/candidates')
      .send({ firstName: 'Test2', lastName: 'User2', email })
      .expect(409);
  });
});
```

Run tests:
```bash
cd backend
npm test
```

---

## Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker ps

# Restart database
docker-compose down
docker-compose up -d
```

### File Upload Errors
```bash
# Ensure uploads directory exists
mkdir -p backend/uploads/cv
```

### CORS Errors
Ensure `cors()` middleware is configured in `backend/src/index.ts`.

---

## Completion Checklist

- ✅ Database schema updated and migrated
- ✅ Backend API endpoints implemented (POST, GET, GET/:id, POST/:id/cv)
- ✅ Frontend form with React Hook Form
- ✅ File upload working
- ✅ Email uniqueness validation
- ✅ Error handling (400, 404, 409, 500)
- ✅ Tests passing
- ✅ Code committed to `001-add-candidate` branch

---

**Next Steps**: Proceed to Phase 2 (Tasks breakdown) using `/speckit.tasks` command.
