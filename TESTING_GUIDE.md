# Testing Guide - LTI Candidate Creation Flow

This guide will help you test the complete end-to-end candidate creation functionality.

## Prerequisites

- Node.js >= 20.x installed
- Docker and Docker Compose installed
- Terminal access (PowerShell on Windows)

## Step 1: Start the Database

```powershell
# From the root directory
docker compose up -d
```

Verify the database is running:
```powershell
docker ps
# You should see the lti-postgres container running
```

## Step 2: Start the Backend

```powershell
# Open a new terminal
cd backend

# Install dependencies (if not already done)
npm install

# Run database migrations
npx prisma migrate deploy

# Start the backend server
npm run dev
```

The backend should start on **http://localhost:3010**

Expected output:
```
✅ Database connected successfully
🚀 Server is running on http://localhost:3010
```

## Step 3: Start the Frontend

```powershell
# Open another terminal
cd frontend

# Install dependencies (if not already done)
npm install

# Start the frontend development server
npm start
```

The frontend should start on **http://localhost:3000** and open automatically in your browser.

## Step 4: Test the Candidate Creation Flow

### 4.1 Navigate to the Form

1. You should see the Dashboard page with a welcome message
2. Click the **"Agregar Candidato"** (Add Candidate) button
3. You should be redirected to `/candidates/new` showing the candidate form

### 4.2 Test Form Validation (Error Cases)

**Test Required Fields:**
1. Click the "Guardar" (Save) button without filling any fields
2. Expected: Red error messages appear below required fields:
   - "First name is required"
   - "Last name is required"
   - "Email is required"

**Test Invalid Email:**
1. Fill in:
   - First Name: `Juan`
   - Last Name: `Pérez`
   - Email: `invalid-email`
2. Click "Guardar"
3. Expected: "Invalid email format" error under email field

**Test Invalid Phone (if provided):**
1. Fill in Phone: `123` (not E.164 format)
2. Expected: "Phone must be in E.164 format (e.g., +1234567890)" error

**Test Invalid File Type:**
1. Fill in required fields correctly
2. Try to upload a non-PDF file (e.g., .docx, .txt, .jpg)
3. Expected: Toast notification "Solo se permiten archivos PDF" (Only PDF files allowed)

**Test File Size Limit:**
1. Try to upload a PDF larger than 10MB
2. Expected: Toast notification "El tamaño del archivo excede el límite de 10MB"

### 4.3 Test Successful Candidate Creation

**Test Case 1: Minimum Required Fields**
```
First Name: Juan
Last Name: Pérez
Email: juan.perez@example.com
```
1. Fill in the above fields
2. Click "Guardar"
3. Expected Results:
   - Success toast: "¡Candidato creado exitosamente!"
   - Redirected back to Dashboard
   - Backend logs should show the candidate creation

**Test Case 2: Full Personal Information**
```
First Name: María
Last Name: García
Email: maria.garcia@example.com
Phone: +34612345678
Address Line 1: Calle Mayor 123
Address Line 2: Piso 2, Puerta A
City: Madrid
State/Province: Madrid
Postal Code: 28013
Country: España
```
1. Fill in all fields above
2. Click "Guardar"
3. Expected: Success toast and redirect to Dashboard

**Test Case 3: With CV Upload**
```
First Name: Carlos
Last Name: Rodríguez
Email: carlos.rodriguez@example.com
CV: Upload a valid PDF file (< 10MB)
```
1. Fill in required fields
2. Click on the CV upload area or "Click to upload CV"
3. Select a PDF file
4. Verify the file preview shows: filename, size, and "Eliminar" button
5. Click "Guardar"
6. Expected: Success creation with CV stored

**Test Case 4: Remove Uploaded CV**
1. Fill in required fields
2. Upload a PDF file
3. Click the "Eliminar" (Remove) button next to the file preview
4. Expected: File preview disappears, can upload a new file

### 4.4 Test Duplicate Email Validation

1. Create a candidate with email: `test@example.com`
2. Try to create another candidate with the same email
3. Expected: Error toast or message indicating "Email already exists" (409 error)

## Step 5: Verify Data in Database

