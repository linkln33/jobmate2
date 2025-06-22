#!/bin/bash
# Netlify build script for JobMate

# Print debugging information
echo "Starting Netlify build script"
echo "Current directory: $(pwd)"
echo "Listing files in current directory:"
ls -la

# Check if we're in the repository root
if [ -d "Codes/jobmate" ]; then
  echo "Found Codes/jobmate directory, navigating there"
  cd Codes/jobmate
  echo "New directory: $(pwd)"
  
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
    echo "ERROR: package.json not found in Codes/jobmate"
    exit 1
  fi
else
  echo "ERROR: Codes/jobmate directory not found"
  exit 1
fi
