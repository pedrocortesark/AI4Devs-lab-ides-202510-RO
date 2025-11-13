# Feature: Add Candidate to ATS

## Overview
Complete implementation of the "Add Candidate" feature for the Applicant Tracking System (ATS). This feature allows recruiters to add new candidates with comprehensive information including personal details, education history, work experience, and CV upload.

## User Story
**Como reclutador, Quiero tener la capacidad de añadir candidatos al sistema ATS**

## Features Implemented

### 1. Personal Information Management
- First name, last name, email (required)
- Phone number (optional)
- Full address field (optional)
- Email format validation
- Duplicate email prevention

### 2. CV Upload
- Drag-and-drop file upload interface
- Supported formats: PDF, DOC, DOCX
- Maximum file size: 10MB
- File preview with remove capability
- Automatic file organization by candidate ID

### 3. Education History
- Dynamic add/remove education entries
- Fields: Institution, Degree, Field of Study, Start Date, End Date
- "Currently studying here" checkbox (disables end date)
- Multiple education entries support

### 4. Work Experience
- Dynamic add/remove work experience entries
- Fields: Company, Position, Description, Start Date, End Date
- "Currently working here" checkbox (disables end date)
- Multiple work experience entries support

### 5. Form Validation
- Client-side validation with React Hook Form + Zod
- Server-side validation with Zod schemas
- Real-time error feedback
- Comprehensive error messages

## Technical Stack

### Backend
- **Framework**: Express.js 4.19.2 with TypeScript 4.9.5
- **Database**: PostgreSQL 13 with Prisma ORM 5.13.0
- **File Upload**: Multer 1.4.5-lts.2
- **Validation**: Zod 3.22.4
- **Testing**: Jest 29.7.0

### Frontend
- **Framework**: React 18.3.1 with TypeScript 4.9.5
- **Form Management**: React Hook Form 7.51.0
- **Routing**: React Router 6.22.0
- **Validation**: Zod 3.22.4 with @hookform/resolvers
- **Styling**: CSS with Apple-inspired design system

## Database Schema

### Candidate Table
```sql
- id: UUID (Primary Key)
- firstName: String (Required)
- lastName: String (Required)
- email: String (Required, Unique, Indexed)
- phone: String (Optional)
- address: String (Optional)
- createdAt: DateTime
- updatedAt: DateTime
```

### Education Table
```sql
- id: UUID (Primary Key)
- candidateId: UUID (Foreign Key, Cascade Delete)
- institution: String (Required)
- degree: String (Required)
- fieldOfStudy: String (Optional)
- startDate: String (Required)
- endDate: String (Optional)
- current: Boolean (Default: false)
- createdAt: DateTime
```

### WorkExperience Table
```sql
- id: UUID (Primary Key)
- candidateId: UUID (Foreign Key, Cascade Delete)
- company: String (Required)
- position: String (Required)
- description: String (Optional)
- startDate: String (Required)
- endDate: String (Optional)
- current: Boolean (Default: false)
- createdAt: DateTime
```

### CVDocument Table
```sql
- id: UUID (Primary Key)
- candidateId: UUID (Foreign Key, Unique, Cascade Delete)
- filename: String (Required)
- originalName: String (Required)
- mimeType: String (Required)
- sizeBytes: Int (Required)
- storagePath: String (Required)
- uploadedAt: DateTime
```

## API Endpoints

