<!--
Sync Impact Report:
- Version change: Template → 1.0.0
- Modified principles: N/A (initial constitution)
- Added sections: Core Principles (7), Technology Stack, Data & Security Standards, Development Workflow, Governance
- Removed sections: None
- Templates status:
  ✅ plan-template.md - compatible with principles
  ✅ spec-template.md - aligned with user story requirements
  ✅ tasks-template.md - aligned with phased approach
  ⚠ No commands directory found - guidance embedded in templates
- Follow-up TODOs: None
-->

# LTI Talent Tracking System Constitution

## Core Principles

### I. Full-Stack Type Safety (NON-NEGOTIABLE)
TypeScript MUST be used across the entire stack—frontend, backend, and shared types.

**Rationale**: Type safety prevents runtime errors, enables better tooling support, and creates self-documenting code. Given the sensitive nature of candidate data, type checking is a critical safety mechanism.

**Rules**:
- No JavaScript files in production code (only .ts/.tsx)
- Prisma schema defines single source of truth for data types
- API contracts must have TypeScript interfaces
- Frontend components must have typed props

### II. Database-First Data Modeling
All data changes MUST start with Prisma schema updates and migrations.

**Rationale**: Database migrations provide version control for data structure changes and ensure consistency across environments.

**Rules**:
- Schema changes require explicit migrations
- Never modify database directly
- Migration naming must include descriptive purpose
- Rollback strategy documented for each migration

### III. Three-Tier Separation
Clear separation MUST exist between presentation (React), application (Express), and data (PostgreSQL) layers.

**Rationale**: Separation of concerns enables independent scaling, testing, and maintenance of each tier.

**Rules**:
- Frontend communicates ONLY via REST API
- Backend business logic separated from API routes
- Database access ONLY through Prisma client
- No direct SQL queries in application code

### IV. File Storage Strategy
Document uploads (CVs, resumes) MUST be stored in the file system with UUID-based organization.

**Rationale**: Blob storage in databases causes performance issues; file system provides better scalability and enables CDN integration.

**Rules**:
- File path pattern: `uploads/{entity-type}/{uuid}/{filename}`
- Database stores only file metadata and paths
- File validation before storage (type, size, virus scan)
- Cleanup procedures for orphaned files

### V. API Contract Discipline
All API endpoints MUST have explicit contracts defined before implementation.

**Rationale**: Contract-first design prevents integration issues and enables parallel frontend/backend development.

**Rules**:
- OpenAPI/Swagger documentation for all endpoints
- Request/response types explicitly defined
- Error responses documented with status codes
- Versioning strategy for breaking changes

### VI. User-Centric Validation
All data validation MUST happen at both frontend and backend with user-friendly error messages.

**Rationale**: Frontend validation provides immediate feedback; backend validation ensures data integrity even with API abuse.

**Rules**:
- Required field validation on both tiers
- Format validation (email, phone, etc.) with clear rules
- File upload validation (type, size) before transmission
- Error messages in user's language, not technical jargon

### VII. Test Coverage for Critical Paths
Business-critical operations MUST have test coverage before production deployment.

**Rationale**: Candidate data management is mission-critical; failures damage user trust and business operations.

**Rules**:
- API endpoints require integration tests
- Database operations require transaction tests
- File uploads require error scenario tests
- Critical user journeys require end-to-end tests

## Technology Stack

### Required Technologies
- **Frontend**: React 18+ with TypeScript 4.9+
- **Backend**: Express 4+ with TypeScript 4.9+
- **Database**: PostgreSQL 13+ via Docker
- **ORM**: Prisma 5+
- **Testing**: Jest 29+ for both frontend and backend
- **Build**: TypeScript compiler, react-scripts

### Port Allocation
- **3000**: Frontend development server
- **3010**: Backend API server
- **5432**: PostgreSQL database

### Environment Management
- All configuration via environment variables
- `.env` files for local development (never committed)
- Different configurations for dev/staging/production
- Sensitive data (passwords, keys) never hardcoded

## Data & Security Standards

### Data Privacy
- Candidate personal data treated as sensitive
- Minimal data collection principle
- GDPR-conscious design (right to delete, data portability)
- Access logs for audit trails

### File Security
- File type validation against whitelist
- File size limits enforced
- Virus scanning for uploads (future requirement)
- Secure file serving (no directory traversal)

### API Security
- Input sanitization for all user data
- Protection against SQL injection (Prisma provides this)
- CORS configuration for frontend domain only
- Rate limiting on API endpoints (future requirement)

## Development Workflow

### Feature Development Process
1. **Specification**: Create detailed user stories with acceptance criteria
2. **Data Modeling**: Design Prisma schema and create migration
3. **API Contract**: Define OpenAPI specification for endpoints
4. **Backend First**: Implement and test backend endpoints
5. **Frontend Second**: Build UI consuming tested API
6. **Integration Testing**: Verify complete user journey
7. **Documentation**: Update README and API docs

### Code Quality Gates
- TypeScript compilation must succeed (no errors, minimal warnings)
- Linting passes (ESLint + Prettier)
- Existing tests pass before new code merges
- Code review required for database schema changes
- Manual testing of UI flows before deployment

### Branch Strategy
- `main`: Production-ready code
- `dev`: Integration branch for features
- Feature branches: `###-feature-name` format
- Database migrations committed to feature branches

## Governance

### Amendment Process
Constitution changes require:
1. Documented rationale for change
2. Version bump following semantic versioning
3. Impact assessment on existing code
4. Migration plan if breaking changes
5. Update to all dependent templates and documentation

### Compliance Enforcement
- All feature specifications must reference constitution principles
- Implementation plans must include "Constitution Check" section
- Code reviews verify adherence to architecture principles
- Exceptions require documented justification in plan

### Versioning Policy
- **MAJOR**: Breaking changes to architecture (e.g., switching from REST to GraphQL)
- **MINOR**: New principles added or existing principles significantly expanded
- **PATCH**: Clarifications, examples added, typo fixes

### Complexity Justification
Any violation of principles must include:
- Clear rationale in implementation plan
- Risk assessment
- Alternative approaches considered
- Mitigation strategy

**Version**: 1.0.0 | **Ratified**: 2025-11-13 | **Last Amended**: 2025-11-13
