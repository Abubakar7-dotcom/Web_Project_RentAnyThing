#!/bin/bash
set -e

echo "🔄 Running database migrations..."
npx prisma migrate deploy

echo "✅ Migrations completed successfully"

echo "🔄 Generating Prisma Client..."
npx prisma generate

echo "✅ Prisma Client generated"

echo "🔄 Building application..."
npm run build

echo "✅ Build completed successfully"
