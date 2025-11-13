# Research Document: Add Candidate to ATS

**Feature**: 001-add-candidate | **Phase**: 0 - Research | **Date**: 2025-11-13

## Purpose

This document resolves technical unknowns identified during plan initialization. All findings inform Phase 1 design decisions.

---

## 1. Prisma Schema Patterns for Related Entities

**Question**: What's the optimal Prisma schema pattern for Candidate with one-to-many relations (Education, WorkExperience) and one-to-one CV document?

**Findings**:
```prisma
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
}
```

**Key Decisions**:
- `@default(uuid())` for all primary keys (aligns with Constitution IV)
- `onDelete: Cascade` ensures orphaned records cleaned automatically
- `@unique` on `Candidate.email` enforces database-level constraint (FR-002)
- `@@map()` for snake_case table names (PostgreSQL convention)
- `updatedAt` on Candidate only (audit trail for main entity)
- Nullable `endDate` + `current` boolean for ongoing education/work

---

## 2. React Form Library Choice

**Question**: Should we use a form library (React Hook Form, Formik) or vanilla React state for the multi-section candidate form?

**Evaluation**:

| Aspect | React Hook Form | Formik | Vanilla State |
|--------|----------------|--------|---------------|
| Bundle size | 9KB | 15KB | 0KB |
| Learning curve | Low | Medium | None |
| Validation | Built-in + Yup/Zod | Requires Yup | Manual |
| TypeScript support | Excellent | Good | Manual |
| Multi-section forms | `useFieldArray` | `FieldArray` | Manual arrays |
| Constitution alignment | ✅ Type-safe | ✅ Type-safe | ⚠️ Need custom types |

**Decision**: **React Hook Form** with Zod validation
- Minimal bundle impact (9KB)
- `useFieldArray` perfectly suits Education/WorkExperience arrays
- Zod provides TypeScript-first schema validation (aligns with Constitution I)
- Industry standard (7M+ weekly downloads)

**Implementation Pattern**:
```typescript
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const candidateSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email().max(255),
  phone: z.string().max(50).optional(),
  address: z.string().max(500).optional(),
  educations: z.array(educationSchema).optional(),
  workExperiences: z.array(workExperienceSchema).optional(),
});

const { control, handleSubmit } = useForm({
  resolver: zodResolver(candidateSchema),
});

const { fields: educationFields, append: addEducation } = useFieldArray({
  control,
  name: 'educations',
});
```

---

## 3. File Upload Implementation Strategy

**Question**: How should we handle CV file uploads securely with validation?

**Backend Strategy**:
- Library: `multer` (26M+ weekly downloads, Express standard)
- Storage: `multer.diskStorage` with custom filename function
- Validation chain:
  1. Multer file filter (whitelist: .pdf, .doc, .docx)
  2. File size limit (10MB - `limits.fileSize`)
  3. Virus scan placeholder (future: ClamAV integration)
  4. UUID-based path generation

**Code Pattern**:
```typescript
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const candidateId = req.params.candidateId; // or generate UUID here
    const uploadPath = path.join(__dirname, '../uploads/cv', candidateId);
    // Ensure directory exists (use fs.promises.mkdir with recursive: true)
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + uuidv4();
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimes = ['application/pdf', 'application/msword', 
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, DOCX allowed.'));
  }
};

export const uploadCV = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});
```

**Frontend Strategy**:
- HTML5 file input with `accept=".pdf,.doc,.docx"`
- Client-side size check before upload
- Progress indicator (optional: axios with `onUploadProgress`)
- Two-step API flow: 1) POST candidate, 2) POST /:id/cv

---

## 4. Apple-Inspired UI Design System

**Question**: What are the specific design tokens (colors, typography, spacing) for Apple-style interface with orange branding?

**Color Palette**:
```css
/* Primary (Orange Brand) */
--color-primary-50:  #FFF3E0;
--color-primary-100: #FFE0B2;
--color-primary-500: #FF9800;  /* Main brand color */
--color-primary-600: #FB8C00;  /* Hover state */
--color-primary-700: #F57C00;  /* Active state */

/* Neutrals (Apple-style grays) */
--color-neutral-50:  #FAFAFA;
--color-neutral-100: #F5F5F5;
--color-neutral-200: #E5E5E5;
--color-neutral-400: #A3A3A3;
--color-neutral-700: #404040;
--color-neutral-900: #171717;

/* Semantic Colors */
--color-success: #10B981;
--color-error:   #EF4444;
--color-warning: #F59E0B;
```

