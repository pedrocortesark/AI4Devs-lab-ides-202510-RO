# GET /api/candidates/:candidateId

**Purpose**: Retrieve detailed information about a specific candidate, including education, work experience, and CV metadata.

---

## Request

**Method**: `GET`  
**Endpoint**: `/api/candidates/:candidateId`  
**Content-Type**: N/A (no request body)  
**Authentication**: None (future: Bearer token)

### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `candidateId` | string (UUID) | ✅ Yes | The unique identifier of the candidate |

### Headers
```
Accept: application/json
```

### Example Request (cURL)

```bash
curl -X GET http://localhost:3010/api/candidates/a3f2e1d0-8c7b-4f5e-9d3a-1b2c3d4e5f6a
```

### Example Request (JavaScript)

```javascript
const response = await fetch(
  `http://localhost:3010/api/candidates/${candidateId}`,
  { method: 'GET' }
);

const candidate = await response.json();
```

---

## Response

### Success Response (200 OK)

**Status**: `200 OK`  
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
  cvDocument?: {              // null if no CV uploaded
    id: string;               // UUID
    candidateId: string;      // UUID
    filename: string;
    originalName: string;
    mimeType: string;
    sizeBytes: number;
    uploadedAt: string;       // ISO 8601
  };
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
  "cvDocument": {
    "id": "d4e5f6a7-9c8b-4a5d-8e7f-4b5c6d7e8f9a",
    "candidateId": "a3f2e1d0-8c7b-4f5e-9d3a-1b2c3d4e5f6a",
    "filename": "cv-1731519234567-a3f2e1d0.pdf",
    "originalName": "maria-gonzalez-cv.pdf",
    "mimeType": "application/pdf",
    "sizeBytes": 245678,
    "uploadedAt": "2025-11-13T10:35:00.000Z"
  },
  "createdAt": "2025-11-13T10:30:00.000Z",
  "updatedAt": "2025-11-13T10:30:00.000Z"
}
```

---

### Error Responses

#### 404 Not Found

**Status**: `404 Not Found`  
**Cause**: Candidate with provided `candidateId` does not exist

```json
{
  "error": {
    "code": "CANDIDATE_NOT_FOUND",
    "message": "Candidato no encontrado",
    "timestamp": "2025-11-13T10:40:00.000Z"
  }
}
```

#### 500 Internal Server Error

**Status**: `500 Internal Server Error`  
**Cause**: Database error or unexpected server failure

```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Error interno del servidor. Por favor intenta de nuevo más tarde.",
    "timestamp": "2025-11-13T10:40:00.000Z"
  }
}
```

---

## Business Rules

1. **Candidate Not Found**: If the candidate does not exist, return `404 Not Found`.

2. **Include Related Entities**: Response always includes `educations`, `workExperiences`, and `cvDocument` (even if empty arrays or null).

3. **CV Document**: If no CV has been uploaded, `cvDocument` is `null`.

4. **Data Completeness**: All non-nullable fields are always present; optional fields may be `null`.

---

## Frontend Implementation Notes

**React Example with SWR (data fetching)**:

```typescript
import useSWR from 'swr';
import { Candidate } from './types/candidate';

const fetcher = (url: string) => fetch(url).then(r => r.json());

const CandidateDetail = ({ candidateId }: { candidateId: string }) => {
  const { data, error, isLoading } = useSWR<Candidate>(
    `http://localhost:3010/api/candidates/${candidateId}`,
    fetcher
  );

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error al cargar candidato</div>;
  if (!data) return <div>Candidato no encontrado</div>;

  return (
    <div>
      <h1>{data.firstName} {data.lastName}</h1>
      <p>Email: {data.email}</p>
      <p>Teléfono: {data.phone || 'No especificado'}</p>
      
      <h2>Educación</h2>
      {data.educations.length === 0 ? (
        <p>Sin información de educación</p>
      ) : (
        data.educations.map(edu => (
          <div key={edu.id}>
            <h3>{edu.degree} - {edu.institution}</h3>
            <p>{edu.fieldOfStudy}</p>
            <p>{new Date(edu.startDate).toLocaleDateString()} - 
               {edu.current ? 'Actual' : new Date(edu.endDate!).toLocaleDateString()}</p>
          </div>
        ))
      )}
      
      <h2>Experiencia Laboral</h2>
      {data.workExperiences.length === 0 ? (
        <p>Sin información de experiencia</p>
      ) : (
        data.workExperiences.map(exp => (
          <div key={exp.id}>
            <h3>{exp.position} - {exp.company}</h3>
            <p>{exp.description}</p>
            <p>{new Date(exp.startDate).toLocaleDateString()} - 
               {exp.current ? 'Actual' : new Date(exp.endDate!).toLocaleDateString()}</p>
          </div>
        ))
      )}
      
      <h2>CV</h2>
      {data.cvDocument ? (
        <a href={`/api/candidates/${candidateId}/cv/download`} download>
          Descargar {data.cvDocument.originalName} ({(data.cvDocument.sizeBytes / 1024).toFixed(0)} KB)
        </a>
      ) : (
        <p>No se ha subido ningún CV</p>
      )}
    </div>
  );
};
```

---

## Backend Implementation Notes

**Express Route Handler** (with Prisma):

```typescript
import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

router.get('/candidates/:candidateId', async (req: Request, res: Response) => {
  try {
    const { candidateId } = req.params;

    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
      include: {
        educations: {
          orderBy: { startDate: 'desc' }
        },
        workExperiences: {
          orderBy: { startDate: 'desc' }
        },
        cvDocument: true
      }
    });

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
```

---

## Testing Scenarios

### Unit Tests (Backend)
- ✅ Return candidate with all fields populated
- ✅ Return candidate with no education
- ✅ Return candidate with no work experience
- ✅ Return candidate with no CV
- ✅ Return 404 for non-existent candidate
- ✅ Include all related entities in response
- ✅ Sort educations by startDate (descending)
- ✅ Sort work experiences by startDate (descending)

### Integration Tests (Frontend)
- ✅ Display candidate details correctly
- ✅ Display "No education" message if empty
- ✅ Display "No work experience" message if empty
- ✅ Display "No CV" message if null
- ✅ Handle 404 error gracefully
- ✅ Handle server errors gracefully
- ✅ Format dates correctly (locale-specific)