### POST /api/candidates
Create a new candidate with optional education and work experience.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "address": "123 Main St, City, State 12345",
  "educations": [
    {
      "institution": "MIT",
      "degree": "Bachelor of Science",
      "fieldOfStudy": "Computer Science",
      "startDate": "2015-09-01",
      "endDate": "2019-06-01",
      "current": false
    }
  ],
  "workExperiences": [
    {
      "company": "Tech Corp",
      "position": "Software Engineer",
      "description": "Developed web applications",
      "startDate": "2019-07-01",
      "current": true
    }
  ]
}
```

**Response (201):**
```json
{
  "id": "uuid",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "educations": [...],
  "workExperiences": [...],
  "createdAt": "2025-11-13T...",
  "updatedAt": "2025-11-13T..."
}
```

**Error Responses:**
- 400: Validation error
- 409: Email already exists

### POST /api/candidates/:id/cv
Upload CV document for a candidate.

**Request:**
- Content-Type: multipart/form-data
- Field name: "cv"
- File: PDF, DOC, or DOCX (max 10MB)

**Response (200):**
```json
{
  "id": "uuid",
  "candidateId": "uuid",
  "filename": "generated-uuid.pdf",
  "originalName": "john_doe_cv.pdf",
  "mimeType": "application/pdf",
  "sizeBytes": 102400,
  "storagePath": "uploads/cv/candidate-uuid/file-uuid.pdf",
  "uploadedAt": "2025-11-13T..."
}
```

**Error Responses:**
- 400: No file provided
- 400: Invalid file type
- 413: File too large

### GET /api/candidates/:id
Get candidate details with all relations.

**Response (200):**
```json
{
  "id": "uuid",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "educations": [...],
  "workExperiences": [...],
  "cvDocument": {...},
  "createdAt": "2025-11-13T...",
  "updatedAt": "2025-11-13T..."
}
```

**Error Response:**
- 404: Candidate not found

### GET /api/candidates
Get paginated list of candidates.

**Query Parameters:**
- page: number (default: 1)
- limit: number (default: 10)

**Response (200):**
```json
{
  "candidates": [...],
  "total": 42
}
```

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- Docker Desktop (for PostgreSQL)
- Git

### Backend Setup

1. **Start PostgreSQL Database:**
```bash
docker-compose up -d
```

2. **Install Dependencies:**
```bash
cd backend
npm install
```

3. **Run Database Migration:**
```bash
npx prisma migrate deploy
# or for development:
npx prisma migrate dev
```

4. **Generate Prisma Client:**
```bash
npx prisma generate
```

5. **Start Backend Server:**
```bash
npm run dev
```
Server runs on: http://localhost:3010

### Frontend Setup

1. **Install Dependencies:**
```bash
cd frontend
npm install
```

2. **Start Development Server:**
```bash
npm start
```
Application runs on: http://localhost:3000

### Environment Variables

**Backend (.env):**
```env
DATABASE_URL="postgresql://user:password@localhost:5432/ats_db"
PORT=3010
```

**Frontend (.env):**
```env
REACT_APP_API_URL=http://localhost:3010
```

## Testing

### Backend Tests
```bash
cd backend
npm test
```

**Test Coverage:**
- CandidateService unit tests (7 tests)
- Validation middleware tests (6 tests)
- Total: 13 tests passing

### Frontend Testing
Manual testing workflow:
1. Navigate to http://localhost:3000/candidates/add
2. Fill required fields (First Name, Last Name, Email)
3. Upload CV file via drag-and-drop
4. Add education entries
5. Add work experience entries
6. Submit form
7. Verify success message and redirect

## File Upload Configuration

**Storage Location:**
```
backend/uploads/cv/{candidateId}/{uuid}.{extension}
```

**Validation Rules:**
- MIME types: application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document
- Max size: 10MB (10485760 bytes)
- Filename: UUID v4 with original extension
- Directory: Auto-created per candidate

## Design System

### Color Palette
- Primary: #FF9800 (Orange)
- Primary Dark: #F57C00
- Background: #FFFFFF
- Surface: #F5F5F7
- Border: #D1D1D6
- Text: #1D1D1F
- Text Secondary: #86868B
- Error: #FF3B30
- Success: #34C759

### Typography
- Font Family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto
- Font Sizes: 12px - 24px
- Font Weights: 400 (Regular), 500 (Medium), 600 (Semibold)

### Spacing Scale
- Base: 8px
- Scale: 8px, 16px, 24px, 32px, 40px, 48px

## Architecture Decisions

### Backend Architecture
- **Service Layer Pattern**: Business logic isolated in CandidateService
- **Middleware Pattern**: Validation and file upload as reusable middleware
- **Repository Pattern**: Prisma ORM as data access layer
- **Error Handling**: Standardized error responses with codes

### Frontend Architecture
- **Page Components**: Route-level components (AddCandidatePage)
- **Feature Components**: Business logic components (CandidateForm)
- **UI Components**: Reusable form controls (TextInput, FileUpload, etc.)
- **Service Layer**: API calls isolated in candidateService
- **Form State**: React Hook Form with Zod validation

### Database Design
- **UUID Primary Keys**: Better for distributed systems
- **Cascade Deletes**: Automatic cleanup of related records
- **Indexed Email**: Fast duplicate checking
- **Timestamps**: Automatic tracking with Prisma

## Known Limitations & Future Enhancements

### Current Limitations
1. No file storage cleanup on candidate deletion
2. No image preview for PDF files
3. Single CV per candidate (no versioning)
4. No bulk candidate import
5. No candidate search/filter

### Planned Enhancements
1. Candidate list/detail views
2. Edit candidate functionality
3. Advanced search and filtering
4. Bulk import from CSV/Excel
5. Email notification system
6. CV parsing with AI
7. Candidate status workflow
8. Interview scheduling integration

## Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker ps

# Restart database
docker-compose restart

# Check connection
npx prisma studio
```

### Prisma Client Issues
```bash
# Regenerate Prisma Client
rm -rf node_modules/.prisma
npx prisma generate
```

### File Upload Issues
1. Check uploads directory permissions
2. Verify MIME type configuration in upload.ts
3. Check file size limits in Multer config

### CORS Issues
Backend is configured to accept requests from http://localhost:3000. Update CORS configuration in backend/src/index.ts if needed.

## Performance Considerations

### Backend
- Database queries include only necessary relations
- Pagination implemented for candidate lists
- File validation before storage
- Efficient UUID generation

### Frontend
- Form validation happens on blur for better UX
- File preview without full upload
- Debounced validation messages
- Optimistic UI updates

## Security Considerations

### Implemented
- Input validation (client + server)
- SQL injection prevention (Prisma parameterized queries)
- File type validation
- File size limits
- Unique email constraint

### Recommended for Production
- Rate limiting on API endpoints
- Authentication & authorization
- HTTPS enforcement
- File scanning for malware
- CSP headers
- XSS protection
- Input sanitization

## License
Internal project - All rights reserved

## Contributors
- Backend: AI4Devs Team
- Frontend: AI4Devs Team
- Database Design: AI4Devs Team

## Version History
- v1.0.0 (2025-11-13): Initial MVP release
  - Add candidate with personal information
  - CV upload functionality
  - Education and work experience management
  - Form validation
  - 13 unit tests

---

**Last Updated**: November 13, 2025
**Status**: ✅ MVP Complete - Ready for Production Review
