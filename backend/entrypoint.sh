#!/bin/sh
set -e
rm -f tsconfig.build.tsbuildinfo
rm -rf dist
echo "Running Prisma migrations..."
npx prisma migrate deploy
echo "Schema synced. Starting backend..."
exec npm run start:prod
