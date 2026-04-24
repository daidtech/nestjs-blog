# Project Coding Standards and Agent Instructions

These instructions apply to the repository-level AI agent behavior when editing backend and frontend code.

## Project structure
- `src/` contains the NestJS backend application.
  - `auth/` handles authentication, JWT strategy, and guards.
  - `post/`, `comment/`, `tag/`, `category/` are domain modules with controllers and services.
  - `prisma/` holds the Prisma module and service used by backend domain services.
- `web/` contains the Next.js frontend application.
- `prisma/` contains the Prisma schema and migration history.
- `.github/instructions/` contains project instruction files for the agent.

## Use tests for feature and API changes
- When modifying backend API behavior, add or update Jest/Node spec tests before marking the work complete.
- When modifying frontend features, add or update relevant `web` tests before marking the work complete.
- If a new feature is introduced, the change should include automated coverage for that behavior.
- Run the relevant test suites after code changes and keep them passing.

## Backend import style
- Use `@/` alias imports consistently for backend `src/` code.
- Use `@/` alias imports consistently for frontend `web/` code as configured in `web/tsconfig.json`.
- Avoid raw relative imports across large directories when `@/` can be used cleanly.

## Domain separation
- Keep backend domain logic separated:
  - `PostService` should own post-related behavior.
  - `CommentService` should own comment-related behavior.
  - Avoid using `PostService` for comment domain logic or vice versa.
- Use separate modules for distinct domains rather than importing one module only to reuse a single service.
- Keep Prisma access centralized through `PrismaService` and `PrismaModule`.

## NestJS and Prisma practices
- Use DTOs with validation for request payloads.
- Use the global validation pipe in `main.ts`.
- Prefer explicit domain services and controllers over mixed responsibilities.
- Keep controllers thin and delegate business logic to services.

## Frontend styling
- Continue using Tailwind CSS in `/web`.
- Allow custom CSS only for special cases; prefer Tailwind utilities.

## When in doubt
- Ask for clarification before making large structural changes.
- Favor maintainability, clear module boundaries, and test coverage.
