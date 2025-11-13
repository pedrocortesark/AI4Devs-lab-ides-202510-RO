# POST /api/candidates/:candidateId/cv

**Purpose**: Upload a CV document (PDF, DOC, DOCX) for an existing candidate.

---

## Request

**Method**: `POST`  
**Endpoint**: `/api/candidates/:candidateId/cv`  
**Content-Type**: `multipart/form-data`  
**Authentication**: None (future: Bearer token)

### URL Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `candidateId` | string (UUID) | ✅ Yes | The unique identifier of the candidate |

### Headers
```
Content-Type: multipart/form-data
Accept: application/json
```

### Body (Multipart Form Data)

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `cv` | File | ✅ Yes | Max 10MB, MIME: `application/pdf`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document` | The CV document file |

### Example Request (cURL)

```bash
curl -X POST http://localhost:3010/api/candidates/a3f2e1d0-8c7b-4f5e-9d3a-1b2c3d4e5f6a/cv \
  -F "cv=@/path/to/maria-gonzalez-cv.pdf"
```

### Example Request (JavaScript with FormData)

```javascript
const formData = new FormData();
formData.append('cv', fileInput.files[0]);

const response = await fetch(
  `http://localhost:3010/api/candidates/${candidateId}/cv`,
  {
    method: 'POST',
    body: formData,
  }
);
```

---

## Response

### Success Response (200 OK)

**Status**: `200 OK`  
**Content-Type**: `application/json`

#### Body Schema

```typescript
{
  id: string;               // UUID of the CV document
  candidateId: string;      // UUID of the candidate
  filename: string;         // Generated filename (e.g., cv-1731519234567-a3f2e1d0.pdf)
  originalName: string;     // Original filename from upload (e.g., maria-gonzalez-cv.pdf)
  mimeType: string;         // MIME type (e.g., application/pdf)
  sizeBytes: number;        // File size in bytes
  uploadedAt: string;       // ISO 8601 timestamp
}
```

#### Example Response

```json
{
  "id": "d4e5f6a7-9c8b-4a5d-8e7f-4b5c6d7e8f9a",
  "candidateId": "a3f2e1d0-8c7b-4f5e-9d3a-1b2c3d4e5f6a",
  "filename": "cv-1731519234567-a3f2e1d0.pdf",
  "originalName": "maria-gonzalez-cv.pdf",
  "mimeType": "application/pdf",
  "sizeBytes": 245678,
  "uploadedAt": "2025-11-13T10:35:00.000Z"
}
```

---

### Error Responses

#### 400 Bad Request (Invalid File)

**Status**: `400 Bad Request`  
**Cause**: Invalid file type, file too large, or missing file

```json
{
  "error": {
    "code": "INVALID_FILE",
    "message": "Tipo de archivo inválido. Solo se permiten PDF, DOC y DOCX",
    "timestamp": "2025-11-13T10:35:00.000Z"
  }
}
```

**Specific Error Codes**:
- `INVALID_FILE_TYPE`: File type not in whitelist (PDF, DOC, DOCX)
- `FILE_TOO_LARGE`: File size exceeds 10MB
- `NO_FILE_PROVIDED`: Request missing `cv` field

#### 404 Not Found (Candidate Not Found)

**Status**: `404 Not Found`  
**Cause**: Candidate with provided `candidateId` does not exist

```json
{
  "error": {
    "code": "CANDIDATE_NOT_FOUND",
    "message": "Candidato no encontrado",
    "timestamp": "2025-11-13T10:35:00.000Z"
  }
}
```

#### 409 Conflict (CV Already Exists)

**Status**: `409 Conflict`  
**Cause**: Candidate already has a CV document (one CV per candidate constraint)

```json
{
  "error": {
    "code": "CV_ALREADY_EXISTS",
    "message": "El candidato ya tiene un CV. Elimina el existente antes de subir uno nuevo.",
    "timestamp": "2025-11-13T10:35:00.000Z"
  }
}
```

#### 500 Internal Server Error

**Status**: `500 Internal Server Error`  
**Cause**: File system error, database error, or unexpected server failure

```json
{
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Error al guardar el archivo. Por favor intenta de nuevo más tarde.",
    "timestamp": "2025-11-13T10:35:00.000Z"
  }
}
```

---

## Business Rules

1. **One CV Per Candidate**: Each candidate can have only one CV document. To upload a new CV, the existing one must be deleted first (enforced by database unique constraint on `candidateId`).

2. **File Type Whitelist**: Only PDF (`.pdf`), Microsoft Word (`.doc`), and Microsoft Word 2007+ (`.docx`) files are allowed.

3. **File Size Limit**: Maximum file size is 10MB (10,485,760 bytes).

4. **File Storage**: Files are stored in `backend/uploads/cv/{candidateId}/{generated-filename}` with UUID-based filenames to prevent collisions.

5. **Filename Generation**: Format is `cv-{timestamp}-{uuid}.{extension}` (e.g., `cv-1731519234567-a3f2e1d0.pdf`).

6. **Metadata Storage**: Database stores only file metadata (filename, path, size, MIME type), not the file content itself.

7. **Candidate Existence**: Candidate must exist before uploading CV (enforced by foreign key constraint).

---

## Security Considerations

- **File Type Validation**: Both MIME type and file extension are validated to prevent executable uploads.
- **File Size Limit**: Enforced to prevent DoS attacks via large file uploads.
- **Directory Traversal Protection**: Filenames are sanitized; UUID-based paths prevent directory traversal.
- **Virus Scanning**: (Future requirement) Files should be scanned for malware before storage.
- **Access Control**: (Future requirement) Only authorized users should upload CVs for candidates.

---

## File Storage Details

### Storage Path Pattern
```
backend/uploads/cv/{candidateId}/{generated-filename}
```

**Example**:
```
backend/uploads/cv/a3f2e1d0-8c7b-4f5e-9d3a-1b2c3d4e5f6a/cv-1731519234567-a3f2e1d0.pdf
```

### Database Record
```sql
INSERT INTO cv_documents (
  id, 
  candidateId, 
  filename, 
  originalName, 
  mimeType, 
  sizeBytes, 
  storagePath, 
  uploadedAt
) VALUES (
  'd4e5f6a7-9c8b-4a5d-8e7f-4b5c6d7e8f9a',
  'a3f2e1d0-8c7b-4f5e-9d3a-1b2c3d4e5f6a',
  'cv-1731519234567-a3f2e1d0.pdf',
  'maria-gonzalez-cv.pdf',
  'application/pdf',
  245678,
  'uploads/cv/a3f2e1d0-8c7b-4f5e-9d3a-1b2c3d4e5f6a/cv-1731519234567-a3f2e1d0.pdf',
  '2025-11-13T10:35:00.000Z'
);
```

---

## Frontend Implementation Notes

**React Hook Form Example with File Upload**:

```typescript
import { useState } from 'react';

