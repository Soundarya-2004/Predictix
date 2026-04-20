# Predictix Deployment Script for Windows/PowerShell

Write-Host "🚀 Starting Predictix Cloud Deployment..." -ForegroundColor Cyan

# 1. Validate Environment
if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Error "Error: docker is not installed."
    exit
}

# 2. Setup Production Environment Variables
if (!(Test-Path .env.prod)) {
    Write-Host "Creating .env.prod from template..." -ForegroundColor Yellow
    Copy-Item .env.example .env.prod
    Write-Host "⚠️ Please update .env.prod with your production secrets!" -ForegroundColor Red
}

# 3. Build and Start Services
Write-Host "🏗️ Building and launching services..." -ForegroundColor Green
docker-compose -f docker-compose.prod.yml up --build -d

Write-Host "✅ Predictix is now running in production mode!" -ForegroundColor Green
Write-Host "Dashboard: http://localhost"
Write-Host "API: http://localhost:5000"
Write-Host "ML Service: http://localhost:8000"
