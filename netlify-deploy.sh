#!/bin/bash
# This script helps ensure proper deployment on Netlify

# Print current directory for debugging
echo "Current directory: $(pwd)"
echo "Listing files in current directory:"
ls -la

# Make sure we're using the right Node.js version
echo "Node version:"
node -v
echo "NPM version:"
npm -v

# Install dependencies
echo "Installing dependencies..."
npm install

# Build the Next.js app
echo "Building the application..."
npm run build

echo "Deployment script completed successfully"
