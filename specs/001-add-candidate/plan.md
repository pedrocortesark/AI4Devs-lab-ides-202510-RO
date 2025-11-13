# Implementation Plan: Add Candidate to ATS

**Branch**: `001-add-candidate` | **Date**: 2025-11-13 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-add-candidate/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Como reclutador, necesito añadir candidatos al sistema ATS con información básica, experiencia laboral y educación, incluyendo la posibilidad de subir documentos CV. El sistema debe validar emails únicos, almacenar archivos en el sistema de ficheros con estructura UUID, y proporcionar una interfaz tipo Apple con color naranja como marca. La implementación seguirá arquitectura de tres capas con TypeScript full-stack, Prisma ORM para PostgreSQL, y React con formularios progresivos (disclosure).

## Technical Context

**Language/Version**: TypeScript 4.9.5 (frontend), TypeScript 4.9.5 (backend), Node.js 18+  
**Primary Dependencies**: React 18.3.1, Express 4.19.2, Prisma 5.13.0, Jest 29.7.0  
**Storage**: PostgreSQL 13+ via Docker (structured data), File system with UUID organization (CV documents)  
**Testing**: Jest 29+ for unit/integration tests (both frontend & backend)  
**Target Platform**: Web application (modern browsers), Docker-based development environment  
**Project Type**: Web (frontend + backend)  
**Performance Goals**: <200ms API response time for candidate creation, <3s full form submission with CV upload  
**Constraints**: Single-file CV uploads ≤10MB, email uniqueness enforced at DB level, CORS-protected API  
**Scale/Scope**: ~10-50 recruiters, thousands of candidates, basic ATS module (MVP scope)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence/Notes |
|-----------|--------|----------------|
| **I. Full-Stack Type Safety** | ✅ PASS | TypeScript 4.9.5 on frontend (React) and backend (Express). Prisma schema as single source of truth. API contracts with typed interfaces. |
| **II. Database-First Data Modeling** | ✅ PASS | Prisma schema defines Candidate, Education, WorkExperience, CVDocument models. Migration required before implementation. |
| **III. Three-Tier Separation** | ✅ PASS | React frontend → Express REST API → Prisma/PostgreSQL. No direct DB access from frontend. Business logic in backend services. |
| **IV. File Storage Strategy** | ✅ PASS | CV files stored at `uploads/cv/{candidateUUID}/{filename}`. Database stores metadata only (path, size, type, uploadDate). |
| **V. API Contract Discipline** | ✅ PASS | API contracts to be defined in Phase 1 (POST /api/candidates, POST /api/candidates/:id/cv, GET endpoints). OpenAPI/types documented. |
| **VI. User-Centric Validation** | ✅ PASS | Frontend validates required fields + formats before submission. Backend validates + sanitizes all inputs. Error messages in Spanish, user-friendly. |
| **VII. Test Coverage for Critical Paths** | ✅ PASS | Integration tests for API endpoints, file upload error scenarios, unique email constraint violation, transaction rollback on failures. |

**Overall Status**: ✅ ALL GATES PASSED - Proceed to Phase 0

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/          # Prisma client exports + domain types
│   ├── services/        # CandidateService (business logic), FileStorageService
│   ├── api/             # Express routes (/api/candidates)
│   ├── middleware/      # Validation, error handling, CORS
│   └── index.ts         # Express app setup
├── prisma/
│   ├── schema.prisma    # Candidate, Education, WorkExperience, CVDocument models
│   └── migrations/      # Database migrations
├── uploads/
│   └── cv/              # File storage: {candidateUUID}/{filename}
└── tests/
    ├── integration/     # API endpoint tests
    └── unit/            # Service layer tests

frontend/
├── src/
│   ├── components/      # CandidateForm, EducationFields, CVUpload
│   ├── pages/           # AddCandidatePage
│   ├── services/        # API client (candidateService.ts)
│   ├── types/           # Shared TypeScript interfaces
│   └── styles/          # Apple-inspired CSS with orange theme
└── tests/
    └── components/      # Component unit tests (React Testing Library)
```

**Structure Decision**: Web application structure selected (Option 2). Existing `backend/` and `frontend/` directories detected in workspace. This feature extends the existing structure by adding new models, API routes, and React components without requiring new project scaffolding.

## Complexity Tracking

**No violations detected** - All Constitution principles are satisfied by this feature design.

