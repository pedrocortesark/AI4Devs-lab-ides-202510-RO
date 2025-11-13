# Testing Instructions - Add Candidate Feature

## Pre-Testing Setup

### 1. Start the Database
```bash
cd c:\Users\pedro.cortes\source\ai4devs\03-first-ticket-lti
docker-compose up -d
```

**Verify Database is Running:**
```bash
docker ps
```
You should see a PostgreSQL container running on port 5432.

### 2. Start Backend Server
```bash
cd c:\Users\pedro.cortes\source\ai4devs\03-first-ticket-lti\backend
npm run dev
```

**Expected Output:**
```
Server running on http://localhost:3010
```

**Verify Backend Health:**
Open browser to: http://localhost:3010
You should see: `{"message":"LTI ATS API is running"}`

### 3. Start Frontend Application
Open a new terminal:
```bash
cd c:\Users\pedro.cortes\source\ai4devs\03-first-ticket-lti\frontend
npm start
```

**Expected Output:**
```
Compiled successfully!
You can now view frontend in the browser.
Local:            http://localhost:3000
```

Browser should automatically open to http://localhost:3000

---

## Test Suite 1: Basic Form Navigation

### Test 1.1: Access Add Candidate Page
1. Navigate to http://localhost:3000
2. Click on "Añadir Candidato" in the navigation bar
3. **Expected**: URL changes to http://localhost:3000/candidates/add
4. **Expected**: Page title displays "Añadir Candidato"
5. **Expected**: Form description shows "Complete el formulario para agregar un nuevo candidato al sistema"

### Test 1.2: Form Fields Present
Verify all form fields are visible:
- ✅ First Name (with red asterisk *)
- ✅ Last Name (with red asterisk *)
- ✅ Email (with red asterisk *)
- ✅ Phone
- ✅ Address
- ✅ CV Upload area (drag-and-drop box)
- ✅ Education section header
- ✅ Work Experience section header
- ✅ "Guardar Candidato" button

---

## Test Suite 2: Form Validation

### Test 2.1: Required Field Validation
1. Leave all fields empty
2. Click "Guardar Candidato" button
3. **Expected**: Error messages appear:
   - "El nombre es requerido" under First Name
   - "El apellido es requerido" under Last Name
   - "El email es requerido" under Email
4. **Expected**: Button remains enabled, no API call made

### Test 2.2: Email Format Validation
1. Enter "John" in First Name
2. Enter "Doe" in Last Name
3. Enter "invalid-email" in Email
4. Click "Guardar Candidato"
5. **Expected**: Error message "Email inválido" appears under Email field

### Test 2.3: Valid Minimum Data
1. Enter "John" in First Name
2. Enter "Doe" in Last Name
3. Enter "john.doe@example.com" in Email
4. Click "Guardar Candidato"
5. **Expected**: 
   - Button changes to "Guardando..." and becomes disabled
   - Success message appears: "Candidato creado exitosamente. Redirigiendo..."
   - After 1.5 seconds, redirects to http://localhost:3000
6. **Verify in Backend Console**: Should see POST request log

---

## Test Suite 3: CV Upload

### Test 3.1: Drag and Drop Upload
**Prepare a test PDF file first** (any PDF under 10MB)

1. Fill required fields (First Name, Last Name, Email)
2. Drag a PDF file and drop it onto the CV upload area
3. **Expected**: 
   - Upload area changes to show file preview
   - File name displays
   - File size displays (e.g., "1.2 MB")
   - Remove button (✕) appears
4. Click "Guardar Candidato"
5. **Expected**: Success message appears
6. **Verify**: File uploaded to `backend/uploads/cv/{candidate-id}/` directory

### Test 3.2: Click to Upload
1. Fill required fields
2. Click on the CV upload area
3. **Expected**: File picker dialog opens
4. Select a DOCX file (under 10MB)
5. **Expected**: File preview appears with name and size
6. Click "Guardar Candidato"
7. **Expected**: Success message, candidate created with CV

### Test 3.3: Remove Uploaded File
1. Upload a file (any valid format)
2. Click the ✕ (remove) button
3. **Expected**: 
   - File preview disappears
   - Upload area returns to initial state
   - "Arrastra tu CV aquí o haz clic para seleccionar" text reappears

### Test 3.4: Invalid File Type
1. Try to upload a .txt or .jpg file
2. **Expected**: Alert message appears: "Tipo de archivo no permitido. Solo se aceptan: .pdf, .doc, .docx"
3. **Expected**: File is not accepted

