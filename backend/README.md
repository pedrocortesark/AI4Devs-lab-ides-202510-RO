# LTI Backend - API REST

Backend del sistema LTI (Applicant Tracking System) construido con Node.js, Express, TypeScript, Prisma y PostgreSQL siguiendo principios de Domain-Driven Design (DDD) y Test-Driven Development (TDD).

---

## 🏗 Arquitectura

### **Principios de Diseño**

- **Domain-Driven Design (DDD)**: Estructura modular por contextos acotados
- **Test-Driven Development (TDD)**: Tests junto al código fuente
- **SOLID**: Principios de diseño orientado a objetos
- **Clean Architecture**: Separación clara de capas

### **Estructura de Capas**

```
src/
├── modules/                    # Contextos acotados (bounded contexts)
│   └── candidates/            # Módulo de candidatos
│       ├── domain/            # Lógica de negocio pura
│       ├── application/       # Casos de uso
│       ├── infrastructure/    # Implementaciones técnicas
│       └── interfaces/        # Controllers y rutas HTTP
│
├── shared/                    # Código compartido entre módulos
│   ├── domain/               # Entidades base, errores de dominio
│   ├── infrastructure/       # DB, logger, middlewares
│   └── interfaces/           # Tipos HTTP, controladores compartidos
│
├── app.ts                    # Configuración de Express
└── index.ts                  # Entry point
```

---

## 🚀 Inicio Rápido

### **Prerrequisitos**

- Node.js >= 20.x
- npm >= 10.x
- Docker & Docker Compose (para PostgreSQL)
- PostgreSQL 16.x (via Docker)

### **Instalación**

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp ../.env.example .env

# 3. Levantar PostgreSQL con Docker (desde raíz)
cd ..
docker compose up -d

# 4. Generar cliente Prisma
cd backend
npx prisma generate

# 5. Ejecutar migraciones
npx prisma migrate dev

# 6. Iniciar servidor en desarrollo
npm run dev
```

El servidor estará disponible en: **http://localhost:3010**

---

## 📜 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia servidor en modo desarrollo con hot-reload |
| `npm run build` | Compila TypeScript a JavaScript |
| `npm start` | Inicia servidor desde build (producción) |
| `npm test` | Ejecuta todos los tests |
| `npm run test:watch` | Tests en modo watch |
| `npm run test:coverage` | Genera reporte de cobertura |
| `npm run lint` | Verifica código con ESLint |
| `npm run lint:fix` | Corrige errores de linting automáticamente |
| `npm run format` | Formatea código con Prettier |
| `npm run prisma:generate` | Genera cliente Prisma |
| `npm run prisma:migrate` | Crea y aplica migraciones |
| `npm run prisma:studio` | Abre Prisma Studio (GUI) |
| `npm run prisma:reset` | Resetea base de datos |

---

## 🧪 Testing

### **Estrategia de Testing**

- **Unitarios**: Lógica de dominio, value objects, servicios
- **Integración**: Casos de uso, repositorios con DB
- **E2E**: Rutas HTTP completas con Supertest

### **Ejecutar Tests**

```bash
# Todos los tests
npm test

# Con cobertura
npm run test:coverage

# Modo watch (detecta cambios)
npm run test:watch

# Test específico
npm test -- healthController.test.ts
```

### **Ubicación de Tests**

Los tests están junto al código fuente:

```
src/
├── shared/
│   ├── domain/
│   │   └── baseEntity.ts
│   │   └── baseEntity.test.ts        ← Test unitario
│   └── interfaces/
│       └── http/
│           └── controllers/
│               ├── healthController.ts
│               └── healthController.test.ts  ← Test unitario + E2E
```

---

## 🗄 Base de Datos

### **Prisma**

Usamos Prisma como ORM para PostgreSQL.

#### **Comandos Útiles**

```bash
# Generar cliente después de cambios en schema
npx prisma generate

# Crear nueva migración
npx prisma migrate dev --name nombre_descriptivo

# Aplicar migraciones en producción
npx prisma migrate deploy

# Abrir Prisma Studio (explorador visual)
npx prisma studio

# Resetear base de datos (⚠️ borra datos)
npx prisma migrate reset
```

#### **Schema**

El schema está en `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// Modelos...
```

---

## 🔐 Variables de Entorno

Crea un archivo `.env` basado en `.env.example`:

```bash
# Database
DATABASE_URL="postgresql://LTIdbUser:D1ymf8wyQEGthFR1E9xhCq@localhost:5432/LTIdb"

