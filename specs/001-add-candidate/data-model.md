# Data Model: Add Candidate to ATS

**Feature**: 001-add-candidate | **Phase**: 1 - Data Model | **Date**: 2025-11-13  
**Input**: Research findings from [research.md](./research.md)

---

## Prisma Schema

```prisma
// backend/prisma/schema.prisma

model Candidate {
  id               String   @id @default(uuid())
  firstName        String   @db.VarChar(100)
  lastName         String   @db.VarChar(100)
  email            String   @unique @db.VarChar(255)
  phone            String?  @db.VarChar(50)
  address          String?  @db.VarChar(500)
  
  // Relations
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

---

## Entity Relationships

```
┌─────────────┐
│  Candidate  │
│  (Main)     │
│             │
│ PK: id      │
│ UK: email   │
└──────┬──────┘
       │
       ├─────────────┬─────────────┬─────────────┐
       │             │             │             │
       │ 1:N         │ 1:N         │ 1:1         │
       ▼             ▼             ▼             │
┌─────────────┐ ┌──────────────┐ ┌─────────────┐
│  Education  │ │WorkExperience│ │ CVDocument  │
│             │ │              │ │             │
│ FK:         │ │ FK:          │ │ FK:         │
│ candidateId │ │ candidateId  │ │ candidateId │
└─────────────┘ └──────────────┘ └─────────────┘
```

**Key Constraints**:
- `Candidate.email` → Unique constraint (prevents duplicate candidates)
- `CVDocument.candidateId` → Unique constraint (one CV per candidate)
- All FKs → `onDelete: Cascade` (deleting candidate removes all related data)
- All indexes on foreign keys for query performance

---

## TypeScript Types (Shared)

```typescript
// frontend/src/types/candidate.ts & backend/src/types/candidate.ts

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  educations: Education[];
  workExperiences: WorkExperience[];
  cvDocument?: CVDocument;
  createdAt: string;  // ISO 8601
  updatedAt: string;  // ISO 8601
}

export interface Education {
  id: string;
  candidateId: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;  // ISO 8601
  endDate?: string;   // ISO 8601
  current: boolean;
  createdAt: string;
}

export interface WorkExperience {
  id: string;
  candidateId: string;
  company: string;
  position: string;
  description?: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  createdAt: string;
}

export interface CVDocument {
  id: string;
  candidateId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  storagePath: string;
  uploadedAt: string;
}

// Request DTOs
export interface CreateCandidateRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  educations?: Omit<Education, 'id' | 'candidateId' | 'createdAt'>[];
  workExperiences?: Omit<WorkExperience, 'id' | 'candidateId' | 'createdAt'>[];
}

export interface UploadCVRequest {
  // Multipart form data - handled by Multer
  cv: File;  // Frontend only
}

// Response DTOs
export type CreateCandidateResponse = Candidate;
export type UploadCVResponse = CVDocument;
export type GetCandidateResponse = Candidate;

export interface ListCandidatesResponse {
  candidates: Candidate[];
  total: number;
}