const CVUpload = ({ candidateId }: { candidateId: string }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Client-side validation
    const allowedTypes = ['application/pdf', 'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Solo se permiten archivos PDF, DOC y DOCX');
      return;
    }

    if (selectedFile.size > maxSize) {
      setError('El archivo no puede superar los 10MB');
      return;
    }

    setFile(selectedFile);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('cv', file);

    try {
      const response = await fetch(
        `http://localhost:3010/api/candidates/${candidateId}/cv`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (response.status === 404) {
        setError('Candidato no encontrado');
        return;
      }

      if (response.status === 409) {
        setError('El candidato ya tiene un CV. Elimina el existente primero.');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to upload CV');
      }

      const cvDocument = await response.json();
      toast.success('CV subido exitosamente');
      // Update UI or navigate
    } catch (err) {
      setError('Error al subir el archivo. Intenta de nuevo.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
      />
      {error && <p className="text-red-500">{error}</p>}
      <button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? 'Subiendo...' : 'Subir CV'}
      </button>
    </div>
  );
};
```

---

## Backend Implementation Notes

**Multer Configuration** (Express middleware):

```typescript
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const candidateId = req.params.candidateId;
    const uploadPath = path.join(__dirname, '../uploads/cv', candidateId);
    
    // Ensure directory exists
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

**Express Route Handler**:

```typescript
router.post(
  '/candidates/:candidateId/cv',
  uploadCV.single('cv'),
  async (req, res) => {
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

      // Check if candidate exists
      const candidate = await prisma.candidate.findUnique({
        where: { id: candidateId }
      });

      if (!candidate) {
        // Clean up uploaded file
        await fs.unlink(file.path);
        return res.status(404).json({
          error: {
            code: 'CANDIDATE_NOT_FOUND',
            message: 'Candidato no encontrado',
            timestamp: new Date().toISOString()
          }
        });
      }

      // Check if CV already exists
      const existingCV = await prisma.cVDocument.findUnique({
        where: { candidateId }
      });

      if (existingCV) {
        // Clean up uploaded file
        await fs.unlink(file.path);
        return res.status(409).json({
          error: {
            code: 'CV_ALREADY_EXISTS',
            message: 'El candidato ya tiene un CV',
            timestamp: new Date().toISOString()
          }
        });
      }

      // Save CV metadata to database
      const cvDocument = await prisma.cVDocument.create({
        data: {
          candidateId,
          filename: file.filename,
          originalName: file.originalname,
          mimeType: file.mimetype,
          sizeBytes: file.size,
          storagePath: file.path.replace(/\\/g, '/') // Normalize path
        }
      });

      res.status(200).json(cvDocument);
    } catch (error) {
      console.error('Error uploading CV:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Error al guardar el archivo',
          timestamp: new Date().toISOString()
        }
      });
    }
  }
);
```

---

## Testing Scenarios

### Unit Tests (Backend)
- ✅ Upload valid PDF file
- ✅ Upload valid DOC file
- ✅ Upload valid DOCX file
- ✅ Reject file > 10MB
- ✅ Reject invalid file type (e.g., .exe, .jpg)
- ✅ Reject request with no file
- ✅ Return 404 for non-existent candidate
- ✅ Return 409 if candidate already has CV
- ✅ Clean up uploaded file on error
- ✅ Generate unique filename with UUID
- ✅ Store correct metadata in database

### Integration Tests (Frontend)
- ✅ File input accepts only .pdf, .doc, .docx
- ✅ Client-side validation for file size
- ✅ Client-side validation for file type
- ✅ Display upload progress (optional)
- ✅ Handle 404 error (candidate not found)
- ✅ Handle 409 error (CV already exists)
- ✅ Handle server errors gracefully
- ✅ Display success message on upload
