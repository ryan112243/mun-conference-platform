#!/bin/bash

# Exit on error
set -e

echo "Starting deployment process..."

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "Netlify CLI not found. Installing..."
    npm install netlify-cli -g
fi

# Frontend deployment
echo "\n=== Building and deploying frontend to Netlify ==="
cd frontend

# Install dependencies
echo "Installing frontend dependencies..."
npm install

# Build frontend
echo "Building frontend..."
npm run build

# Deploy to Netlify
echo "Deploying to Netlify..."
netlify deploy --prod

# Store frontend URL
FRONTEND_URL=$(netlify sites:list --json | jq -r '.[0].url')

# Return to root directory
cd ..

# Backend deployment to Render
echo "\n=== Deploying backend to Render ==="

# Check if Render CLI is installed
if ! command -v render &> /dev/null; then
    echo "Render CLI not found. Please deploy backend manually through Render dashboard."
    echo "Visit: https://dashboard.render.com/"
    BACKEND_URL="Your Render backend URL"
else
    # Deploy to Render using CLI
    echo "Deploying to Render..."
    cd backend
    render deploy --yes
    BACKEND_URL="Your Render backend URL" # Replace with actual URL from Render
    cd ..
fi

# Print deployment URLs
echo "\n=== Deployment Complete! ==="
echo "Frontend URL: $FRONTEND_URL"
echo "Backend URL: $BACKEND_URL"

echo "\nRemember to set up environment variables in both Netlify and Render dashboards!"