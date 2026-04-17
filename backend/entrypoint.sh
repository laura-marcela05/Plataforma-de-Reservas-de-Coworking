#!/bin/sh
set -e

echo "⏳ Ejecutando migraciones de Prisma..."
npx prisma migrate deploy

echo "✅ Schema sincronizado. Iniciando backend..."
exec npm run start:dev

