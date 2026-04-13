#!/bin/sh

# Start NestJS app in background
npm run start:dev &

# Start Prisma Studio on port 5555
npx prisma studio --port 5555 --hostname 0.0.0.0