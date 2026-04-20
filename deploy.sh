#!/bin/bash

# Predictix Deployment Script
echo "🚀 Starting Predictix Cloud Deployment..."

# 1. Validate Environment
if ! [ -x "$(command -v docker)" ]; then
  echo "Error: docker is not installed." >&2
  exit 1
fi

# 2. Setup Production Environment Variables
if [ ! -f .env.prod ]; then
    echo "Creating .env.prod from template..."
    cp .env.example .env.prod
    echo "⚠️ Please update .env.prod with your production secrets!"
fi

# 3. Build and Start Services
echo "🏗️ Building and launching services..."
docker-compose -f docker-compose.prod.yml up --build -d

echo "✅ Predictix is now running in production mode!"
echo "Dashboard: http://your-cloud-ip"
echo "API: http://your-cloud-ip:5000"
echo "ML Service: http://your-cloud-ip:8000"
