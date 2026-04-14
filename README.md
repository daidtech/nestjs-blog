
# NestJS Blog

<a id="nestjs-practice-guide"></a>
## NESTJS PRACTICE GUIDE:

This project contains:
Jump to [NESTJS PRACTICE GUIDE](#nestjs-practice-guide)

This project contains:

- A NestJS backend API for posts
- Prisma ORM with PostgreSQL
- A Next.js frontend UI in the `web` folder

## Project Structure

- `src/` - NestJS backend
- `prisma/` - Prisma schema and database config
- `web/` - Next.js frontend
- `docker-compose.yml` - PostgreSQL + app container setup

## Backend API

Base URL:

```bash
http://localhost:3000
```

Current post routes:

- `GET /posts` - list all posts
- `GET /posts/:id` - get one post
- `POST /posts` - create a post
- `PATCH /posts/:id` - update a post
- `DELETE /posts/:id` - delete a post

### Validation

`class-validator` and `class-transformer` are enabled globally through Nest `ValidationPipe`.

Validation behavior:

- Unknown fields are removed (`whitelist: true`)
- Unknown fields cause a `400` error (`forbidNonWhitelisted: true`)
- Payloads are transformed to DTO types (`transform: true`)

`POST /posts` accepted fields:

- `title` (required, string, max 200)
- `slug` (optional, string, max 200)
- `excerpt` (optional, string, max 280)
- `content` (optional, string)
- `published` (optional, boolean)
- `authorId` (optional, integer >= 1)

Example create payload:

```json
{
	"title": "My first post",
	"slug": "my-first-post",
	"excerpt": "Short summary",
	"content": "Full content here",
	"published": true,
	"authorId": 1
}
```

## Frontend UI

Frontend runs from the `web` folder.

Base URL:

```bash
http://localhost:3001
```

Current pages:

- `/` - list all posts
- `/posts/new` - create new post
- `/posts/:id` - post details page

The frontend calls the backend API at `http://localhost:3000` by default.

## Local Development

### 1. Install backend dependencies

```bash
npm install
```

### 2. Install frontend dependencies

```bash
cd web
npm install
```

### 3. Configure database

Example `.env`:

```env
DATABASE_URL="postgresql://postgresql:postgresql@localhost:5432/nestjs-blog"
```

### 4. Run Prisma

```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Start backend

```bash
npm run start:dev
```

### 6. Start frontend

```bash
cd web
npm run dev
```

## Docker Development

You can run PostgreSQL and the NestJS app with Docker Compose.

### Start services

```bash
docker compose up --build --force-recreate
```

This starts:

- PostgreSQL on `localhost:5432`
- NestJS app on `localhost:3000`
- Prisma Studio on `localhost:5555`

### Stop services

```bash
docker compose down
```

### Useful Docker commands

Open a shell in the app container:

```bash
docker compose exec app sh
```

Run Prisma Studio manually inside app container:

```bash
docker compose exec app npx prisma studio --port 5555
```

## Build Commands

Backend build:

```bash
npm run build
```

Frontend build:

```bash
cd web
npm run build
```

## Notes

- CORS is enabled in the NestJS app for frontend requests.
- Request logging middleware is registered globally.
- The frontend and backend are built separately.
- The Nest build excludes the `web` folder.
