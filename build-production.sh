#!/bin/bash

echo "🚀 ArwaPark Production Build Script"
echo "=================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Generate package-lock.json if missing
if [ ! -f "package-lock.json" ]; then
    echo "📦 Generating package-lock.json..."
    npm install --package-lock-only
fi

if [ ! -f "frontend/package-lock.json" ]; then
    echo "📦 Generating frontend/package-lock.json..."
    cd frontend && npm install --package-lock-only && cd ..
fi

# Build Docker image
echo "🏗️ Building Docker image..."
docker build -f Dockerfile.production -t arwapark:latest .

if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
    echo ""
    echo "🚀 To run the container:"
    echo "docker run -p 3000:3000 -e DATABASE_URL='file:./production.db' arwapark:latest"
    echo ""
    echo "🌐 Application will be available at: http://localhost:3000"
else
    echo "❌ Build failed. Check the output above for errors."
    exit 1
fi