# Server
PORT=3010
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:3000

# Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads

# Logging
LOG_LEVEL=info
LOG_REDACT_PII=true
```

---

## 🛣 Rutas API

### **Health Check**

```http
GET /health
```

**Respuesta exitosa (200):**

```json
{
  "status": "healthy",
  "timestamp": "2025-11-11T10:30:00.000Z",
  "service": "lti-backend",
  "version": "1.0.0",
  "uptime": 123.45,
  "database": "connected",
  "responseTime": "15ms"
}
```

---

## 📐 Convenciones de Código

### **Naming**

- **Archivos**: `camelCase.ts` (ej: `candidateRepository.ts`)
- **Clases**: `PascalCase` + sufijo (ej: `CandidateRepository`)
- **Interfaces**: `PascalCase` + prefijo I (ej: `ICandidateRepository`)
- **Funciones**: `camelCase` (ej: `createCandidate()`)
- **Constantes**: `UPPER_SNAKE_CASE` (ej: `MAX_FILE_SIZE`)

### **Imports**

```typescript
// 1. Librerías externas
import express from 'express';

// 2. Alias de módulos (@modules, @shared)
import { CandidateRepository } from '@modules/candidates/infrastructure/persistence/candidateRepository';

// 3. Tipos
import type { CandidateDTO } from '../dtos/candidateDTO';

// 4. Relativos
import { logger } from '../../infrastructure/logger/logger';
```

### **Estructura DDD por Módulo**

```
modules/candidates/
├── domain/                    # 📦 Capa de Dominio
│   ├── entities/             # Entidades de negocio
│   ├── valueObjects/         # Value objects inmutables
│   ├── repositories/         # Interfaces de repositorios
│   └── errors/               # Errores específicos del dominio
│
├── application/              # 🎯 Capa de Aplicación
│   ├── useCases/            # Casos de uso (comandos/queries)
│   ├── services/            # Servicios de aplicación
│   └── dtos/                # Data Transfer Objects
│
├── infrastructure/           # 🔧 Capa de Infraestructura
│   ├── persistence/         # Implementaciones de repositorios
│   ├── mappers/             # Conversión entidad ↔ modelo Prisma
│   └── services/            # Servicios externos (email, storage)
│
└── interfaces/               # 🌐 Capa de Interfaces
    ├── http/                # Controllers REST
    ├── routes/              # Definición de rutas Express
    └── validators/          # Validación con Zod
```

---

## 🐛 Debugging

### **VS Code**

Crea `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "console": "integratedTerminal",
      "skipFiles": ["<node_internals>/**"],
      "restart": true
    }
  ]
}
```

### **Logs**

El sistema usa Winston para logging:

```typescript
import { logger } from '@shared/infrastructure/logger/logger';

logger.info('Mensaje informativo');
logger.error('Error ocurrido', { context: 'extra' });
logger.warn('Advertencia');
logger.debug('Debug info'); // Solo en desarrollo
```

**PII Redaction**: Campos sensibles (`email`, `phone`, `password`) se redactan automáticamente cuando `LOG_REDACT_PII=true`.

---

## 🚢 Deployment

### **Build para Producción**

```bash
# 1. Compilar TypeScript
npm run build

# 2. Aplicar migraciones
npx prisma migrate deploy

# 3. Generar cliente Prisma
npx prisma generate

# 4. Iniciar servidor
NODE_ENV=production npm start
```

### **Variables de Entorno en Producción**

Asegúrate de configurar:

- `NODE_ENV=production`
- `DATABASE_URL` (URL real de PostgreSQL)
- `LOG_LEVEL=warn`
- `CORS_ORIGIN` (dominio del frontend)

---

## 📚 Recursos

- [Prisma Docs](https://www.prisma.io/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [DDD by Eric Evans](https://www.domainlanguage.com/ddd/)
- [Clean Architecture by Robert Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

---

## 🤝 Contribución

1. Escribir tests primero (TDD)
2. Implementar funcionalidad
3. Verificar linting: `npm run lint`
4. Ejecutar tests: `npm test`
5. Formatear código: `npm run format`

---

**Desarrollado con ❤️ usando TypeScript, Express y Prisma**
