# Workspace Coding & Workflow Instructions

These instructions apply to the entire repository (NestJS backend and /web frontend).

---

## 1. Frontend UI Styling
- Use Tailwind CSS utility classes for all UI in `/web`.
- Custom CSS is allowed for special cases, but Tailwind is preferred for consistency.
- Do not introduce other CSS frameworks (e.g., Bootstrap, Material UI) unless discussed with the team.

## 2. Frontend Commands
- All npm/yarn commands for the frontend must be run from the `/web` folder.
  - Example: `cd web && npm run dev`
- Tailwind/PostCSS config is in `/web`.

## 3. Git Workflow
- Follow the Git workflow described in `web/GIT_WORKFLOW.md` for all feature, fix, and release branches.
- Use clear, conventional commit messages (e.g., `feat:`, `fix:`, `refactor:`).
- Open Pull Requests for all changes to `main`.

## 4. Code Quality
- Use Prettier and ESLint for formatting and linting (see config files in root and `/web`).
- TypeScript is enforced for both backend and frontend.
- Backend and frontend both support `@/` path aliasing for root imports.

## 5. Backend (NestJS)
- Use DTOs with validation for all API endpoints.
- Global validation pipe is enabled (see `main.ts`).
- Use Prisma ORM for all database access.

## 6. Testing and feature validation
- When changing backend API behavior or frontend feature behavior, add or update tests before declaring the work complete.
- For backend changes, add/update Jest or Node spec tests in `src/**/*.spec.ts` or `test/**/*.spec.ts`.
- For frontend feature changes, add/update tests in `web/**/*.spec.ts`, `web/**/*.test.ts`, or the frontend test suite.
- Run the relevant test suites after code changes and keep tests passing.
- If a new feature is added, ensure the feature has coverage with a test that validates its behavior.

## 7. Docker & Deployment
- Use `docker-compose.yml` for local development with PostgreSQL and the app.
- Database config is managed via environment variables.

---

**When in doubt, ask for review or clarification in your Pull Request!**