### Option A: Using Prisma Studio
```powershell
cd backend
npx prisma studio
```
This opens a web interface at http://localhost:5555 where you can browse the database tables.

### Option B: Using PostgreSQL CLI
```powershell
docker exec -it lti-postgres psql -U LTIdbUser -d LTIdb

# View candidates
SELECT id, "firstName", "lastName", email, phone, "createdAt" FROM "Candidate";

# View candidate with address
SELECT * FROM "Candidate" WHERE email = 'juan.perez@example.com';

# Exit
\q
```

## Step 6: Verify Uploaded CV Files

Check the file system:
```powershell
cd backend
ls uploads/cv/
```

You should see directories named with candidate IDs, each containing uploaded PDF files with UUID names.

## Step 7: Test Backend API Directly (Optional)

### Test GET Candidates
```powershell
curl http://localhost:3010/api/candidates
```

### Test GET Single Candidate
```powershell
# Replace {id} with actual candidate ID
curl http://localhost:3010/api/candidates/{id}
```

### Test POST with cURL (without CV)
```powershell
curl -X POST http://localhost:3010/api/candidates `
  -H "Content-Type: application/json" `
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test.user@example.com",
    "phone": "+1234567890",
    "addressLine1": "123 Test St",
    "city": "Test City",
    "postalCode": "12345",
    "country": "Test Country"
  }'
```

### Test POST with CV using PowerShell
```powershell
$formData = @{
    firstName = "Test"
    lastName = "WithCV"
    email = "test.withcv@example.com"
    cv = Get-Item -Path "path\to\your\test.pdf"
}

Invoke-WebRequest -Uri "http://localhost:3010/api/candidates" `
    -Method POST `
    -Form $formData
```

## Step 8: Run Automated Tests

### Backend Tests
```powershell
cd backend
npm test
```

Expected: 25 tests passing (including domain tests for Candidate)

### Frontend Tests
```powershell
cd frontend
npm test
```

Expected: Tests for apiClient, useI18n, and other utilities

## Common Issues and Solutions

### Issue: Backend won't start - Database connection error
**Solution:** 
```powershell
# Ensure PostgreSQL is running
docker compose up -d

# Check container logs
docker logs lti-postgres

# Verify connection string in backend/.env
```

### Issue: Frontend shows "Network Error"
**Solution:**
- Verify backend is running on port 3010
- Check CORS configuration in backend allows http://localhost:3000
- Open browser DevTools → Network tab to see actual error

### Issue: File upload fails with 413 or 415 error
**Solution:**
- 413 = File too large (must be < 10MB)
- 415 = Wrong file type (must be PDF)
- Check file in file system to confirm it's a valid PDF

### Issue: Form validation not working
**Solution:**
- Open browser DevTools → Console for JavaScript errors
- Check that Zod schemas match between frontend and backend
- Verify React Hook Form is properly configured with zodResolver

### Issue: Translations not showing correctly
**Solution:**
- Check browser language settings
- Verify DEFAULT_LANGUAGE in frontend/src/shared/i18n/translations.ts
- Console.log the current language from useI18n hook

## Expected Behavior Summary

✅ **Form loads correctly** with all fields and labels in Spanish (default)
✅ **Client-side validation** shows errors immediately on blur or submit
✅ **CV upload** only accepts PDF files under 10MB
✅ **Success flow** shows toast notification and redirects to dashboard
✅ **Error flow** shows appropriate error messages (validation, duplicate email, etc.)
✅ **Backend API** creates candidate record in database
✅ **CV files** are stored in `backend/uploads/cv/{candidateId}/` directory
✅ **Email normalization** converts emails to lowercase before storing
✅ **Soft delete** support (isDeleted field, not exposed in UI yet)

## Next Steps (Future Features)

- [ ] Add Education repeatable section
- [ ] Add Experience repeatable section
- [ ] Integrate autocomplete lookups with debounce
- [ ] Add candidate list view on Dashboard
- [ ] Add candidate detail view
- [ ] Add edit candidate functionality
- [ ] Add delete candidate functionality
- [ ] Add pagination and search on candidate list
