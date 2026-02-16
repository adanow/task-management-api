# Task Management API

## Project Overview
Learning project — REST API for task management built with Node.js, Express and TypeScript.

## Tech Stack
- Node.js + TypeScript (strict mode)
- Express 5
- Prisma 7 ORM + SQLite (via @prisma/adapter-libsql)
- JWT authentication (jsonwebtoken + bcrypt)
- Zod v4 for request validation
- Jest + Supertest for testing
- ESLint + Prettier for code quality

## Commands
- `npm run dev` — start dev server with auto-reload (nodemon + ts-node)
- `npm run build` — compile TypeScript to JavaScript
- `npm start` — run compiled JS from dist/
- `npm test` — run all tests with Jest (sequential, maxWorkers: 1)
- `npx tsc --noEmit` — type-check without emitting files
- `npm run lint` — run ESLint
- `npm run lint:fix` — run ESLint with auto-fix
- `npm run format` — format code with Prettier
- `npm run format:check` — check formatting without changes
- `npx prisma migrate dev --name <name>` — create and run database migration
- `npx prisma generate` — regenerate Prisma client (run after schema changes)

## Project Structure
```
src/
├── app.ts                 — Express app configuration (middleware, routes)
├── index.ts               — Entry point (starts the server)
├── routes/
│   ├── tasks.ts           — Task route definitions (all protected by auth middleware)
│   └── auth.ts            — Auth routes (register, login)
├── controllers/
│   ├── tasksController.ts — Task CRUD logic (async/await, scoped to userId)
│   └── authController.ts  — Register + login logic (bcrypt, JWT)
├── middleware/
│   ├── auth.ts            — JWT verification middleware (sets req.userId)
│   └── errorHandler.ts    — Global error handler (returns JSON, not HTML)
├── schemas/
│   ├── taskSchema.ts      — Zod schemas for create/update task
│   └── authSchema.ts      — Zod schema for register/login
├── types/
│   └── express.d.ts       — Declaration merging (adds userId to Request)
├── lib/
│   └── prisma.ts          — Prisma client singleton (with libsql adapter)
└── generated/
    └── prisma/            — Auto-generated Prisma client (gitignored)
tests/
├── health.test.ts         — Health check endpoint test (1 test)
├── tasks.test.ts          — Task CRUD tests with auth (12 tests)
└── auth.test.ts           — Register + login tests (7 tests)
prisma/
├── schema.prisma          — Database schema (User + Task models)
└── migrations/            — Database migration files
```

## Conventions
- Language: TypeScript (strict mode), CommonJS modules
- Architecture: routes → middleware → controllers → Prisma
- Use Express Router for grouping endpoints per resource
- Controllers use async/await for database operations
- Controllers use try/catch for Prisma errors (update, delete throw on missing record)
- HTTP status codes: 200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized, 404 Not Found, 409 Conflict
- Validate request body with Zod schemas (safeParse + issues[0].message)
- Validate req.params.id with Number() + isNaN() — return 400 for invalid IDs
- Tasks are scoped to authenticated user (userId from JWT token)
- Prisma client is a singleton (one instance in lib/prisma.ts)
- JWT secret from env: process.env.JWT_SECRET || "dev-secret"
- ESLint rules: no-var, prefer-const, eqeqeq, no-explicit-any (warn), explicit-function-return-type (warn)
- Prettier: double quotes, semicolons, trailing commas, 100 char width

## Authentication Flow
1. `POST /auth/register` — validate with Zod, hash password with bcrypt, create user
2. `POST /auth/login` — validate, find user, compare password, return JWT token
3. Protected routes use `auth` middleware — extracts userId from Bearer token
4. Each task is linked to userId — users can only see/modify their own tasks

## Testing Conventions
- One test file per resource (tasks.test.ts, auth.test.ts, health.test.ts)
- Tests run sequentially (maxWorkers: 1) to avoid shared DB conflicts
- Use beforeEach to clean database (deleteMany tasks, then users)
- Use afterAll to disconnect Prisma
- Use helper functions for repetitive setup (getAuthToken, createUser)
- Never rely on hardcoded IDs — create data in test, use ID from response
- Follow AAA pattern: Arrange, Act, Assert
- Test both happy paths (200, 201, 204) and error paths (400, 401, 404, 409)

## API Endpoints
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /health | No | Health check |
| POST | /auth/register | No | Register new user |
| POST | /auth/login | No | Login, returns JWT token |
| GET | /tasks | Yes | List user's tasks |
| GET | /tasks/:id | Yes | Get user's task by ID |
| POST | /tasks | Yes | Create new task |
| PUT | /tasks/:id | Yes | Update user's task |
| DELETE | /tasks/:id | Yes | Delete user's task |

## Collaboration Mode
This is a learning project. Claude assigns tasks, user implements them, Claude does code review.