**Typography**:
```css
/* System font stack (Apple devices use SF Pro automatically) */
--font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;

/* Type scale */
--text-xs:   0.75rem;  /* 12px */
--text-sm:   0.875rem; /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg:   1.125rem; /* 18px */
--text-xl:   1.25rem;  /* 20px */
--text-2xl:  1.5rem;   /* 24px */

/* Weights */
--font-normal:  400;
--font-medium:  500;
--font-semibold: 600;
```

**Spacing System** (8px base unit):
```css
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
```

**Component Patterns**:
- Border radius: `6px` (subtle roundness)
- Input height: `44px` (iOS touch target guideline)
- Shadow: `box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1)`
- Focus ring: `outline: 2px solid var(--color-primary-500); outline-offset: 2px`
- Button padding: `12px 24px`

**Disclosure Pattern** (for progressive sections):
```jsx
<details open>
  <summary className="cursor-pointer font-medium text-lg">
    Información Básica
  </summary>
  <div className="mt-4 space-y-4">
    {/* Form fields */}
  </div>
</details>
```

---

## 5. API Endpoint Design

**Question**: What's the RESTful endpoint structure for candidate creation with file upload?

**Endpoint Design**:

### POST /api/candidates
**Purpose**: Create candidate with basic info + optional education/work experience  
**Request Body** (Content-Type: application/json):
```typescript
interface CreateCandidateRequest {
  firstName: string;      // max 100 chars
  lastName: string;       // max 100 chars
  email: string;          // max 255 chars, unique
  phone?: string;         // max 50 chars
  address?: string;       // max 500 chars
  educations?: Array<{
    institution: string;
    degree: string;
    fieldOfStudy?: string;
    startDate: string;    // ISO 8601
    endDate?: string;     // ISO 8601
    current: boolean;
  }>;
  workExperiences?: Array<{
    company: string;
    position: string;
    description?: string;
    startDate: string;
    endDate?: string;
    current: boolean;
  }>;
}
```

**Response** (201 Created):
```typescript
interface CreateCandidateResponse {
  id: string;             // UUID
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  educations: Education[];
  workExperiences: WorkExperience[];
  cvDocument?: CVDocumentSummary;
  createdAt: string;
  updatedAt: string;
}
```

**Error Responses**:
- `400 Bad Request`: Validation errors (missing required fields, format errors)
- `409 Conflict`: Email already exists
- `500 Internal Server Error`: Database/server errors

---

### POST /api/candidates/:candidateId/cv
**Purpose**: Upload CV document for existing candidate  
**Request** (Content-Type: multipart/form-data):
```
cv: <file>  // Field name: 'cv', max 10MB, types: .pdf/.doc/.docx
```

**Response** (200 OK):
```typescript
interface UploadCVResponse {
  id: string;
  candidateId: string;
  filename: string;
  originalName: string;
  mimeType: string;
  sizeBytes: number;
  uploadedAt: string;
}
```

**Error Responses**:
- `400 Bad Request`: Invalid file type or size
- `404 Not Found`: Candidate not found
- `500 Internal Server Error`: File system errors

---

### GET /api/candidates/:candidateId
**Purpose**: Retrieve candidate details including CV metadata  
**Response** (200 OK): Same as CreateCandidateResponse

---

### GET /api/candidates
**Purpose**: List all candidates (future: pagination/filtering)  
**Response** (200 OK):
```typescript
interface ListCandidatesResponse {
  candidates: CandidateSummary[];
  total: number;
}
```

---

## 6. Error Handling Strategy

**Question**: How should frontend and backend coordinate error messages for user-friendly feedback?

**Backend Error Format** (standardized):
```typescript
interface APIError {
  error: {
    code: string;          // Machine-readable: "EMAIL_DUPLICATE", "FILE_TOO_LARGE"
    message: string;       // Human-readable: "El email ya existe en el sistema"
    details?: any;         // Optional validation errors from Zod
    timestamp: string;
  }
}
```

**Frontend Error Handling**:
```typescript
try {
  const response = await candidateService.create(data);
} catch (error) {
  if (error.response?.status === 409) {
    setError('email', { 
      type: 'manual', 
      message: 'Este email ya está registrado' 
    });
  } else if (error.response?.status === 400) {
    // Display validation errors from backend
    const backendErrors = error.response.data.error.details;
    // Map to form fields
  } else {
    toast.error('Error al guardar candidato. Por favor intenta de nuevo.');
  }
}
```

**Retry Strategy** (from spec clarification Q4):
- User-triggered retry only (no automatic retries)
- Show clear error message with "Reintentar" button
- Backend implements idempotency for POST /candidates (check email before insert)

