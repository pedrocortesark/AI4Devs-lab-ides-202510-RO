# LTI - Applicant Tracking System (ATS)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.x-brightgreen)](https://nodejs.org/)
[![PostgreSQL Version](https://img.shields.io/badge/postgresql-16.x-blue)](https://www.postgresql.org/)
[![TypeScript](https://img.shields.io/badge/typescript-5.x-blue)](https://www.typescriptlang.org/)

**LTI** es un sistema de seguimiento de candidatos (ATS) construido con tecnologías modernas, siguiendo principios de **Domain-Driven Design (DDD)** y **Test-Driven Development (TDD)**.

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Stack Tecnológico](#-stack-tecnológico)
- [Arquitectura](#-arquitectura)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Scripts Disponibles](#-scripts-disponibles)
- [Guía de Desarrollo](#-guía-de-desarrollo)
- [Testing](#-testing)
- [Convenciones de Código](#-convenciones-de-código)
- [Variables de Entorno](#-variables-de-entorno)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

---

## ✨ Características

- 🎯 **Gestión de candidatos**: Crear, editar y rastrear candidatos
- 📄 **Gestión de documentos**: Upload de CV, cartas de presentación y portfolios (PDF)
- 🎓 **Historial educativo y laboral**: Registro completo de experiencia y educación
- 🌐 **Internacionalización**: Soporte EN/ES
- 🔍 **Búsquedas inteligentes**: Lookups para instituciones educativas, títulos profesionales
- ♿ **Accesibilidad**: Cumple con buenas prácticas de a11y
- 🔒 **Validación robusta**: Cliente y servidor con Zod
- 🧪 **Cobertura de tests**: TDD con Jest y Supertest

---

## 🛠 Stack Tecnológico

### **Backend**
- **Runtime**: Node.js >= 20.x
- **Framework**: Express 4.x
- **Lenguaje**: TypeScript 5.x (strict mode)
- **ORM**: Prisma 5.x
- **Base de datos**: PostgreSQL 16.x
- **Validación**: Zod
- **Logging**: Winston
- **Testing**: Jest + ts-jest + Supertest
- **Linting**: ESLint + Prettier

### **Frontend**
- **Framework**: React 18.x + TypeScript
- **Inicialización**: Create React App
- **Routing**: React Router v6
- **Formularios**: React Hook Form + Zod
- **Notificaciones**: react-hot-toast
- **Testing**: Jest + React Testing Library
- **Linting**: ESLint + Prettier

### **Infraestructura**
- **Contenedores**: Docker + Docker Compose
- **Base de datos**: PostgreSQL 16 (Alpine)

---

## 🏗 Arquitectura

### **Principios de Diseño**

1. **Domain-Driven Design (DDD)**: Estructura modular por contextos acotados
2. **Test-Driven Development (TDD)**: Tests junto al código
3. **SOLID**: Principios de diseño orientado a objetos
4. **Clean Architecture**: Separación de capas y dependencias

### **Arquitectura Modular (Backend)**

```
backend/src/
├── modules/                    # Contextos acotados (bounded contexts)
│   └── candidates/
│       ├── domain/            # Capa de dominio
│       │   ├── entities/      # Entidades de dominio
│       │   ├── valueObjects/  # Value objects
│       │   ├── repositories/  # Interfaces de repositorios
│       │   └── errors/        # Errores de dominio
│       ├── application/       # Capa de aplicación
│       │   ├── useCases/      # Casos de uso (comandos/queries)
│       │   ├── services/      # Servicios de aplicación
│       │   └── dtos/          # Data Transfer Objects
│       ├── infrastructure/    # Capa de infraestructura
│       │   ├── persistence/   # Implementaciones de repositorios
│       │   ├── mappers/       # Mappers dominio <-> persistencia
│       │   └── services/      # Servicios externos
│       └── interfaces/        # Capa de interfaces
│           ├── http/          # Controllers REST
│           ├── routes/        # Definición de rutas
│           └── validators/    # Schemas de validación (Zod)
├── shared/                    # Código compartido
│   ├── domain/               # Entidades base, tipos comunes
│   ├── infrastructure/       # DB config, logger, middlewares
│   └── interfaces/           # Utilidades HTTP, tipos
└── index.ts                  # Entry point
```

### **Flujo de Datos**

```
HTTP Request → Routes → Controller → Use Case → Repository → Database
                  ↓          ↓           ↓
              Validator   DTO      Domain Entity
```

---

## 📁 Estructura del Proyecto

```
lti-ats/
├── backend/                   # Aplicación backend (Express + TS)
│   ├── src/
│   │   ├── modules/          # Módulos DDD
│   │   ├── shared/           # Código compartido
│   │   └── index.ts
│   ├── prisma/
│   │   └── schema.prisma     # Schema de base de datos
│   ├── uploads/              # Archivos subidos (ignorado en git)
│   ├── package.json
│   ├── tsconfig.json
│   ├── jest.config.js
│   ├── .eslintrc.js
│   └── .prettierrc
│
├── frontend/                  # Aplicación frontend (React + TS)
│   ├── src/
│   │   ├── modules/          # Módulos de funcionalidad
│   │   ├── shared/           # Componentes y utilidades compartidas
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   └── jest.config.js
│
├── docker-compose.yml         # Configuración Docker (PostgreSQL)
├── .env.example               # Template de variables de entorno
├── .gitignore
├── LICENSE
├── VERSION
└── README.md
```

---

## 📦 Requisitos Previos

Asegúrate de tener instalados:

- **Node.js**: >= 20.x ([Descargar](https://nodejs.org/))
- **npm**: >= 10.x (incluido con Node.js)
- **Docker**: >= 24.x ([Descargar](https://www.docker.com/))
- **Docker Compose**: >= 2.x (incluido con Docker Desktop)
- **Git**: >= 2.x

**Verificar instalación:**

```bash
node --version    # >= v20.x
npm --version     # >= 10.x
docker --version  # >= 24.x
docker compose version  # >= 2.x
```

---

## 🚀 Instalación y Configuración

### **1. Clonar el repositorio**

```bash
git clone <repository-url>
cd lti-ats
```

### **2. Configurar variables de entorno**

```bash
# Copiar el template de variables de entorno
cp .env.example backend/.env
```

Edita `backend/.env` si necesitas cambiar valores por defecto.

### **3. Bootstrap automático (recomendado)**

Este script automatiza todo el proceso de configuración:

```bash
npm run bootstrap
```

**El script ejecuta:**
- Instalación de dependencias (backend + frontend)
- Levantamiento de PostgreSQL con Docker
- Generación de cliente Prisma
- Ejecución de migraciones
- Verificación de conexión a base de datos

### **4. Configuración manual (alternativa)**

Si prefieres ejecutar cada paso manualmente:

```bash
# 4.1. Levantar PostgreSQL
docker compose up -d

# 4.2. Instalar dependencias del backend
cd backend
npm install

# 4.3. Generar cliente Prisma
npx prisma generate

# 4.4. Ejecutar migraciones
npx prisma migrate dev

# 4.5. Instalar dependencias del frontend
cd ../frontend
npm install
```

---

## 🎮 Scripts Disponibles

### **Scripts Raíz (desde `/`)**

| Script | Descripción |
|--------|-------------|
| `npm run bootstrap` | Configuración automática completa del proyecto |
| `npm run dev` | Inicia backend y frontend en modo desarrollo |
| `npm run build` | Construye backend y frontend para producción |
| `npm run test` | Ejecuta todos los tests (backend + frontend) |
| `npm run clean` | Limpia node_modules y builds |
| `npm run db:up` | Levanta PostgreSQL con Docker |
| `npm run db:down` | Detiene PostgreSQL |
| `npm run db:reset` | Resetea la base de datos (borra datos) |
| `npm run db:logs` | Muestra logs del contenedor PostgreSQL |

### **Scripts Backend (`/backend`)**

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia servidor en modo desarrollo (hot reload) |
| `npm run build` | Compila TypeScript a JavaScript |
| `npm start` | Inicia servidor en producción (requiere build) |
| `npm test` | Ejecuta tests unitarios y de integración |
| `npm run test:watch` | Tests en modo watch |
| `npm run test:coverage` | Tests con reporte de cobertura |
| `npm run lint` | Ejecuta ESLint |
| `npm run lint:fix` | Corrige errores de linting automáticamente |
| `npm run format` | Formatea código con Prettier |
| `npm run prisma:generate` | Genera cliente Prisma |
| `npm run prisma:migrate` | Ejecuta migraciones de base de datos |
| `npm run prisma:studio` | Abre Prisma Studio (GUI para DB) |

### **Scripts Frontend (`/frontend`)**

| Script | Descripción |
|--------|-------------|
| `npm start` | Inicia app React en desarrollo (puerto 3000) |
| `npm run build` | Construye app para producción |
| `npm test` | Ejecuta tests de React |
| `npm run test:watch` | Tests en modo watch |
| `npm run test:coverage` | Tests con reporte de cobertura |
| `npm run lint` | Ejecuta ESLint |
| `npm run lint:fix` | Corrige errores de linting |
| `npm run format` | Formatea código con Prettier |

---

## 📘 Guía de Desarrollo

### **Iniciar el entorno de desarrollo**

```bash
# Terminal 1: Backend (puerto 3010)
cd backend
npm run dev

# Terminal 2: Frontend (puerto 3000)
cd frontend
npm start
```

**URLs disponibles:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3010/api
- Health check: http://localhost:3010/health
- Prisma Studio: `cd backend && npx prisma studio`

### **Flujo de trabajo TDD**

1. **Escribir el test** (red phase)
   ```bash
   # Crear archivo de test junto al código
   touch backend/src/modules/candidates/domain/entities/candidate.test.ts
   ```

2. **Escribir el código mínimo** (green phase)
   ```bash
   # Implementar funcionalidad para pasar el test
   ```

3. **Refactorizar** (refactor phase)
   ```bash
   # Mejorar código manteniendo tests pasando
   ```

4. **Verificar cobertura**
   ```bash
   npm run test:coverage
   ```

### **Crear un nuevo módulo (DDD)**

```bash
# Ejemplo: módulo "applications"
mkdir -p backend/src/modules/applications/{domain,application,infrastructure,interfaces}
mkdir -p backend/src/modules/applications/domain/{entities,valueObjects,repositories,errors}
mkdir -p backend/src/modules/applications/application/{useCases,services,dtos}
# ... continuar con subdirectorios
```

### **Trabajar con Prisma**

```bash
# Editar schema
nano backend/prisma/schema.prisma

# Crear migración
cd backend
npx prisma migrate dev --name add_new_model

# Regenerar cliente
npx prisma generate

# Abrir Prisma Studio (explorador visual)
npx prisma studio
```

### **Debugging**

**Backend (VS Code):**
1. Configurar `.vscode/launch.json`
2. Agregar breakpoints
3. Presionar F5

**Frontend (Chrome DevTools):**
1. Abrir http://localhost:3000
2. Abrir DevTools (F12)
3. Tab "Sources" → agregar breakpoints

---

## 🧪 Testing

### **Estrategia de Testing**

| Tipo | Herramienta | Ubicación | Cobertura |
|------|-------------|-----------|-----------|
| Unitarios | Jest | `*.test.ts` junto al código | Lógica de dominio, utils |
| Integración | Jest + Supertest | `*.test.ts` | Casos de uso, repositories |
| E2E | Supertest | `*.test.ts` | Rutas HTTP completas |
| Frontend | Jest + RTL | `*.test.tsx` | Componentes, hooks |

### **Ejecutar tests**

```bash
# Backend - Todos los tests
cd backend
npm test

# Backend - Con cobertura
npm run test:coverage

# Backend - Modo watch
npm run test:watch

# Frontend - Todos los tests
cd frontend
npm test

# Frontend - Con cobertura
npm run test:coverage
```

### **Estructura de un test**

```typescript
// backend/src/modules/candidates/domain/entities/candidate.test.ts
import { Candidate } from './candidate';

describe('Candidate Entity', () => {
  describe('create', () => {
    it('should create a valid candidate with required fields', () => {
      // Arrange
      const data = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com'
      };

      // Act
      const candidate = Candidate.create(data);

      // Assert
      expect(candidate.firstName).toBe('John');
      expect(candidate.email).toBe('john.doe@example.com');
    });

    it('should normalize email to lowercase', () => {
      // ...
    });
  });
});
```

---

## 📐 Convenciones de Código

### **Naming Conventions**

| Elemento | Convención | Ejemplo |
|----------|------------|---------|
| Archivos | camelCase | `candidateRepository.ts` |
| Clases | PascalCase + sufijo | `CandidateRepository` |
| Interfaces | PascalCase + prefijo I | `ICandidateRepository` |
| Types | PascalCase + sufijo | `CandidateDTO` |
| Funciones | camelCase | `createCandidate()` |
| Constantes | UPPER_SNAKE_CASE | `MAX_FILE_SIZE` |
| Variables | camelCase | `candidateData` |

### **Organización de imports**

```typescript
// 1. Librerías externas
import { Request, Response } from 'express';
import { z } from 'zod';

// 2. Módulos internos (alias @)
import { CreateCandidateUseCase } from '@modules/candidates/application/useCases/createCandidateUseCase';

// 3. Tipos e interfaces
import type { CandidateDTO } from '../dtos/candidateDTO';

// 4. Imports relativos
import { validateRequest } from '../../shared/validators';
```

### **Estructura de carpetas por módulo**

```
modules/candidates/
├── domain/
│   ├── entities/
│   │   ├── candidate.ts
│   │   └── candidate.test.ts
│   ├── valueObjects/
│   │   ├── email.ts
│   │   └── email.test.ts
│   └── repositories/
│       └── candidateRepository.interface.ts
├── application/
│   └── useCases/
│       ├── createCandidate/
│       │   ├── createCandidateUseCase.ts
│       │   └── createCandidateUseCase.test.ts
│       └── ...
└── ...
```

### **Comentarios y Documentación**

- Usar JSDoc para funciones públicas
- Comentarios inline solo para lógica compleja
- Evitar comentarios obvios

```typescript
/**
 * Creates a new candidate in the system
 * @param data - Candidate creation data
 * @returns Created candidate entity
 * @throws {ValidationError} If data is invalid
 * @throws {DuplicateEmailError} If email already exists
 */
export async function createCandidate(data: CreateCandidateDTO): Promise<Candidate> {
  // Implementation
}
```

---

## 🔐 Variables de Entorno

### **Backend (`backend/.env`)**

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://LTIdbUser:...@localhost:5432/LTIdb` |
| `PORT` | Puerto del servidor | `3010` |
| `NODE_ENV` | Entorno de ejecución | `development` |
| `CORS_ORIGIN` | Origen permitido para CORS | `http://localhost:3000` |
| `MAX_FILE_SIZE` | Tamaño máximo de archivo (bytes) | `10485760` (10MB) |
| `UPLOAD_DIR` | Directorio de uploads | `./uploads` |
| `LOG_LEVEL` | Nivel de logging | `info` |
| `LOG_REDACT_PII` | Redactar PII en logs | `true` |

### **Frontend**

Las variables del frontend se configuran en tiempo de build desde `.env` en la raíz de `/frontend`:

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `REACT_APP_API_URL` | URL del backend API | `http://localhost:3010/api` |

**⚠️ Importante**: Variables de React deben tener prefijo `REACT_APP_`

---

## 🤝 Contribución

### **Guía de Contribución**

1. **Fork** del repositorio
2. **Crear rama** de feature: `git checkout -b feature/nueva-funcionalidad`
3. **Escribir tests** primero (TDD)
4. **Implementar** la funcionalidad
5. **Verificar** linting y tests:
   ```bash
   npm run lint
   npm test
   ```
6. **Commit** con mensaje descriptivo:
   ```bash
   git commit -m "feat: add candidate search functionality"
   ```
7. **Push** a tu fork: `git push origin feature/nueva-funcionalidad`
8. **Crear Pull Request** con descripción detallada

### **Convención de Commits**

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Formato, espacios (no afecta código)
- `refactor:` Refactorización (no cambia funcionalidad)
- `test:` Agregar o modificar tests
- `chore:` Tareas de mantenimiento

---

## � Troubleshooting

### **PostgreSQL no inicia**

```bash
# Verificar logs
npm run db:logs

# Reiniciar contenedor
npm run db:reset
```

### **Error: Cannot find module '@prisma/client'**

```bash
# Regenerar cliente Prisma
npm run prisma:generate
```

### **Puertos ocupados**

Si los puertos 3000, 3010 o 5432 están en uso:

```bash
# Ver procesos usando puertos (Windows)
netstat -ano | findstr :3010

# Matar proceso (Windows)
taskkill /PID <pid> /F
```

### **Tests fallan**

```bash
# Limpiar y reinstalar
npm run clean
npm run bootstrap
```

### **Health Check**

Verifica que todos los servicios estén corriendo:

```bash
npm run health
```

---

## �📄 Licencia

Este proyecto está licenciado bajo la [Licencia MIT](./LICENSE).

Copyright (c) 2025 LTI Project

---

## 📞 Soporte

Para preguntas, problemas o sugerencias:
- Crear un [Issue](../../issues)
- Consultar la [documentación detallada](./docs)

---

**Hecho con ❤️ usando TypeScript, React, Express y PostgreSQL**