// Validation schemas (Zod - backend)
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
```

---

## Database Migration

**File**: `backend/prisma/migrations/20251113_add_candidate_management/migration.sql`

```sql
-- CreateTable
CREATE TABLE "candidates" (
    "id" TEXT NOT NULL,
    "firstName" VARCHAR(100) NOT NULL,
    "lastName" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(50),
    "address" VARCHAR(500),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "candidates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "education" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "institution" VARCHAR(255) NOT NULL,
    "degree" VARCHAR(255) NOT NULL,
    "fieldOfStudy" VARCHAR(255),
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "current" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "work_experience" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "company" VARCHAR(255) NOT NULL,
    "position" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "current" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_documents" (
    "id" TEXT NOT NULL,
    "candidateId" TEXT NOT NULL,
    "filename" VARCHAR(255) NOT NULL,
    "originalName" VARCHAR(255) NOT NULL,
    "mimeType" VARCHAR(100) NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "storagePath" VARCHAR(500) NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cv_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "candidates_email_key" ON "candidates"("email");

-- CreateIndex
CREATE INDEX "candidates_email_idx" ON "candidates"("email");

-- CreateIndex
CREATE INDEX "education_candidateId_idx" ON "education"("candidateId");

-- CreateIndex
CREATE INDEX "work_experience_candidateId_idx" ON "work_experience"("candidateId");

-- CreateIndex
CREATE UNIQUE INDEX "cv_documents_candidateId_key" ON "cv_documents"("candidateId");

-- CreateIndex
CREATE INDEX "cv_documents_candidateId_idx" ON "cv_documents"("candidateId");

-- AddForeignKey
ALTER TABLE "education" ADD CONSTRAINT "education_candidateId_fkey" 
    FOREIGN KEY ("candidateId") REFERENCES "candidates"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "work_experience" ADD CONSTRAINT "work_experience_candidateId_fkey" 
    FOREIGN KEY ("candidateId") REFERENCES "candidates"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cv_documents" ADD CONSTRAINT "cv_documents_candidateId_fkey" 
    FOREIGN KEY ("candidateId") REFERENCES "candidates"("id") 
    ON DELETE CASCADE ON UPDATE CASCADE;
```

---

## File Storage Structure

```
backend/uploads/cv/
├── {candidate-uuid-1}/
│   └── cv-1731519234567-a3f2e1d0.pdf
├── {candidate-uuid-2}/
│   └── cv-1731519456789-b7c8f2e1.docx
└── {candidate-uuid-3}/
    └── cv-1731519678901-c9d3a4b2.pdf
```

**Pattern**: `uploads/cv/{candidateId}/{generated-filename}`

**Filename Generation**:
- Prefix: `cv-`
- Timestamp: `Date.now()`
- UUID suffix: `uuidv4()`
- Extension: Original file extension preserved

**Storage Path Stored in DB**:
```typescript
storagePath: `uploads/cv/${candidateId}/${generatedFilename}`
```

---

## Data Validation Rules

| Field | Type | Required | Max Length | Validation |
|-------|------|----------|------------|------------|
| `Candidate.firstName` | string | ✅ Yes | 100 | Non-empty |
| `Candidate.lastName` | string | ✅ Yes | 100 | Non-empty |
| `Candidate.email` | string | ✅ Yes | 255 | Valid email format, unique |
| `Candidate.phone` | string | ❌ No | 50 | - |
| `Candidate.address` | string | ❌ No | 500 | - |
| `Education.institution` | string | ✅ Yes | 255 | Non-empty |
| `Education.degree` | string | ✅ Yes | 255 | Non-empty |
| `Education.startDate` | DateTime | ✅ Yes | - | Valid ISO 8601 |
| `WorkExperience.company` | string | ✅ Yes | 255 | Non-empty |
| `WorkExperience.position` | string | ✅ Yes | 255 | Non-empty |
| `WorkExperience.startDate` | DateTime | ✅ Yes | - | Valid ISO 8601 |
| `CVDocument.file` | File | ❌ No | 10MB | MIME: pdf/doc/docx |

**Business Rules**:
- If `Education.current = true`, `endDate` must be null
- If `WorkExperience.current = true`, `endDate` must be null
- `startDate` must be before `endDate` (if provided)
- CV upload is optional during candidate creation
- Only one CV per candidate (enforced by unique constraint on `CVDocument.candidateId`)

---

## Sample Data (for testing)

```typescript
// Seed data for development/testing
const sampleCandidate = {
  firstName: 'María',
  lastName: 'González López',
  email: 'maria.gonzalez@example.com',
  phone: '+34 612 345 678',
  address: 'Calle Mayor 15, 28013 Madrid, España',
  educations: [
    {
      institution: 'Universidad Complutense de Madrid',
      degree: 'Grado en Ingeniería Informática',
      fieldOfStudy: 'Desarrollo de Software',
      startDate: '2015-09-01T00:00:00Z',
      endDate: '2019-06-30T00:00:00Z',
      current: false,
    },
    {
      institution: 'Universidad Politécnica de Madrid',
      degree: 'Máster en Inteligencia Artificial',
      fieldOfStudy: 'Machine Learning',
      startDate: '2019-09-01T00:00:00Z',
      endDate: '2021-06-30T00:00:00Z',
      current: false,
    }
  ],
  workExperiences: [
    {
      company: 'Tech Startup SL',
      position: 'Desarrolladora Full Stack',
      description: 'Desarrollo de aplicaciones web con React y Node.js',
      startDate: '2021-07-01T00:00:00Z',
      endDate: '2023-12-31T00:00:00Z',
      current: false,
    },
    {
      company: 'Innovation Labs',
      position: 'Senior Software Engineer',
      description: 'Liderazgo técnico en proyectos de IA',
      startDate: '2024-01-01T00:00:00Z',
      endDate: null,
      current: true,
    }
  ]
};
```

---

**Phase 1 - Data Model Complete** ✅  
Next: API Contracts & Quickstart
