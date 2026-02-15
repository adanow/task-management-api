# Task Management API

## Project Overview
Learning project — REST API for task management built with Node.js, Express and TypeScript.

## Tech Stack
- Node.js + TypeScript
- Express 5
- In-memory storage (for now, PostgreSQL planned)

## Commands
- `npm run dev` — start dev server with auto-reload (nodemon + ts-node)
- `npm run build` — compile TypeScript to JavaScript
- `npm start` — run compiled JS from dist/
- `npx tsc --noEmit` — type-check without emitting files

## Project Structure
```
src/
├── app.ts        — Express app configuration (middleware, routes)
├── index.ts      — Entry point (starts the server)
└── routes/       — Route handlers (one file per resource)
```

## Conventions
- Language: TypeScript (strict mode)
- Module system: CommonJS
- Define interfaces for data models
- Use Express Router for grouping endpoints per resource
- HTTP status codes: 200 OK, 201 Created, 204 No Content, 400 Bad Request, 404 Not Found
- Validate request body on POST/PUT — return 400 if required fields are missing

## Collaboration Mode
This is a learning project. Claude assigns tasks, user implements them, Claude does code review.
