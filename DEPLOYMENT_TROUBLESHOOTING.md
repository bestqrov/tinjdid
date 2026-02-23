# 🚀 Docker Deployment Troubleshooting Guide

## ✅ **Fixed Issues in This Update**

### 1. **npm ci lockfile missing error**
```bash
ERROR: npm ci can only install with an existing package-lock.json
```
**Solution**: Generated missing `package-lock.json` files and updated Dockerfile

### 2. **Deprecated `--only=production` flag**  
```bash
npm warn config only Use `--omit=dev` to omit dev dependencies
```
**Solution**: Updated to modern `--omit=dev` syntax

### 3. **Build failures and missing dependencies**
**Solution**: Added robust dependency installation with fallbacks

---

## 🛠️ **Quick Deployment Steps**

### **Option 1: Use Build Script (Recommended)**
```bash
./build-production.sh
```

### **Option 2: Manual Docker Build**
```bash
# Ensure lockfiles exist
npm install --package-lock-only
cd frontend && npm install --package-lock-only && cd ..

# Build image
docker build -f Dockerfile.production -t arwapark:latest .

# Run container
docker run -p 3000:3000 arwapark:latest
```

---

## 🔧 **Common Issues & Solutions**

### **1. Missing package-lock.json**
```bash
# Generate lockfiles
npm install --package-lock-only
cd frontend && npm install --package-lock-only
```

### **2. Node version issues**
- Docker uses Node 20 (fixed in Dockerfile)
- Local development warnings are normal with Node 18

### **3. Build context too large**
- Check `.dockerignore` includes `node_modules`
- Ensure `.next` and `dist` are excluded

### **4. Prisma Client issues**
```bash
# In container
npx prisma generate
npx prisma db push
```

### **5. Environment variables**
- Production: Uses `.env.production`
- Development: Uses `.env`
- Set `DATABASE_URL` for your database

---

## 📋 **Deployment Checklist**

- [ ] `package-lock.json` exists in root
- [ ] `package-lock.json` exists in frontend/  
- [ ] `.env.production` configured
- [ ] Docker daemon running
- [ ] Port 3000 available
- [ ] Database accessible

---

## 🌐 **Production Configuration**

### **Environment Variables**
```env
DATABASE_URL=file:./production.db
JWT_SECRET=your-secure-random-key
NODE_ENV=production
PORT=3000
```

### **Container Health Check**
```bash
# Check if container is running
docker ps

# Check logs
docker logs [container-id]

# Access container shell
docker exec -it [container-id] bash
```

---

## 🎯 **Next Steps After Deployment**

1. **Database Setup**:
   ```bash
   docker exec [container-id] npx prisma migrate deploy
   ```

2. **Create Admin User**:
   ```bash
   docker exec [container-id] npx ts-node scripts/create-superadmin-arwa.js
   ```

3. **Access Application**:
   - URL: `http://your-domain:3000`
   - Admin: `admin@demo.com` / `password`

---

**🔄 If issues persist, check the updated Dockerfile.production and build-production.sh**