---

## 7. Testing Strategy

**Question**: What test scenarios cover the critical paths per Constitution VII?

**Backend Integration Tests** (Jest + Supertest):
```typescript
describe('POST /api/candidates', () => {
  it('should create candidate with valid data', async () => {
    const response = await request(app)
      .post('/api/candidates')
      .send(validCandidateData)
      .expect(201);
    
    expect(response.body.id).toBeDefined();
    expect(response.body.email).toBe(validCandidateData.email);
  });

  it('should reject duplicate email', async () => {
    await createCandidate({ email: 'test@example.com' });
    
    const response = await request(app)
      .post('/api/candidates')
      .send({ email: 'test@example.com', ... })
      .expect(409);
    
    expect(response.body.error.code).toBe('EMAIL_DUPLICATE');
  });

  it('should rollback transaction on partial failure', async () => {
    // Mock Prisma to fail on CVDocument creation after Candidate succeeds
    const candidatesBefore = await prisma.candidate.count();
    
    await request(app)
      .post('/api/candidates')
      .send(dataWithInvalidCV)
      .expect(500);
    
    const candidatesAfter = await prisma.candidate.count();
    expect(candidatesAfter).toBe(candidatesBefore); // Transaction rolled back
  });
});

describe('POST /api/candidates/:id/cv', () => {
  it('should upload valid PDF', async () => { /* ... */ });
  it('should reject file > 10MB', async () => { /* ... */ });
  it('should reject invalid file type', async () => { /* ... */ });
});
```

**Frontend Component Tests** (React Testing Library):
```typescript
describe('CandidateForm', () => {
  it('should show validation errors for required fields', async () => {
    render(<CandidateForm />);
    
    fireEvent.click(screen.getByText('Guardar'));
    
    expect(await screen.findByText(/nombre es obligatorio/i)).toBeInTheDocument();
  });

  it('should allow adding multiple education entries', async () => {
    render(<CandidateForm />);
    
    fireEvent.click(screen.getByText('Agregar Educación'));
    fireEvent.click(screen.getByText('Agregar Educación'));
    
    const institutionInputs = screen.getAllByLabelText(/institución/i);
    expect(institutionInputs).toHaveLength(2);
  });

  it('should handle duplicate email error from API', async () => {
    mockAPI.post.mockRejectedValue({ 
      response: { status: 409, data: { error: { code: 'EMAIL_DUPLICATE' } } } 
    });
    
    render(<CandidateForm />);
    // Fill form and submit
    
    expect(await screen.findByText(/email ya está registrado/i)).toBeInTheDocument();
  });
});
```

---

## 8. Database Migration Strategy

**Question**: Should candidate creation be a single migration or split by entity?

**Decision**: **Single migration** for all related entities

**Rationale**:
- All four models (Candidate, Education, WorkExperience, CVDocument) are co-dependent
- Foreign key constraints require Candidate table exists first
- Atomic deployment prevents partial schema states
- Rollback is cleaner (single down migration)

**Migration Name**: `20251113_add_candidate_management.sql`

**Migration Order**:
1. Create `candidates` table
2. Create `education` table (FK to candidates)
3. Create `work_experience` table (FK to candidates)
4. Create `cv_documents` table (FK to candidates)
5. Create indexes on `candidates.email` (unique), `education.candidateId`, `work_experience.candidateId`

---

## Summary of Technical Decisions

| Topic | Decision | Rationale |
|-------|----------|-----------|
| **Schema Pattern** | Cascade deletes, UUID PKs, snake_case tables | Aligns with Constitution IV, prevents orphans |
| **Form Library** | React Hook Form + Zod | Type-safe, minimal bundle, `useFieldArray` support |
| **File Upload** | Multer with diskStorage | Express standard, aligns with Constitution IV file strategy |
| **Design System** | Orange primary (#FF9800), system fonts, 8px spacing | Apple-inspired minimalism per user requirement |
| **API Structure** | POST /candidates + POST /:id/cv (two-step) | Allows candidate creation without CV, clear REST semantics |
| **Error Format** | Standardized JSON with code/message/details | Enables frontend error mapping, i18n-friendly |
| **Testing Approach** | Integration tests for API, unit tests for components | Covers Constitution VII critical paths |
| **Migration Strategy** | Single migration for all entities | Atomic deployment, cleaner rollback |

---

**Phase 0 Complete** ✅  
All technical unknowns resolved. Proceed to **Phase 1**: Data Model, API Contracts, Quickstart.
