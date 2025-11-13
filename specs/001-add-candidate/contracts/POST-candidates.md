# POST /api/candidates

**Purpose**: Create a new candidate with basic information, optional education history, and optional work experience.

---

## Request

**Method**: `POST`  
**Endpoint**: `/api/candidates`  
**Content-Type**: `application/json`  
**Authentication**: None (future: Bearer token)

### Headers
```
Content-Type: application/json
Accept: application/json
```

### Body Schema

```typescript
{
  firstName: string;          // Required, max 100 chars
  lastName: string;           // Required, max 100 chars
  email: string;              // Required, max 255 chars, valid email format, must be unique
  phone?: string;             // Optional, max 50 chars
  address?: string;           // Optional, max 500 chars
  educations?: Array<{        // Optional array
    institution: string;      // Required, max 255 chars
    degree: string;           // Required, max 255 chars
    fieldOfStudy?: string;    // Optional, max 255 chars
    startDate: string;        // Required, ISO 8601 format
    endDate?: string;         // Optional, ISO 8601 format
    current: boolean;         // Required, default false
  }>;
  workExperiences?: Array<{   // Optional array
    company: string;          // Required, max 255 chars
    position: string;         // Required, max 255 chars
    description?: string;     // Optional, unlimited length
    startDate: string;        // Required, ISO 8601 format
    endDate?: string;         // Optional, ISO 8601 format
    current: boolean;         // Required, default false
  }>;
}
```

### Example Request

```json
{
  "firstName": "María",
  "lastName": "González López",
  "email": "maria.gonzalez@example.com",
  "phone": "+34 612 345 678",
  "address": "Calle Mayor 15, 28013 Madrid, España",
  "educations": [
    {
      "institution": "Universidad Complutense de Madrid",
      "degree": "Grado en Ingeniería Informática",
      "fieldOfStudy": "Desarrollo de Software",
      "startDate": "2015-09-01T00:00:00Z",
      "endDate": "2019-06-30T00:00:00Z",
      "current": false
    }
  ],
  "workExperiences": [
    {
      "company": "Tech Startup SL",
      "position": "Desarrolladora Full Stack",
      "description": "Desarrollo de aplicaciones web con React y Node.js",
      "startDate": "2021-07-01T00:00:00Z",
      "current": true
    }
  ]
}
```

---

## Response

### Success Response (201 Created)

**Status**: `201 Created`  
**Content-Type**: `application/json`

#### Body Schema

```typescript
{
  id: string;                 // UUID
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  educations: Array<{
    id: string;               // UUID
    candidateId: string;      // UUID
    institution: string;
    degree: string;
    fieldOfStudy?: string;
    startDate: string;        // ISO 8601
    endDate?: string;         // ISO 8601
    current: boolean;
    createdAt: string;        // ISO 8601
  }>;
  workExperiences: Array<{
    id: string;               // UUID
    candidateId: string;      // UUID
    company: string;
    position: string;
    description?: string;
    startDate: string;        // ISO 8601
    endDate?: string;         // ISO 8601
    current: boolean;
    createdAt: string;        // ISO 8601
  }>;
  cvDocument?: null;          // Always null on creation (CV uploaded separately)
  createdAt: string;          // ISO 8601
  updatedAt: string;          // ISO 8601
}
```

#### Example Response

```json
{
  "id": "a3f2e1d0-8c7b-4f5e-9d3a-1b2c3d4e5f6a",
  "firstName": "María",
  "lastName": "González López",
  "email": "maria.gonzalez@example.com",
  "phone": "+34 612 345 678",
  "address": "Calle Mayor 15, 28013 Madrid, España",
  "educations": [
    {
      "id": "b7c8f2e1-9d3a-4b5c-8e7f-2a3b4c5d6e7f",
      "candidateId": "a3f2e1d0-8c7b-4f5e-9d3a-1b2c3d4e5f6a",
      "institution": "Universidad Complutense de Madrid",
      "degree": "Grado en Ingeniería Informática",
      "fieldOfStudy": "Desarrollo de Software",
      "startDate": "2015-09-01T00:00:00.000Z",
      "endDate": "2019-06-30T00:00:00.000Z",
      "current": false,
      "createdAt": "2025-11-13T10:30:00.000Z"
    }
  ],
  "workExperiences": [
    {
      "id": "c9d3a4b2-8e7f-4c5d-9a3b-3c4d5e6f7a8b",
      "candidateId": "a3f2e1d0-8c7b-4f5e-9d3a-1b2c3d4e5f6a",
      "company": "Tech Startup SL",
      "position": "Desarrolladora Full Stack",
      "description": "Desarrollo de aplicaciones web con React y Node.js",
      "startDate": "2021-07-01T00:00:00.000Z",
      "endDate": null,
      "current": true,
      "createdAt": "2025-11-13T10:30:00.000Z"
    }
  ],
  "cvDocument": null,
  "createdAt": "2025-11-13T10:30:00.000Z",
  "updatedAt": "2025-11-13T10:30:00.000Z"
}
```

