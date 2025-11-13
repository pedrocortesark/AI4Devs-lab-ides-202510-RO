# GET /api/candidates

**Purpose**: List all candidates in the system with basic information (future: support pagination and filtering).

---

## Request

**Method**: `GET`  
**Endpoint**: `/api/candidates`  
**Content-Type**: N/A (no request body)  
**Authentication**: None (future: Bearer token)

### Query Parameters (Future)

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | ❌ No | 1 | Page number for pagination |
| `limit` | number | ❌ No | 20 | Results per page (max 100) |
| `search` | string | ❌ No | - | Search by name or email |
| `orderBy` | string | ❌ No | createdAt | Field to sort by (createdAt, lastName, email) |
| `order` | string | ❌ No | desc | Sort direction (asc, desc) |

**Note**: Query parameters are **not implemented** in initial version (MVP). All candidates are returned without pagination.

### Headers
```
Accept: application/json
```

### Example Request (cURL)

```bash
curl -X GET http://localhost:3010/api/candidates
```

### Example Request (JavaScript)

```javascript
const response = await fetch('http://localhost:3010/api/candidates');
const data = await response.json();
```

---

## Response

### Success Response (200 OK)

**Status**: `200 OK`  
**Content-Type**: `application/json`

#### Body Schema

```typescript
{
  candidates: Array<{
    id: string;               // UUID
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    address?: string;
    // Note: educations, workExperiences, and cvDocument are NOT included in list view
    // Use GET /api/candidates/:candidateId to retrieve full details
    createdAt: string;        // ISO 8601
    updatedAt: string;        // ISO 8601
  }>;
  total: number;              // Total number of candidates
}
```

#### Example Response

```json
{
  "candidates": [
    {
      "id": "a3f2e1d0-8c7b-4f5e-9d3a-1b2c3d4e5f6a",
      "firstName": "María",
      "lastName": "González López",
      "email": "maria.gonzalez@example.com",
      "phone": "+34 612 345 678",
      "address": "Calle Mayor 15, 28013 Madrid, España",
      "createdAt": "2025-11-13T10:30:00.000Z",
      "updatedAt": "2025-11-13T10:30:00.000Z"
    },
    {
      "id": "b4c5d6e7-9d8a-4f5e-8c7b-2a3b4c5d6e7f",
      "firstName": "Carlos",
      "lastName": "Rodríguez Pérez",
      "email": "carlos.rodriguez@example.com",
      "phone": "+34 623 456 789",
      "address": null,
      "createdAt": "2025-11-12T14:20:00.000Z",
      "updatedAt": "2025-11-12T14:20:00.000Z"
    }
  ],
  "total": 2
}
```

---

### Error Responses

#### 500 Internal Server Error

**Status**: `500 Internal Server Error`  
**Cause**: Database error or unexpected server failure

```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Error interno del servidor. Por favor intenta de nuevo más tarde.",
    "timestamp": "2025-11-13T10:45:00.000Z"
  }
}
```

---

## Business Rules

1. **No Pagination (MVP)**: Initial version returns all candidates without pagination. This is acceptable for small datasets (<1000 candidates).

2. **Summary View**: Response includes only basic candidate information. Related entities (education, work experience, CV) are excluded to reduce payload size.

3. **Empty Result**: If no candidates exist, return `{ candidates: [], total: 0 }`.

4. **Default Sorting**: Candidates are sorted by `createdAt` in descending order (newest first).

5. **Future Enhancement**: Pagination, filtering, and search will be added when dataset grows beyond 100 candidates.

---

## Frontend Implementation Notes

**React Example with Candidate List**:

```typescript
import { useEffect, useState } from 'react';
import { Candidate } from './types/candidate';

interface ListCandidatesResponse {
  candidates: Candidate[];
  total: number;
}

const CandidateList = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await fetch('http://localhost:3010/api/candidates');
        if (!response.ok) throw new Error('Failed to fetch candidates');
        
        const data: ListCandidatesResponse = await response.json();
        setCandidates(data.candidates);
      } catch (err) {
        setError('Error al cargar candidatos');
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;
  if (candidates.length === 0) return <div>No hay candidatos registrados</div>;

  return (
    <div>
      <h1>Candidatos ({candidates.length})</h1>
      <ul>
        {candidates.map(candidate => (
          <li key={candidate.id}>
            <a href={`/candidates/${candidate.id}`}>
              {candidate.firstName} {candidate.lastName}
            </a>
            <span> - {candidate.email}</span>
          </li>
        ))}
      </ul>
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

router.get('/candidates', async (req: Request, res: Response) => {
  try {
    // MVP: No pagination, return all candidates
    const candidates = await prisma.candidate.findMany({
      orderBy: { createdAt: 'desc' },
      // Exclude relations to reduce payload size
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

    const total = candidates.length;

    res.status(200).json({ candidates, total });
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
```

**Future Implementation with Pagination**:

```typescript
router.get('/candidates', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const skip = (page - 1) * limit;

    const [candidates, total] = await Promise.all([
      prisma.candidate.findMany({
        skip,
        take: limit,
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
      }),
      prisma.candidate.count()
    ]);

    res.status(200).json({
      candidates,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
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
```

---

## Testing Scenarios

### Unit Tests (Backend)
- ✅ Return empty list when no candidates exist
- ✅ Return all candidates in descending order (newest first)
- ✅ Exclude educations, workExperiences, and cvDocument from response
- ✅ Return correct total count
- ✅ Handle database errors gracefully

### Integration Tests (Frontend)
- ✅ Display list of candidates
- ✅ Display "No candidates" message when list is empty
- ✅ Display candidate count
- ✅ Link to candidate detail page
- ✅ Handle server errors gracefully

---

## Future Enhancements

1. **Pagination**: Add `page` and `limit` query parameters to support large datasets.

2. **Search**: Add `search` query parameter to filter by name or email.

3. **Sorting**: Add `orderBy` and `order` query parameters for custom sorting.

4. **Filtering**: Add filters by creation date, presence of CV, etc.

5. **Performance**: Add database indexes on searchable fields (already indexed: `email`).

---

## Performance Considerations

- **Current Load**: Acceptable for <1000 candidates (typical response size: ~50KB for 100 candidates).
- **Optimization Needed At**: >1000 candidates (implement pagination).
- **Database Indexes**: Already indexed on `email` (for uniqueness check); no additional indexes needed for MVP.
- **Caching Strategy**: (Future) Cache list response for 5 minutes (low-frequency updates expected).