### Test 3.5: File Size Validation
**Prepare a file larger than 10MB**

1. Try to upload a file > 10MB
2. **Expected**: Alert message: "El archivo es demasiado grande. Tamaño máximo: 10 MB"

---

## Test Suite 4: Education Section

### Test 4.1: Add Education Entry
1. Fill required candidate fields
2. Click "+ Agregar educación" button
3. **Expected**: 
   - New education form appears
   - Shows fields: Institution, Degree, Field of Study, Start Date, End Date
   - "Currently studying here" checkbox appears
   - Remove button appears in the header

### Test 4.2: Fill Education Entry
1. Add an education entry
2. Fill in:
   - Institution: "MIT"
   - Degree: "Bachelor of Science"
   - Field of Study: "Computer Science"
   - Start Date: "2015-09-01"
   - End Date: "2019-06-01"
3. **Expected**: All fields accept input without errors

### Test 4.3: Current Education Checkbox
1. Add an education entry
2. Fill Institution and Degree
3. Check "Currently studying here" checkbox
4. **Expected**: End Date field becomes disabled
5. Uncheck the checkbox
6. **Expected**: End Date field becomes enabled again

### Test 4.4: Multiple Education Entries
1. Click "+ Agregar educación" three times
2. **Expected**: Three separate education forms appear
3. Fill each with different data
4. Submit the form
5. **Verify in Database**: All three education entries saved

### Test 4.5: Remove Education Entry
1. Add two education entries
2. Click the ✕ button on the first entry
3. **Expected**: First entry disappears, second entry remains
4. Click ✕ on the second entry
5. **Expected**: All education entries removed, only "+ Agregar educación" button remains

### Test 4.6: Education Validation
1. Add an education entry
2. Leave Institution empty
3. Fill other required fields
4. Try to submit
5. **Expected**: Error message appears under Institution field

---

## Test Suite 5: Work Experience Section

### Test 5.1: Add Work Experience Entry
1. Fill required candidate fields
2. Click "+ Agregar experiencia laboral" button
3. **Expected**:
   - New work experience form appears
   - Shows fields: Company, Position, Description, Start Date, End Date
   - "Currently working here" checkbox appears
   - Remove button appears

### Test 5.2: Fill Work Experience Entry
1. Add a work experience entry
2. Fill in:
   - Company: "Tech Corp"
   - Position: "Software Engineer"
   - Description: "Developed web applications using React and Node.js"
   - Start Date: "2019-07-01"
   - End Date: "2023-12-31"
3. **Expected**: All fields accept input correctly

### Test 5.3: Current Work Checkbox
1. Add a work experience entry
2. Fill Company and Position
3. Check "Currently working here" checkbox
4. **Expected**: End Date field becomes disabled
5. **Expected**: End Date value is cleared

### Test 5.4: Multiple Work Entries
1. Add 3 work experience entries with different data
2. Submit the form
3. **Expected**: All entries saved successfully
4. **Verify**: Backend logs show all work experiences in the payload

### Test 5.5: Remove Work Entry
1. Add two work experience entries
2. Click ✕ on the first entry
3. **Expected**: First entry removed, second remains
4. Add a third entry
5. **Expected**: Can add more entries after removing

---

## Test Suite 6: Complete End-to-End Flow

### Test 6.1: Full Candidate with All Data
1. Navigate to Add Candidate page
2. Fill Personal Information:
   - First Name: "Jane"
   - Last Name: "Smith"
   - Email: "jane.smith@techcorp.com"
   - Phone: "+1-555-0123"
   - Address: "123 Main Street, San Francisco, CA 94102"

3. Upload CV:
   - Drag and drop a PDF file

4. Add Education:
   - Click "+ Agregar educación"
   - Institution: "Stanford University"
   - Degree: "Master of Science"
   - Field of Study: "Artificial Intelligence"
   - Start Date: "2018-09-01"
   - End Date: "2020-06-01"
   
5. Add Another Education:
   - Click "+ Agregar educación"
   - Institution: "UC Berkeley"
   - Degree: "Bachelor of Science"
   - Field of Study: "Computer Science"
   - Start Date: "2014-09-01"
   - End Date: "2018-05-01"

6. Add Work Experience:
   - Click "+ Agregar experiencia laboral"
   - Company: "Google"
   - Position: "Senior Software Engineer"
   - Description: "Led development of machine learning infrastructure"
   - Start Date: "2020-07-01"
   - Check "Currently working here"

