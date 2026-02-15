# Task Management API

## Project Overview
Learning project — REST API for task management built with Node.js, Express and TypeScript.

## Tech Stack
- Node.js + TypeScript (strict mode)
- Express 5
- Prisma 7 ORM + SQLite (via @prisma/adapter-libsql)
- ESLint + Prettier for code quality

## Commands
- `npm run dev` — start dev server with auto-reload (nodemon + ts-node)
- `npm run build` — compile TypeScript to JavaScript
- `npm start` — run compiled JS from dist/
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
│   └── tasksController.ts — Business logic (req/res handling)
├── models/
│   └── task.ts           — Task interface + in-memory data (being replaced by Prisma)
├── lib/
│   └── prisma.ts         — Prisma client singleton
└── generated/
    └── prisma/           — Auto-generated Prisma client (gitignored)
prisma/
├── schema.prisma         — Database schema definition
├── migrations/           — Database migration files
└── dev.db                — SQLite database file (gitignored)
```

## Conventions
- Language: TypeScript (strict mode), CommonJS modules
- Architecture: routes → controllers → Prisma (separation of concerns)
- Use Express Router for grouping endpoints per resource
- Controllers use async/await for database operations
- HTTP status codes: 200 OK, 201 Created, 204 No Content, 400 Bad Request, 404 Not Found
- Validate request body on POST/PUT — return 400 if required fields are missing
- Prisma client is a singleton (one instance in lib/prisma.ts)
- ESLint rules: no-var, prefer-const, eqeqeq, no-explicit-any (warn), explicit-function-return-type (warn)
- Prettier: double quotes, semicolons, trailing commas, 100 char width

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
