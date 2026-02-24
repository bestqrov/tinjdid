#!/bin/bash

# Production Deployment Script with Database Setup
# Run this script once you have your PostgreSQL URL

echo "🚀 Production Deployment Setup"
echo "==============================="

# Check if PostgreSQL URL is provided
if [ -z "$1" ]; then
    echo "❌ Please provide PostgreSQL URL as argument:"
    echo "Example: ./deploy-production.sh 'postgresql://user:pass@host:5432/db'"
    echo ""
    echo "🔗 Get free PostgreSQL from:"
    echo "- Supabase: https://supabase.com"
    echo "- Neon: https://neon.tech" 
    echo "- Railway: https://railway.app"
    echo "- Render: https://render.com"
    exit 1
fi

DATABASE_URL="$1"

echo "📋 Using database: $DATABASE_URL" | sed 's/:\/\/.*@/:\/\/***@/'

# Update .env.production
echo "⚙️ Updating .env.production..."
cat > .env.production << EOF
# Production Environment Configuration
DATABASE_URL="$DATABASE_URL"

# JWT Configuration - CHANGE THESE!
JWT_SECRET="$(openssl rand -base64 32)"
JWT_REFRESH_SECRET="$(openssl rand -base64 32)"

# Environment
NODE_ENV="production"
PORT=3000
EOF

# Update Prisma schema for PostgreSQL
echo "🗄️ Configuring Prisma for PostgreSQL..."
sed -i '' 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Push database schema
echo "📊 Setting up database tables..."
npx prisma db push

# Seed database (optional)
read -p "🌱 Seed database with demo data? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npm run prisma:seed
fi

# Build Docker image
echo "🐳 Building production Docker image..."
docker build -f Dockerfile.production -t arwapark-production .

if [ $? -eq 0 ]; then
    echo "✅ Production build completed successfully!"
    echo ""
    echo "🚀 To deploy:"
    echo "docker run -p 3000:3000 arwapark-production"
    echo ""
    echo "🌐 Application will be available at: http://localhost:3000"
    echo "🔑 Default login: admin@demo.com / password"
else
    echo "❌ Build failed!"
    exit 1
fi
EOF