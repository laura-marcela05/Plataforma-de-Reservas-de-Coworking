#!/bin/sh
set -e

echo "⏳ Ejecutando migraciones de Prisma..."
npx prisma migrate deploy

echo "🚀 Iniciando backend NestJS..."
exec node dist/main

echo "✅ Schema sincronizado. Iniciando backend..."
exec npm run start:dev
