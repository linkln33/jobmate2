#!/bin/bash
# Vercel deploy script for JobMate

# Print Node.js and npm versions
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Deploy to Vercel
echo "Deploying to Vercel..."
npx vercel deploy --prod

echo "Deployment completed!"