---

### Error Responses

#### 400 Bad Request (Validation Error)

**Status**: `400 Bad Request`  
**Cause**: Missing required fields, invalid formats, or constraint violations

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Errores de validación en los datos enviados",
    "details": [
      {
        "field": "email",
        "message": "Formato de email inválido"
      },
      {
        "field": "educations[0].startDate",
        "message": "Fecha de inicio debe ser una fecha válida en formato ISO 8601"
      }
    ],
    "timestamp": "2025-11-13T10:30:00.000Z"
  }
}
```

#### 409 Conflict (Duplicate Email)

**Status**: `409 Conflict`  
**Cause**: Email already exists in the system

```json
{
  "error": {
    "code": "EMAIL_DUPLICATE",
    "message": "El email ya está registrado en el sistema",
    "timestamp": "2025-11-13T10:30:00.000Z"
  }
}
```

#### 500 Internal Server Error

**Status**: `500 Internal Server Error`  
**Cause**: Database error, file system error, or unexpected server failure

```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Error interno del servidor. Por favor intenta de nuevo más tarde.",
    "timestamp": "2025-11-13T10:30:00.000Z"
  }
}
```

---

## Business Rules

1. **Email Uniqueness**: The `email` field must be unique across all candidates. Attempting to create a candidate with an existing email returns `409 Conflict`.

2. **Optional Sections**: Both `educations` and `workExperiences` arrays are optional. A candidate can be created with only basic information.

3. **Date Consistency**: If `current = true` for education or work experience, `endDate` must be `null`.

4. **Transaction Safety**: If any related entity (education, work experience) fails validation or insertion, the entire candidate creation is rolled back (no partial data saved).

5. **CV Upload**: CV documents are uploaded separately via `POST /api/candidates/:candidateId/cv` after candidate creation.

---

## Security Considerations

- **Input Sanitization**: All string inputs are sanitized to prevent XSS attacks.
- **SQL Injection**: Prevented by using Prisma ORM (parameterized queries).
- **Rate Limiting**: (Future requirement) Endpoint should be rate-limited to prevent abuse.
- **CORS**: Endpoint must be protected by CORS configuration (frontend domain only).

---

## Frontend Implementation Notes

**React Hook Form Example**:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCandidateSchema } from './types/candidate';

const { handleSubmit, control } = useForm({
  resolver: zodResolver(createCandidateSchema),
});

const onSubmit = async (data: CreateCandidateRequest) => {
  try {
    const response = await fetch('http://localhost:3010/api/candidates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.status === 409) {
      setError('email', { 
        type: 'manual', 
        message: 'Este email ya está registrado' 
      });
      return;
    }

    if (!response.ok) {
      throw new Error('Failed to create candidate');
    }

    const candidate = await response.json();
    navigate(`/candidates/${candidate.id}`);
  } catch (error) {
    console.error('Error creating candidate:', error);
    toast.error('Error al guardar candidato');
  }
};
```

---

## Testing Scenarios

### Unit Tests (Backend)
- ✅ Valid candidate with all fields
- ✅ Valid candidate with only required fields
- ✅ Valid candidate with educations array
- ✅ Valid candidate with work experiences array
- ✅ Duplicate email rejection
- ✅ Invalid email format rejection
- ✅ Missing required field rejection
- ✅ Field length validation (e.g., firstName > 100 chars)
- ✅ Transaction rollback on partial failure

### Integration Tests (Frontend)
- ✅ Form submission with valid data
- ✅ Form validation on required fields
- ✅ Email format validation
- ✅ Duplicate email error handling
- ✅ Server error handling
- ✅ Success navigation to candidate detail page
