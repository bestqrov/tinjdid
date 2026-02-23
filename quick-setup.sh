#!/bin/bash
echo "🚀 إعداد سريع لـ ArwaPark"

# تنظيف node_modules
echo "📦 تنظيف Dependencies..."
rm -rf node_modules package-lock.json
rm -rf frontend/node_modules frontend/package-lock.json

# إعداد ملف .env
echo "⚙️ إعداد متغيرات البيئة..."
cat > .env << EOL
DATABASE_URL="file:./dev.db"
JWT_SECRET="arwapark-secret-key-2026"
JWT_EXPIRES_IN="7d"
NODE_ENV="development"
PORT=3001
NEXT_PUBLIC_API_URL="http://localhost:3001"
EOL

# إنشاء قاعدة بيانات
echo "🗄️ إنشاء قاعدة البيانات..."
touch prisma/dev.db

echo "✅ الإعداد الأساسي مكتمل!"
echo ""
echo "🎯 الخطوات التالية:"
echo "1. ترقية Node.js إلى v20+"
echo "2. npm install"
echo "3. npx prisma generate && npx prisma db push"
echo "4. npm run start:dev"
echo ""
echo "📋 بيانات الاعتماد:"
echo "📧 admin@demo.com"
echo "🔐 password"