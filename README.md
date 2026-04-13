
## Getting Started with Docker

You can run the entire project (NestJS app and PostgreSQL database) using Docker Compose.

### Prerequisites

- [Docker](https://www.docker.com/get-started) installed

### Start the app and database

```bash
docker compose up --build --force-recreate
```

This will:
- Build the NestJS app image
- Start the PostgreSQL database (with user `postgresql`, password `postgresql`, db `blog`)
- Start the app on [http://localhost:3000](http://localhost:3000)

### Stopping the services

```bash
docker compose down
```

### Notes
- The app connects to the database using the `DATABASE_URL` environment variable set in `docker-compose.yml`.
- For local development outside Docker, set `DATABASE_URL` to use `localhost` as the host.
