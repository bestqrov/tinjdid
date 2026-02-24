# نصيحة سريعة: إعداد PostgreSQL مجاني في 5 دقائق

## خيارات سريعة ومجانية:

### 1. Supabase (الأسهل والأسرع):
1. اذهب إلى: https://supabase.com
2. اختر "Start your project"  
3. أنشئ حساباً بـ GitHub (مجاني)
4. أنشئ مشروعاً جديداً
5. اختر region قريب (eu-west أو us-east)
6. انتظر 2-3 دقائق للإعداد
7. اذهب لـ Settings → Database
8. انسخ "Connection string" من قسم Connection parameters

الرابط سيبدو هكذا:
```
postgresql://postgres.xxxxxxxxxxxxx:YOUR-PASSWORD@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

### 2. Neon (سريع جداً):
1. اذهب إلى: https://neon.tech
2. Sign up وأنشئ database
3. انسخ Connection string

الرابط سيبدو هكذا:
```  
postgresql://user:password@ep-xxxxxxxxxx.us-east-2.aws.neon.tech/dbname
```

### 3. Railway (بسيط):
1. https://railway.app  
2. Deploy PostgreSQL
3. انسخ DATABASE_URL

## أو جرب PostgreSQL محلي:

```bash
# على macOS
brew install postgresql
brew services start postgresql

# إنشاء قاعدة بيانات
createdb arwapark
```

ثم استخدم:
```
DATABASE_URL="postgresql://postgres@localhost:5432/arwapark"
```

## الخطوة التالية:
1. احصل على PostgreSQL URL صحيح من إحدى الخدمات أعلاه
2. الصقه هنا
3. سأحدث الإعدادات وأشغل التطبيق

---

**النقطة المهمة**: الـ hostname الحالي `nk4g0wkoc0skw0sgswk80ggw` ناقص ويحتاج نطاق كامل مثل `.com` أو `.net`! 🔧