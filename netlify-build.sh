#!/bin/bash
# Netlify build script for JobMate

# Print debugging information
echo "Starting Netlify build script"
echo "Current directory: $(pwd)"
echo "Listing files in current directory:"
ls -la

# Build directly from the main project directory
echo "Building from main project directory"

# Check if package.json exists in this directory
if [ -f "package.json" ]; then
  echo "Found package.json, installing dependencies"
  npm install
  echo "Building the Next.js application"
  npm run build
  
  # Copy the build output to the expected Netlify publish directory
  echo "Copying build output to Netlify publish directory"
  mkdir -p /opt/build/repo/out
  cp -r out/* /opt/build/repo/out/
  
  echo "Build completed successfully"
  exit 0
else
  echo "ERROR: package.json not found in project directory"
  exit 1
fi
