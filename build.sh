#!/bin/bash
# Build script for JobMate Netlify deployment

echo "Starting JobMate build process..."

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Build Next.js application
echo "Building Next.js application..."
NEXT_TELEMETRY_DISABLED=1 npm run build

echo "Build completed successfully!"
