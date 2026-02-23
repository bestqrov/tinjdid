#!/bin/bash

# ArwaPark Deployment Script

echo "🚀 Starting ArwaPark deployment..."

# Stop existing processes
echo "⏹️ Stopping existing processes..."
pm2 stop arwapark 2>/dev/null || true

# Pull latest code
echo "📥 Pulling latest code..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
npm install
cd frontend && npm install && cd ..

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Run migrations
echo "🗄️ Running database migrations..."
npx prisma migrate deploy

# Build backend
echo "🏗️ Building backend..."
npm run build

# Build frontend
echo "🏗️ Building frontend..."
cd frontend && npm run build && cd ..

# Start with PM2
echo "▶️ Starting application with PM2..."
pm2 start dist/main.js --name arwapark --time

# Save PM2 configuration
pm2 save

echo "✅ Deployment complete!"
echo "📊 Check status with: pm2 status"
echo "📋 Check logs with: pm2 logs arwapark"
