# Task Management API

## Project Overview
Learning project — REST API for task management built with Node.js, Express and TypeScript.

## Tech Stack
- Node.js + TypeScript (strict mode)
- Express 5
- Prisma 7 ORM + SQLite (via @prisma/adapter-libsql)
- Jest + Supertest for testing
- ESLint + Prettier for code quality

## Commands
- `npm run dev` — start dev server with auto-reload (nodemon + ts-node)
- `npm run build` — compile TypeScript to JavaScript
- `npm start` — run compiled JS from dist/
- `npm test` — run all tests with Jest
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
├── app.ts                — Express app configuration (middleware, routes)
├── index.ts              — Entry point (starts the server)
├── routes/
│   └── tasks.ts          — Route definitions (maps paths to controllers)
├── controllers/
│   └── tasksController.ts — Business logic (req/res handling, async/await)
├── lib/
│   └── prisma.ts         — Prisma client singleton (with libsql adapter)
└── generated/
    └── prisma/           — Auto-generated Prisma client (gitignored)
tests/
├── health.test.ts        — Health check endpoint test
└── tasks.test.ts         — CRUD tests for tasks (13 tests)
prisma/
├── schema.prisma         — Database schema definition
└── migrations/           — Database migration files
```

## Conventions
- Language: TypeScript (strict mode), CommonJS modules
- Architecture: routes → controllers → Prisma (separation of concerns)
- Use Express Router for grouping endpoints per resource
- Controllers use async/await for database operations
- Controllers use try/catch for Prisma errors (update, delete throw on missing record)
- HTTP status codes: 200 OK, 201 Created, 204 No Content, 400 Bad Request, 404 Not Found
- Validate request body on POST/PUT — return 400 if required fields are missing
- Validate req.params.id with Number() + isNaN() — return 400 for invalid IDs
- Prisma client is a singleton (one instance in lib/prisma.ts)
- ESLint rules: no-var, prefer-const, eqeqeq, no-explicit-any (warn), explicit-function-return-type (warn)
- Prettier: double quotes, semicolons, trailing commas, 100 char width

## Testing Conventions
- One test file per resource (e.g. tasks.test.ts, health.test.ts)
- Use beforeEach to clean database (prisma.task.deleteMany)
- Use afterAll to disconnect Prisma
- Never rely on hardcoded IDs — create data in test, use ID from response
- Follow AAA pattern: Arrange, Act, Assert
- Test both happy paths (200, 201, 204) and error paths (400, 404)

## API Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | /health | Health check |
| GET | /tasks | List all tasks |
| GET | /tasks/:id | Get task by ID |
| POST | /tasks | Create new task |
| PUT | /tasks/:id | Update task |
| DELETE | /tasks/:id | Delete task |

## Collaboration Mode
This is a learning project. Claude assigns tasks, user implements them, Claude does code review.
