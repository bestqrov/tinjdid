# PostgreSQL Configuration Guide for ArwaPark

## لماذا PostgreSQL؟ 🐘

PostgreSQL هو الخيار الأفضل للنشر لأنه:
- ✅ **أداء عالي** في بيئات الإنتاج
- ✅ **دعم كامل للعمليات المتزامنة** (concurrent operations)
- ✅ **مقياس أفضل** للمستخدمين المتعددين
- ✅ **أمان محسن** مع صلاحيات متقدمة
- ✅ **دعم جيد من منصات الاستضافة**

## إعداد قاعدة البيانات 🛠️

### 1. الحصول على PostgreSQL URL

#### أ) استخدام خدمة استضافة (موصى):

**Supabase** (مُوصى للمبتدئين):
1. اذهب إلى: https://supabase.com
2. أنشئ حساباً مجانياً
3. أنشئ مشروعاً جديداً
4. انسخ Database URL من Settings → Database

**Railway**:
1. اذهب إلى: https://railway.app
2. أنشئ مشروعاً جديداً
3. أضف PostgreSQL database
4. انسخ CONNECTION_URL

**Neon** (مجاني):
1. اذهب إلى: https://neon.tech
2. أنشئ حساباً وقاعدة بيانات
3. انسخ Connection String

#### ب) PostgreSQL محلي:
```bash
# تثبيت PostgreSQL على macOS
brew install postgresql
brew services start postgresql

# إنشاء قاعدة بيانات
createdb arwapark_dev
```

### 2. تكوين متغيرات البيئة ⚙️

**للتطوير (.env)**:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/arwapark_dev"
```

**للإنتاج (.env.production)**:
```env
DATABASE_URL="postgresql://username:password@your-production-host:5432/arwapark_prod"
```

### 3. أمثلة على URLs صحيحة 📝

```bash
# Supabase
DATABASE_URL="postgresql://postgres:your-password@db.xxxxxxxxxxxxx.supabase.co:5432/postgres"

# Railway
DATABASE_URL="postgresql://postgres:password@roundhouse.proxy.rlwy.net:12345/railway"

# Neon
DATABASE_URL="postgresql://user:password@ep-xx-xxx-xxx.us-east-2.aws.neon.tech/dbname"

# محلي
DATABASE_URL="postgresql://postgres:password@localhost:5432/arwapark"
```

## خطوات التشغيل بعد التكوين 🚀

### 1. تحديث المتغيرات:
```bash
# عدّل ملف .env
nano .env

# ضع URL قاعدة البيانات الحقيقي
DATABASE_URL="postgresql://your-actual-url-here"
```

### 2. إعادة تثبيت Dependencies:
```bash
npm install
cd frontend && npm install && cd ..
```

### 3. إعداد Prisma:
```bash
npx prisma generate
npx prisma db push
npm run prisma:seed  # اختياري: بيانات تجريبية
```

### 4. تشغيل التطبيق:
```bash
# التطوير
npm run start:dev

# في terminal آخر
cd frontend && npm run dev
```

## نشر الإنتاج 📦

### باستخدام Docker:
```bash
# تأكد من تحديث .env.production أولاً
./build-production.sh

# تشغيل الحاوية  
docker run -p 3000:3000 arwapark:latest
```

### متغيرات البيئة المطلوبة للإنتاج:
```env
DATABASE_URL="postgresql://user:pass@host:5432/db"
JWT_SECRET="your-super-secure-secret-key"
JWT_REFRESH_SECRET="another-secure-key"
NODE_ENV="production"
```

## استكشاف الأخطاء 🔧

### خطأ: "Invalid `prisma.xxx.findXxx()` invocation"
- تأكد من أن DATABASE_URL يبدأ بـ `postgresql://`
- تأكد من أن قاعدة البيانات متاحة ومتصلة

### خطأ: "Can't reach database server"
- تحقق من صحة رابط قاعدة البيانات
- تأكد من أن قاعدة البيانات تعمل
- تحقق من إعدادات الشبكة/Firewall

### خطأ: "relation does not exist"
```bash
# إعادة إنشاء الجداول
npx prisma db push --force-reset
npm run prisma:seed
```

## الأمان 🔒

⚠️ **مهم جداً**:
- لا تكشف DATABASE_URL في الكود العام
- استخدم متغيرات البيئة دائماً
- غيّر JWT secrets في الإنتاج
- استخدم HTTPS في الإنتاج

## أوامر مفيدة 💡

```bash
# فحص الاتصال
npx prisma db execute --command "SELECT 1"

# رؤية قاعدة البيانات
npx prisma studio

# إعادة تعيين قاعدة البيانات
npx prisma migrate reset

# إنشاء Migration جديد
npx prisma migrate dev --name description
```

---

**بمجرد تكوين PostgreSQL بشكل صحيح، ستحصل على أداء أفضل وموثوقية أكثر في الإنتاج! 🚀**