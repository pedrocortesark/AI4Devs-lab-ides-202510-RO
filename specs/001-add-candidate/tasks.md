# Implementation Tasks: Add Candidate to ATS

**Feature**: 001-add-candidate | **Branch**: `001-add-candidate` | **Date**: 2025-11-13  
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

---

## Implementation Strategy

**MVP Scope**: User Story 1 + User Story 2 (Access function + Basic candidate information)

**Incremental Delivery**:
1. **MVP Release**: US1 + US2 - Recruiters can add candidates with basic info
2. **Enhancement 1**: US3 - Add CV upload capability
3. **Enhancement 2**: US4 - Add education and experience tracking

**Parallel Opportunities**:
- Backend and frontend tasks within each user story can be developed in parallel
- Independent user stories (US3, US4) can be developed in parallel after foundational work

---

## Phase 1: Setup & Infrastructure (Blocking)

**Goal**: Initialize project dependencies and shared infrastructure required by all user stories.

### Dependencies
```
npm install (backend)
  └─ multer, zod, @types/multer
npm install (frontend)
  └─ react-hook-form, @hookform/resolvers, zod
```

### Tasks

- [ ] T001 Install backend dependencies in backend/package.json (multer@^1.4.5-lts.1, @types/multer@^1.4.11, zod@^3.22.4)
- [ ] T002 Install frontend dependencies in frontend/package.json (react-hook-form@^7.51.0, @hookform/resolvers@^3.3.4, zod@^3.22.4)
- [ ] T003 Create TypeScript types file at backend/src/types/candidate.ts with Zod schemas (createCandidateSchema, educationSchema, workExperienceSchema)
- [ ] T004 Create TypeScript types file at frontend/src/types/candidate.ts with shared interfaces (Candidate, Education, WorkExperience, CVDocument, CreateCandidateRequest)
- [ ] T005 Create uploads directory structure at backend/uploads/cv/ with .gitkeep file
- [ ] T006 Update .gitignore to exclude backend/uploads/cv/* but include .gitkeep

---

## Phase 2: Foundational - Database & Core Services (Blocking)

**Goal**: Establish database schema and core backend services that all user stories depend on.

**Independent Test**: Can connect to database, run migration, and verify tables exist in Prisma Studio.

### Database Migration

- [ ] T007 Update Prisma schema at backend/prisma/schema.prisma to add Candidate model (id, firstName, lastName, email, phone, address, createdAt, updatedAt)
- [ ] T008 Update Prisma schema at backend/prisma/schema.prisma to add Education model (id, candidateId, institution, degree, fieldOfStudy, startDate, endDate, current, createdAt)
- [ ] T009 Update Prisma schema at backend/prisma/schema.prisma to add WorkExperience model (id, candidateId, company, position, description, startDate, endDate, current, createdAt)
- [ ] T010 Update Prisma schema at backend/prisma/schema.prisma to add CVDocument model (id, candidateId, filename, originalName, mimeType, sizeBytes, storagePath, uploadedAt)
- [ ] T011 Run Prisma migration command: npx prisma migrate dev --name add_candidate_management (from backend/ directory)
- [ ] T012 Verify migration success by running: npx prisma studio (check all 4 tables exist)

### Backend Core Services

- [ ] T013 [P] Create CandidateService class at backend/src/services/CandidateService.ts with create() method (accepts CreateCandidateRequest, returns Candidate with relations)
- [ ] T014 [P] Add findById() method to CandidateService at backend/src/services/CandidateService.ts (includes educations, workExperiences, cvDocument relations)
- [ ] T015 [P] Add findAll() method to CandidateService at backend/src/services/CandidateService.ts (returns candidates array and total count)

### API Error Handling

- [ ] T016 [P] Create error response utility at backend/src/utils/errorResponse.ts (standardized error format with code, message, timestamp)
- [ ] T017 [P] Create validation middleware at backend/src/middleware/validateRequest.ts (Zod schema validation with formatted error responses)

---

## Phase 3: User Story 1 - Access Add Candidate Function

**Goal**: Recruiters can navigate to the add candidate form from the dashboard.

**Priority**: P1 (MVP - MUST HAVE)

**Independent Test**: 
- Navigate to recruiter dashboard, verify "Añadir Candidato" button is visible
- Click button, verify navigation to /candidates/add route with empty form displayed
- Verify button is accessible from main navigation on all recruiter pages

**Dependencies**: None (independent of other stories)

### Frontend Navigation & Routing

- [ ] T018 [US1] Create AddCandidatePage component at frontend/src/pages/AddCandidatePage.tsx with route setup (/candidates/add)
- [ ] T019 [US1] Add navigation button/link to dashboard at frontend/src/components/Dashboard.tsx (label: "Añadir Candidato", orange button, navigates to /candidates/add)
- [ ] T020 [US1] Add "Añadir Candidato" link to main navigation component at frontend/src/components/Navigation.tsx (visible on all recruiter pages)

### Styling (Apple-inspired with Orange)

- [ ] T021 [P] [US1] Create design system CSS variables at frontend/src/styles/variables.css (orange primary colors, neutral grays, system fonts, spacing scale)
- [ ] T022 [P] [US1] Create button component styles at frontend/src/styles/Button.module.css (orange primary button, 44px height, 6px border-radius)

---

## Phase 4: User Story 2 - Enter Basic Candidate Information

**Goal**: Recruiters can create candidate records with name, email, phone, and address.

**Priority**: P1 (MVP - MUST HAVE)

**Independent Test**:
- Fill form with valid data (firstName, lastName, email, phone, address), submit
- Verify candidate appears in database with correct values
- Test validation errors for missing required fields (firstName, lastName, email)
- Test email format validation (invalid formats rejected)
- Test duplicate email detection (shows error with link to existing candidate)
- Test character limit validation (100/255/500 chars)

**Dependencies**: Phase 2 (database + services), Phase 3 (navigation)

### Backend API - Create Candidate

- [ ] T023 [US2] Create candidateRoutes.ts at backend/src/api/candidateRoutes.ts with POST /api/candidates endpoint
- [ ] T024 [US2] Implement POST /api/candidates route handler (validates with createCandidateSchema, calls CandidateService.create(), returns 201 with candidate)
- [ ] T025 [US2] Add duplicate email error handling in POST /api/candidates (catch Prisma P2002 error, return 409 with "EMAIL_DUPLICATE" code)
- [ ] T026 [US2] Add validation error handling in POST /api/candidates (catch Zod errors, return 400 with "VALIDATION_ERROR" and details array)

### Backend API - Get Candidate

- [ ] T027 [P] [US2] Implement GET /api/candidates/:candidateId route in backend/src/api/candidateRoutes.ts (calls CandidateService.findById(), returns 200 or 404)
- [ ] T028 [P] [US2] Implement GET /api/candidates route in backend/src/api/candidateRoutes.ts (calls CandidateService.findAll(), returns list and total)

### Backend Integration

- [ ] T029 [US2] Register candidateRoutes in Express app at backend/src/index.ts (app.use('/api/candidates', candidateRoutes))
- [ ] T030 [US2] Verify CORS configuration in backend/src/index.ts (allows frontend origin http://localhost:3000)

### Frontend API Service

- [ ] T031 [P] [US2] Create candidateService at frontend/src/services/candidateService.ts with create() method (POST to /api/candidates)
- [ ] T032 [P] [US2] Add getById() method to candidateService at frontend/src/services/candidateService.ts (GET /api/candidates/:id)
- [ ] T033 [P] [US2] Add getAll() method to candidateService at frontend/src/services/candidateService.ts (GET /api/candidates)

### Frontend Form Component

- [ ] T034 [US2] Create CandidateForm component at frontend/src/components/CandidateForm.tsx with React Hook Form setup (zodResolver, createCandidateSchema)
- [ ] T035 [US2] Add basic info fields to CandidateForm (firstName, lastName, email, phone, address inputs with labels in Spanish)
- [ ] T036 [US2] Implement form submission handler in CandidateForm (calls candidateService.create(), shows success toast, navigates to candidate detail)
- [ ] T037 [US2] Add validation error display in CandidateForm (shows field-specific error messages below inputs in red)
- [ ] T038 [US2] Add duplicate email error handling in CandidateForm (catch 409 response, display "Este email ya está registrado" with link to existing candidate)
- [ ] T039 [US2] Add server error handling in CandidateForm (catch 500 response, display "Error al guardar candidato. Intenta de nuevo" with retry button)

### Frontend Styling

- [ ] T040 [P] [US2] Style CandidateForm component at frontend/src/components/CandidateForm.module.css (Apple-inspired layout, 44px input height, 6px border-radius)
- [ ] T041 [P] [US2] Style form inputs at frontend/src/styles/Input.module.css (border, focus states with orange outline, error states in red)
- [ ] T042 [P] [US2] Create disclosure/details styling at frontend/src/styles/Disclosure.module.css (collapsible sections with arrow icon)

### Integration

- [ ] T043 [US2] Import and render CandidateForm in AddCandidatePage at frontend/src/pages/AddCandidatePage.tsx
- [ ] T044 [US2] Test end-to-end flow: navigate to form → fill basic info → submit → verify candidate in database → verify success message

---

## Phase 5: User Story 3 - Upload Candidate CV

**Goal**: Recruiters can upload PDF or DOCX CV files for candidates (max 10MB).

**Priority**: P2 (Enhancement - SHOULD HAVE)

**Independent Test**:
- Create candidate via API or form (US2)
- Upload valid PDF file, verify file saved to backend/uploads/cv/{candidateId}/
- Upload valid DOCX file, verify success
- Test file type validation (reject .exe, .jpg)
- Test file size validation (reject files > 10MB)
- Test duplicate CV error (candidate already has CV)

**Dependencies**: Phase 2 (database), US2 (candidate must exist before CV upload)

### Backend File Upload

- [ ] T045 [US3] Create uploadCV middleware at backend/src/middleware/uploadCV.ts with Multer configuration (diskStorage, fileFilter for PDF/DOC/DOCX, 10MB limit)
- [ ] T046 [US3] Implement uploadCV storage destination function (creates backend/uploads/cv/{candidateId}/ directory)
- [ ] T047 [US3] Implement uploadCV filename generator (format: cv-{timestamp}-{uuid}.{ext})
- [ ] T048 [US3] Add uploadCV() method to CandidateService at backend/src/services/CandidateService.ts (creates CVDocument record with file metadata)

### Backend API - CV Upload

- [ ] T049 [US3] Implement POST /api/candidates/:candidateId/cv route in backend/src/api/candidateRoutes.ts (uses uploadCV.single('cv') middleware)
- [ ] T050 [US3] Add candidate existence check in POST /api/candidates/:candidateId/cv (return 404 if not found, clean up uploaded file)
- [ ] T051 [US3] Add duplicate CV check in POST /api/candidates/:candidateId/cv (return 409 if CV exists, clean up uploaded file)
- [ ] T052 [US3] Add file upload error handling (catch INVALID_FILE_TYPE, FILE_TOO_LARGE errors, return 400 with Spanish messages)

### Frontend File Upload

- [ ] T053 [P] [US3] Create CVUpload component at frontend/src/components/CVUpload.tsx with file input (accept=".pdf,.doc,.docx")
- [ ] T054 [P] [US3] Add client-side file validation in CVUpload (check file type and size < 10MB before upload)
- [ ] T055 [P] [US3] Add uploadCV() method to candidateService at frontend/src/services/candidateService.ts (FormData POST to /api/candidates/:id/cv)
- [ ] T056 [P] [US3] Implement file upload handler in CVUpload (calls candidateService.uploadCV(), shows progress, handles errors)
- [ ] T057 [P] [US3] Add CV upload error handling in CVUpload (display user-friendly messages for 404, 409, 400, 500 errors)

### Integration

- [ ] T058 [US3] Add CVUpload component to CandidateForm at frontend/src/components/CandidateForm.tsx (optional section, displayed after candidate created)
- [ ] T059 [US3] Test CV upload flow: create candidate → upload PDF → verify file in uploads/cv/ → verify database record
- [ ] T060 [US3] Test CV upload error scenarios: invalid file type → file too large → duplicate CV → candidate not found

---

## Phase 6: User Story 4 - Enter Education and Experience

**Goal**: Recruiters can add multiple education and work experience entries for candidates.

**Priority**: P3 (Enhancement - NICE TO HAVE)

**Independent Test**:
- Create candidate via API or form (US2)
- Add 2 education entries (institution, degree, dates), submit, verify in database
- Add 3 work experience entries (company, position, dates), submit, verify in database
- Test validation for required fields (institution, degree, company, position)
- Verify multiple entries can be added/removed dynamically in form

**Dependencies**: Phase 2 (database), US2 (candidate must exist)

### Frontend Education Fields

- [ ] T061 [P] [US4] Create EducationFields component at frontend/src/components/EducationFields.tsx using useFieldArray (institution, degree, fieldOfStudy, startDate, endDate, current checkbox)
- [ ] T062 [P] [US4] Add "Agregar Educación" button to EducationFields (appends new empty education entry)
- [ ] T063 [P] [US4] Add remove button to each education entry in EducationFields (removes entry from array)
- [ ] T064 [P] [US4] Add date validation in EducationFields (startDate < endDate, endDate disabled if current=true)

### Frontend Work Experience Fields

- [ ] T065 [P] [US4] Create WorkExperienceFields component at frontend/src/components/WorkExperienceFields.tsx using useFieldArray (company, position, description, startDate, endDate, current checkbox)
- [ ] T066 [P] [US4] Add "Agregar Experiencia" button to WorkExperienceFields (appends new empty work entry)
- [ ] T067 [P] [US4] Add remove button to each work experience entry in WorkExperienceFields (removes entry from array)
- [ ] T068 [P] [US4] Add date validation in WorkExperienceFields (startDate < endDate, endDate disabled if current=true)

### Integration

- [ ] T069 [US4] Add EducationFields to CandidateForm at frontend/src/components/CandidateForm.tsx (collapsible section labeled "Educación")
- [ ] T070 [US4] Add WorkExperienceFields to CandidateForm at frontend/src/components/CandidateForm.tsx (collapsible section labeled "Experiencia Laboral")
- [ ] T071 [US4] Update form submission in CandidateForm to include educations and workExperiences arrays
- [ ] T072 [US4] Test education flow: add 2 education entries → submit → verify saved in database with correct candidateId
- [ ] T073 [US4] Test work experience flow: add 3 work entries → submit → verify saved in database with correct candidateId

---

## Phase 7: Testing & Quality Assurance

**Goal**: Ensure feature stability and correctness through automated tests.

**Note**: Constitution VII requires test coverage for critical paths.

### Backend Integration Tests

- [ ] T074 [P] Create test file at backend/src/tests/integration/candidateRoutes.test.ts with Jest/Supertest setup
- [ ] T075 [P] Write test "should create candidate with valid data" in candidateRoutes.test.ts (POST /api/candidates with valid payload, expect 201)
- [ ] T076 [P] Write test "should reject duplicate email" in candidateRoutes.test.ts (create candidate, attempt duplicate, expect 409)
- [ ] T077 [P] Write test "should reject invalid email format" in candidateRoutes.test.ts (POST with invalid email, expect 400)
- [ ] T078 [P] Write test "should reject missing required fields" in candidateRoutes.test.ts (POST without firstName, expect 400)
- [ ] T079 [P] Write test "should upload valid PDF" in candidateRoutes.test.ts (POST /api/candidates/:id/cv with PDF, expect 200)
- [ ] T080 [P] Write test "should reject file > 10MB" in candidateRoutes.test.ts (POST with large file, expect 400)
- [ ] T081 [P] Write test "should reject invalid file type" in candidateRoutes.test.ts (POST with .exe file, expect 400)
- [ ] T082 [P] Write test "should return 404 for non-existent candidate" in candidateRoutes.test.ts (GET /api/candidates/invalid-uuid, expect 404)

### Frontend Component Tests

- [ ] T083 [P] Create test file at frontend/src/tests/components/CandidateForm.test.tsx with React Testing Library setup
- [ ] T084 [P] Write test "should show validation errors for required fields" in CandidateForm.test.tsx (submit empty form, expect error messages)
- [ ] T085 [P] Write test "should call API on valid submission" in CandidateForm.test.tsx (fill form, submit, verify candidateService.create called)
- [ ] T086 [P] Write test "should display duplicate email error" in CandidateForm.test.tsx (mock 409 response, verify error message shown)
- [ ] T087 [P] Write test "should allow adding multiple education entries" in CandidateForm.test.tsx (click "Agregar Educación" twice, verify 2 entries)

### Test Execution

- [ ] T088 Run backend tests: cd backend && npm test (verify all tests pass)
- [ ] T089 Run frontend tests: cd frontend && npm test (verify all tests pass)

---

## Phase 8: Polish & Cross-Cutting Concerns

**Goal**: Final refinements, performance optimization, and documentation.

### Performance & Optimization

- [ ] T090 [P] Add loading states to CandidateForm at frontend/src/components/CandidateForm.tsx (disable submit button during API call, show spinner)
- [ ] T091 [P] Add toast notifications at frontend/src/components/Toast.tsx (success: "Candidato guardado", error: "Error al guardar")
- [ ] T092 [P] Implement unsaved changes warning in CandidateForm (warn user before navigating away with unsaved data)

### Documentation

- [ ] T093 [P] Update backend README at backend/README.md with candidate API endpoints documentation
- [ ] T094 [P] Update frontend README at frontend/README.md with CandidateForm component usage documentation
- [ ] T095 [P] Add inline code comments to CandidateService at backend/src/services/CandidateService.ts (method descriptions, error handling notes)

### Accessibility

- [ ] T096 [P] Add ARIA labels to CandidateForm inputs at frontend/src/components/CandidateForm.tsx (aria-label, aria-describedby for errors)
- [ ] T097 [P] Ensure keyboard navigation works in CandidateForm (tab order, Enter to submit, Escape to clear)

---

## Dependencies & Execution Order

### Story Completion Order

```
Phase 1 (Setup)
  ↓
Phase 2 (Foundational)
  ↓
Phase 3 (US1: Access Function) ──→ Independent, can start after Phase 2
  ↓
Phase 4 (US2: Basic Info) ──→ Depends on US1 (navigation)
  ↓
  ├──→ Phase 5 (US3: CV Upload) ──→ Depends on US2 (candidate must exist)
  └──→ Phase 6 (US4: Education/Experience) ──→ Depends on US2 (candidate must exist)
       ↓
     Phase 7 (Testing) ──→ Can run incrementally after each phase
       ↓
     Phase 8 (Polish) ──→ Final refinements
```

### Parallel Execution Opportunities

**Within US2** (after foundational phase):
```
Backend Tasks (T023-T030)  ||  Frontend Service (T031-T033)  ||  Frontend Styling (T040-T042)
         ↓                           ↓                               ↓
    Frontend Form Component (T034-T039) + Integration (T043-T044)
```

**After US2 Complete**:
```
US3 (CV Upload: T045-T060)  ||  US4 (Education/Experience: T061-T073)
         ↓                              ↓
         └──────── Testing (T074-T089) ────────┘
                         ↓
                   Polish (T090-T097)
```

---

## Task Summary

- **Total Tasks**: 97
- **Phase 1 (Setup)**: 6 tasks
- **Phase 2 (Foundational)**: 11 tasks
- **Phase 3 (US1)**: 5 tasks
- **Phase 4 (US2)**: 22 tasks
- **Phase 5 (US3)**: 16 tasks
- **Phase 6 (US4)**: 13 tasks
- **Phase 7 (Testing)**: 16 tasks
- **Phase 8 (Polish)**: 8 tasks

**Parallelizable Tasks**: 42 tasks marked with [P]

**MVP Scope** (US1 + US2): 44 tasks (Phases 1-4)  
**Enhancement 1** (US3): +16 tasks  
**Enhancement 2** (US4): +13 tasks  
**Quality Assurance**: +24 tasks (testing + polish)

---

## Validation Checklist

✅ All tasks follow format: `- [ ] [TaskID] [P?] [Story?] Description with file path`  
✅ Tasks organized by user story (US1, US2, US3, US4)  
✅ Each user story has independent test criteria  
✅ Dependencies clearly documented  
✅ Parallel opportunities identified (42 tasks)  
✅ MVP scope defined (US1 + US2)  
✅ File paths specified for all implementation tasks  
✅ Setup and foundational phases precede user stories  
✅ Polish phase at the end for cross-cutting concerns  
✅ Constitution compliance (all 7 principles satisfied)