7. Add Another Work Experience:
   - Click "+ Agregar experiencia laboral"
   - Company: "Facebook"
   - Position: "Software Engineer"
   - Description: "Worked on React Native mobile apps"
   - Start Date: "2018-06-01"
   - End Date: "2020-06-30"

8. Click "Guardar Candidato"

9. **Expected Results**:
   - Button shows "Guardando..."
   - Success message appears
   - Redirects to home page after 1.5 seconds
   - Check backend console for successful POST requests

### Test 6.2: Verify in Database (Optional)
```bash
cd backend
npx prisma studio
```

1. Navigate to http://localhost:5555
2. Click on "Candidate" model
3. **Expected**: See the newly created candidate "Jane Smith"
4. Click on the candidate to view details
5. **Expected**: All fields populated correctly
6. Click on "Education" model
7. **Expected**: See 2 education entries linked to this candidate
8. Click on "WorkExperience" model
9. **Expected**: See 2 work experience entries
10. Click on "CVDocument" model
11. **Expected**: See 1 CV document entry with file path

---

## Test Suite 7: Error Scenarios

### Test 7.1: Duplicate Email
1. Create a candidate with email "test@example.com"
2. Try to create another candidate with the same email
3. **Expected**: Red alert appears: "El email ya está registrado en el sistema"
4. **Expected**: Form remains filled (data not lost)
5. Change email to different value
6. Submit again
7. **Expected**: Success

### Test 7.2: Backend Disconnected
1. Stop the backend server (Ctrl+C in backend terminal)
2. Try to submit a candidate
3. **Expected**: Error alert appears with network error message
4. **Expected**: Button returns to "Guardar Candidato" state
5. Restart backend server
6. Submit again
7. **Expected**: Success

### Test 7.3: Large File Upload
1. Attempt to upload a 15MB PDF
2. **Expected**: Alert: "El archivo es demasiado grande. Tamaño máximo: 10 MB"
3. Upload a 5MB PDF instead
4. **Expected**: Upload succeeds

---

## Test Suite 8: Accessibility Testing

### Test 8.1: Keyboard Navigation
1. Use Tab key to navigate through all form fields
2. **Expected**: 
   - Focus indicator visible on each field
   - Tab order is logical (top to bottom, left to right)
   - Can reach all interactive elements

### Test 8.2: Form Labels
1. Click on "First Name" label text
2. **Expected**: First Name input field receives focus
3. Repeat for all labels
4. **Expected**: Corresponding input fields receive focus

### Test 8.3: Error Announcements
1. Submit form with empty required fields
2. **Expected**: Screen reader announces validation errors (if using screen reader)
3. Error messages have proper ARIA attributes

### Test 8.4: File Upload Keyboard
1. Tab to CV upload area
2. Press Enter or Space key
3. **Expected**: File picker dialog opens
4. Select a file
5. Tab to remove button
6. Press Enter
7. **Expected**: File is removed

---

## Test Suite 9: UI/UX Polish

### Test 9.1: Loading States
1. Fill form with valid data
2. Click "Guardar Candidato"
3. **Expected During Save**:
   - Button text changes to "Guardando..."
   - Button becomes disabled (not clickable)
   - Cannot submit form multiple times

### Test 9.2: Success Feedback
1. Successfully create a candidate
2. **Expected**:
   - Green success alert appears
   - Message: "Candidato creado exitosamente. Redirigiendo..."
   - Checkmark icon (✓) displayed
   - Auto-redirect after 1.5 seconds

### Test 9.3: Error Feedback
1. Trigger a validation error
2. **Expected**:
   - Red error text appears below affected field
   - Error icon or styling indicates the problem
   - Form remains usable

### Test 9.4: Responsive Behavior (Optional)
1. Resize browser window to mobile size (375px width)
2. **Expected**: 
   - Form remains usable
   - Fields stack vertically
   - Buttons remain accessible
   - No horizontal scrolling required

---

## Test Suite 10: Backend Unit Tests

### Test 10.1: Run Backend Tests
```bash
cd backend
npm test
```

