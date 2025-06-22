#!/bin/bash
# This script helps Netlify find and build the project correctly

# Print current directory for debugging
echo "Starting build script"
echo "Current directory: $(pwd)"
echo "Listing files in current directory:"
ls -la

# Check if we're in the right directory
if [ -f "package.json" ]; then
  echo "Found package.json in current directory"
  npm install
  npm run build
elif [ -d "Codes/jobmate" ]; then
  echo "Found Codes/jobmate directory, navigating there"
  cd Codes/jobmate
  echo "New directory: $(pwd)"
  npm install
  npm run build
else
  echo "ERROR: Could not find project directory"
  exit 1
fi

echo "Build completed successfully"
