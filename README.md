# Workshop Organizer API

A RESTful API for managing workshops and educational notions built with NestJS, TypeScript, and MongoDB.

## Overview

This application provides a backend API for organizing workshops and managing educational concepts (notions). It
features a modular NestJS architecture with MongoDB persistence.

**Key Features:**

- Workshop management (CRUD operations)
- Notion management (CRUD operations)
- One-to-many relationship between workshops and notions
- Input validation with class-validator
- OpenAPI documentation with Swagger UI
- RESTful API design
- Health check endpoint

## Tech Stack

- **Runtime:** Node.js 22 LTS
- **Framework:** NestJS 11
- **Language:** TypeScript (strict mode)
- **Database:** MongoDB 7 with Mongoose ODM
- **Validation:** class-validator + class-transformer
- **Documentation:** Swagger / OpenAPI 3.0
- **Testing:** Jest + Supertest

## Prerequisites

Before you begin, ensure you have installed either:

- **Node.js** 22.x or higher ([Download](https://nodejs.org/)), **npm** 10.x or higher, and **MongoDB** 7.x or higher ([Download](https://www.mongodb.com/try/download/community)) for a local setup

or:

- **Docker** and **Docker Compose** for a containerized setup (see [Running with Docker](#running-with-docker))

## Getting Started

### Installation

1. Clone this repository:

```bash
git clone <repository-url>
cd p6-dfsjs-backend
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/workshopsdb
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

### Running the Application

**Important**: Ensure MongoDB is running locally before starting the application.

**Start MongoDB**:

```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

**Run the application**:

```bash
# Development mode with auto-reload
npm run start:dev

# Production mode
npm run build && npm run start:prod
```

The API will be available at `http://localhost:3000`

### Verify Installation

Check the health endpoint:

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{
  "status": "ok",
  "timestamp": "2026-01-21T10:30:00.000Z"
}
```

## Running with Docker

This repository ships a multi-stage `Dockerfile` (build with `nest build`, then a slim production image) and a `docker-compose.yml` that also starts a MongoDB container.

1. Configure environment variables:

```bash
cp .env.example .env
```

`DB_USER`, `DB_PASSWORD` and `DB_NAME` configure the MongoDB root user and database created on first start; `MONGO_URI` is not used in this mode, it is rebuilt from those three variables by `docker-compose.yml`.

2. Build and start both containers:

```bash
docker compose up --build
```

The API will be available at `http://localhost:${PORT}` (`3000` by default, see [Environment Variables](#environment-variables)), and Mongo data persists in the `db` named volume across restarts.

3. Stop the stack:

```bash
docker compose down
```

Add `-v` to also drop the `db` volume (wipes MongoDB data):

```bash
docker compose down -v
```

## Continuous Integration & Releases

This repository ships a GitHub Actions workflow (`.github/workflows/ci.yml`) with three sequential jobs, triggered on every push:

1. **`test`** — installs dependencies and runs the Jest suite (`./run-tests.sh`), on every branch.
2. **`release`** *(runs only on `main`)* — runs [semantic-release](https://semantic-release.gitbook.io/) to determine the next version from commit history, generate a changelog, and publish a GitHub release.
3. **`build-and-push-image`** — builds the Docker image and pushes it to `ghcr.io`. When `release` published a new version, the image is also tagged with that semantic version (e.g. `ghcr.io/<owner>/<repo>:1.4.0`), in addition to its branch tag.

### Conventional Commits

Versioning is entirely driven by commit messages, which must follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>[optional scope]: <description>
```

| Type                                                | Effect on version         | Example                                       |
|------------------------------------------------------|----------------------------|------------------------------------------------|
| `fix:`                                                | patch (`1.0.0` → `1.0.1`) | `fix(workshops): correct notion population`    |
| `feat:`                                               | minor (`1.0.0` → `1.1.0`) | `feat(notions): add search endpoint`           |
| `feat!:` or a `BREAKING CHANGE:` footer               | major (`1.0.0` → `2.0.0`) | `feat!: remove deprecated /v1 routes`          |
| `chore:`, `docs:`, `refactor:`, `test:`, `ci:`, ...    | no release                | `chore(ci): tweak workflow`                    |

Commit messages are enforced locally by a `commitlint` + `husky` `commit-msg` hook, installed automatically by `npm install` (the `prepare` script). A commit that doesn't match the convention is rejected before it's even created. This is a local safety net only — it doesn't run in CI, so a message that slips through (`--no-verify`, or a clone where hooks were never installed) simply won't count toward the next release; it won't break the build.

**Note:** the very first release only happens once a `feat:`/`fix:` (or breaking) commit lands on `main` — semantic-release needs at least one relevant commit to publish anything, even the initial `1.0.0`.

### What semantic-release produces

Configured in `.releaserc.json`:

- a Git tag `vX.Y.Z` and a GitHub Release with generated notes
- a `CHANGELOG.md` at the repository root
- `package.json`'s `version` kept in sync (no npm registry publish — this package is private)
- the release commit and changelog pushed back to `main` as `chore(release): X.Y.Z [skip ci]`

## Project Structure

```
p6-dfsjs-backend/
├── src/
│   ├── main.ts                                    # Application entry point (Swagger, ValidationPipe, CORS)
│   ├── app.module.ts                              # Root module
│   ├── core/                                      # Shared infrastructure (pipes, filters, health)
│   │   ├── health.controller.ts                   # Health check endpoint
│   │   ├── pipes/
│   │   │   └── parse-object-id.pipe.ts            # MongoDB ObjectId validation pipe
│   │   └── filters/
│   │       └── mongoose-exception.filter.ts       # Mongoose error handling
│   └── modules/                                   # Feature modules
│       ├── workshops/
│       │   ├── workshops.module.ts                # Workshop feature module
│       │   ├── workshops.controller.ts            # Workshop route handlers
│       │   ├── workshops.service.ts               # Workshop business logic
│       │   ├── workshops.controller.spec.ts       # Controller unit tests
│       │   ├── workshops.service.spec.ts          # Service unit tests
│       │   ├── schemas/
│       │   │   └── workshop.schema.ts             # Workshop Mongoose schema
│       │   └── dto/
│       │       ├── create-workshop.dto.ts         # Create validation DTO
│       │       └── update-workshop.dto.ts         # Update validation DTO
│       └── notions/
│           ├── notions.module.ts                  # Notion feature module
│           ├── notions.controller.ts              # Notion route handlers
│           ├── notions.service.ts                 # Notion business logic
│           ├── notions.controller.spec.ts         # Controller unit tests
│           ├── notions.service.spec.ts            # Service unit tests
│           ├── schemas/
│           │   └── notion.schema.ts               # Notion Mongoose schema
│           └── dto/
│               ├── create-notion.dto.ts           # Create validation DTO
│               └── update-notion.dto.ts           # Update validation DTO
├── test/
│   └── jest-e2e.json                              # E2E test configuration
├── .husky/
│   └── commit-msg                                 # commitlint git hook
├── package.json
├── tsconfig.json                                  # TypeScript configuration (strict, path aliases)
├── tsconfig.build.json                            # Build TypeScript configuration
├── nest-cli.json                                  # NestJS CLI configuration (Swagger plugin)
├── .releaserc.json                                # semantic-release configuration
├── commitlint.config.js                           # Conventional Commits linting rules
├── CHANGELOG.md                                    # Generated by semantic-release (created on first release)
├── .env.example                                   # Environment variables template
├── .gitignore
└── README.md
```

**Path aliases** configured in `tsconfig.json`:

- `@core/*` resolves to `src/core/*`
- `@modules/*` resolves to `src/modules/*`

## API Documentation

Swagger UI is available at `http://localhost:3000/api/docs` when the application is running.

The OpenAPI JSON spec is served at `http://localhost:3000/api/docs-json`.

## API Endpoints

### Health Check

- `GET /health` - Check API status

### Workshops

- `GET /api/workshops` - Get all workshops (with populated notions)
- `GET /api/workshops/:id` - Get workshop by ID
- `POST /api/workshops` - Create new workshop
- `PUT /api/workshops/:id` - Update workshop
- `DELETE /api/workshops/:id` - Delete workshop

**Workshop request body (POST / PUT):**

```json
{
  "name": "Introduction to Docker",
  "notions": [
    "<notion_id_1>",
    "<notion_id_2>"
  ]
}
```

### Notions

- `GET /api/notions` - Get all notions
- `GET /api/notions/:id` - Get notion by ID
- `POST /api/notions` - Create new notion
- `PUT /api/notions/:id` - Update notion
- `DELETE /api/notions/:id` - Delete notion

**Notion request body (POST / PUT):**

```json
{
  "name": "Containerization"
}
```

## Testing

Run the test suite:

```bash
# Run all unit tests
npm test

# Run tests with coverage report
npm run test:cov

# Run tests in watch mode
npm run test:watch

# Run e2e tests
npm run test:e2e
```

## Architecture

This application follows the **NestJS modular architecture** with a `core/` + `modules/` separation:

```
Client Request
    |
  main.ts (ValidationPipe, CORS, Swagger, MongooseExceptionFilter)
    |
  AppModule
    |--- core/        (shared infrastructure: pipes, filters, health)
    |--- modules/
           |--- WorkshopsModule
           |       |--- WorkshopsController (HTTP routing)
           |       |--- WorkshopsService (business logic + data access)
           |       |--- Workshop Schema (Mongoose model)
           |       |--- DTOs (input validation with class-validator)
           |
           |--- NotionsModule
                   |--- NotionsController
                   |--- NotionsService
                   |--- Notion Schema
                   |--- DTOs
```

**Key patterns:**

- **core/ + modules/**: Shared infrastructure separated from feature modules, with `@core/*` and `@modules/*` path
  aliases
- **NestJS Modules**: Feature-based encapsulation (WorkshopsModule, NotionsModule)
- **Dependency Injection**: Services injected via NestJS DI container
- **DTOs with class-validator**: Automatic input validation via global ValidationPipe
- **ParseObjectIdPipe**: Custom pipe for MongoDB ID validation on route params
- **MongooseExceptionFilter**: Global filter for Mongoose-specific errors
- **PartialType**: Update DTOs inherit from Create DTOs with all fields optional
- **Swagger plugin**: OpenAPI spec auto-generated from DTOs and controllers

## Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start NestJS application
- `npm run start:dev` - Start in development mode with auto-reload
- `npm run start:debug` - Start in debug mode
- `npm run start:prod` - Start compiled production build
- `npm test` - Run unit tests
- `npm run test:cov` - Run tests with coverage report
- `npm run test:watch` - Run tests in watch mode
- `npm run test:e2e` - Run end-to-end tests
- `npm run lint` - Lint and fix TypeScript files

## Environment Variables

| Variable       | Description                                                         | Default                                 |
|----------------|----------------------------------------------------------------------|-----------------------------------------|
| `PORT`         | Server port                                                         | `3000`                                  |
| `MONGO_URI`    | MongoDB connection string (local setup only, ignored by Docker Compose) | `mongodb://localhost:27017/workshopsdb` |
| `DB_NAME`      | MongoDB database name (Docker Compose only)                         | `workshopsdb`                           |
| `DB_USER`      | MongoDB root username (Docker Compose only)                         | `mongouser`                             |
| `DB_PASSWORD`  | MongoDB root password (Docker Compose only)                         | `mongopassword`                         |
| `CORS_ORIGIN`  | Allowed CORS origin                                                 | `http://localhost:5173`                 |
| `NODE_ENV`     | Environment mode                                                    | `development`                           |

## Troubleshooting

### MongoDB Connection Issues

**Problem:** `MongoServerError: connection refused`

**Solution:** Ensure MongoDB is running:

```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

### Port Already in Use

**Problem:** `Error: listen EADDRINUSE: address already in use :::3000`

**Solution:** Change the port in `.env` or kill the process using port 3000:

```bash
# Find process
lsof -i :3000

# Kill process
kill -9 <PID>
```

## License

MIT