**Expected Output:**
```
PASS  src/services/__tests__/CandidateService.test.ts
  CandidateService
    create
      ✓ should create a candidate with educations and work experiences
      ✓ should create a candidate without educations and work experiences
    findById
      ✓ should return a candidate with all relations
      ✓ should return null if candidate not found
    findAll
      ✓ should return paginated candidates
      ✓ should handle page 2 correctly
    uploadCV
      ✓ should create CV document for candidate

PASS  src/middleware/__tests__/validateRequest.test.ts
  validateRequest middleware
    ✓ should call next() when validation passes
    ✓ should return 400 with error details when validation fails
    ✓ should handle missing required fields
    ✓ should handle nested object validation
    ✓ should handle array validation
    ✓ should accept optional fields when not provided

Test Suites: 2 passed, 2 total
Tests:       13 passed, 13 total
Snapshots:   0 total
Time:        ~1.5s
```

All 13 tests should pass with no errors.

---

## Troubleshooting Common Issues

### Issue: "Port 3010 already in use"
**Solution:**
```bash
# Windows
netstat -ano | findstr :3010
taskkill /PID <PID> /F

# Then restart backend
```

### Issue: "Cannot connect to database"
**Solution:**
```bash
# Check Docker container
docker ps

# If not running
docker-compose up -d

# Verify connection
cd backend
npx prisma studio
```

### Issue: "Module not found" errors
**Solution:**
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### Issue: Prisma Client errors
**Solution:**
```bash
cd backend
rm -rf node_modules/.prisma
npx prisma generate
npm run dev
```

### Issue: Frontend shows blank page
**Solution:**
1. Open browser console (F12)
2. Check for error messages
3. Verify backend is running on port 3010
4. Clear browser cache and reload

---

## Success Criteria Checklist

Mark each item as you verify:

### Core Functionality
- [ ] Can access Add Candidate page via navigation
- [ ] Can create candidate with only required fields (First Name, Last Name, Email)
- [ ] Can upload CV file (PDF, DOC, DOCX)
- [ ] Can add multiple education entries
- [ ] Can add multiple work experience entries
- [ ] Can remove education/work entries
- [ ] Form validates required fields
- [ ] Email format validation works
- [ ] Duplicate email prevention works
- [ ] Success message displays after creation
- [ ] Redirects to home page after success

### File Upload
- [ ] Drag and drop works
- [ ] Click to upload works
- [ ] File preview shows name and size
- [ ] Remove file button works
- [ ] Invalid file type rejected
- [ ] Large files (>10MB) rejected
- [ ] Files stored in correct directory

### Dynamic Fields
- [ ] "Currently studying/working here" checkbox disables end date
- [ ] Can add unlimited education entries
- [ ] Can add unlimited work experience entries
- [ ] Can remove individual entries
- [ ] Empty state shows when all entries removed

### User Experience
- [ ] Loading state displays during submission
- [ ] Button disabled during save
- [ ] Error messages clear and helpful
- [ ] Success feedback prominent
- [ ] No console errors during normal use
- [ ] All labels properly linked to inputs
- [ ] Tab navigation works logically
- [ ] Keyboard accessible (Enter/Space on upload area)

### Backend
- [ ] All 13 unit tests pass
- [ ] API endpoints respond correctly
- [ ] Database records created properly
- [ ] Files uploaded to correct location
- [ ] Validation errors return 400 status
- [ ] Duplicate email returns 409 status

---

## Final Verification Commands

```bash
# Check backend tests
cd backend
npm test

# Check backend is running
curl http://localhost:3010

# Check database has records
cd backend
npx prisma studio
# Navigate to Candidate model and verify entries

# Check uploaded files
ls backend/uploads/cv/
# Should see directories with UUIDs

# Check frontend builds without errors
cd frontend
npm run build
```

---

## Test Report Template

```
Testing Date: __________
Tester: __________

Test Suites Completed:
[ ] Suite 1: Basic Form Navigation - X/X passed
[ ] Suite 2: Form Validation - X/X passed
[ ] Suite 3: CV Upload - X/X passed
[ ] Suite 4: Education Section - X/X passed
[ ] Suite 5: Work Experience - X/X passed
[ ] Suite 6: End-to-End Flow - X/X passed
[ ] Suite 7: Error Scenarios - X/X passed
[ ] Suite 8: Accessibility - X/X passed
[ ] Suite 9: UI/UX Polish - X/X passed
[ ] Suite 10: Backend Tests - 13/13 passed

Issues Found:
1. __________
2. __________

Overall Status: [ ] PASS [ ] FAIL

Notes:
__________
```

---

**All tests passing? 🎉 The feature is ready for production!**
