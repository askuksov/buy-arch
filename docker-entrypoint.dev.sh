#!/bin/sh
set -e

echo "Installing dependencies..."
npm install

echo "Generating Prisma Client..."
npx prisma generate

echo "Starting Prisma Studio in background..."
npx prisma studio --port 5555 --browser none &

echo "Starting Next.js development server..."
npm run dev
