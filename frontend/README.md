# LTI Frontend

Frontend web application for LTI (Applicant Tracking System) built with React 18.x and TypeScript following DDD principles and Clean Architecture.

## Architecture

The project follows **Domain-Driven Design (DDD)** with a modular structure organized by bounded contexts.

### Design Principles

- **DDD (Domain-Driven Design)**: Modular organization by bounded contexts
- **Clean Architecture**: Separation of concerns with clear layers
- **TDD (Test-Driven Development)**: Tests alongside source code
- **Atomic Design**: Reusable component composition
- **Single Responsibility**: Each module has one clear purpose

## Tech Stack

- **React** 18.3.1 - UI library
- **TypeScript** 4.9.5 - Static typing
- **React Router** 6.x - Client-side routing
- **React Hook Form** 7.x + **Zod** - Form validation
- **react-hot-toast** - Notifications
- **Create React App** 5.0.1 - Build tooling
- **Jest** + **React Testing Library** - Testing

## Installation

```bash
npm install
```

## Available Scripts

- **npm start** - Development mode at http://localhost:3000
- **npm test** - Run tests with Jest
- **npm run build** - Production build
- **npm run format** - Format code with Prettier

## Internationalization (i18n)

The app supports **English (EN)** and **Spanish (ES)** with localStorage persistence.

## API Client

Centralized HTTP client in `src/shared/services/apiClient.ts` with RFC 7807 error handling.

## Testing

Tests colocated with source files. Target coverage: 70% (branches, functions, lines, statements).

---

**Version**: 1.0.0  
**License**: ISC
