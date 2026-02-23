# 🚀 Quick Setup Guide - Super Admin Dashboard

## Step-by-Step Installation

### 1️⃣ Database Migration

```bash
cd c:\Users\Bismilah\Desktop\abdoapp

# Generate Prisma migration
npx prisma migrate dev --name add_super_admin_features

# Generate Prisma client
npx prisma generate
```

### 2️⃣ Seed Initial Data

```bash
# Create subscription plans and platform settings
node scripts/seed-super-admin.js
```

Expected output:
```
🌱 Seeding subscription plans...
✓ Création du plan "Basic"...
✓ Création du plan "Pro"...
✓ Création du plan "Enterprise"...
✅ Plans d'abonnement créés avec succès!
🌱 Seeding platform settings...
✅ Paramètres plateforme créés!
🎉 Seed completed successfully!
```

### 3️⃣ Create Super Admin User

```bash
# Use existing script to create super admin
node scripts/create-superadmin-arwa.js
```

Or create manually:
```bash
# Create a custom super admin
node scripts/create-superadmin.js
```

### 4️⃣ Start Backend Server

```bash
# Make sure you're in the root directory
npm run start:dev
```

Wait for:
```
[Nest] Application successfully started
```

### 5️⃣ Start Frontend Server

```bash
# Open new terminal
cd c:\Users\Bismilah\Desktop\abdoapp\frontend
npm run dev
```

Wait for:
```
✓ Ready on http://localhost:3000
```

### 6️⃣ Access Super Admin Dashboard

1. **Login:**
   - URL: http://localhost:3000/login
   - Email: `arwa@arwapark.com` (or your super admin email)
   - Password: Your super admin password

2. **Navigate to Super Admin:**
   - After login, go to: http://localhost:3000/super-admin
   - Or click "Super Admin" in the sidebar (purple menu)

---

## 🎯 First Time Setup Checklist

### ✅ Initial Configuration

1. **Check Dashboard** (http://localhost:3000/super-admin)
   - [ ] Verify KPIs display correctly
   - [ ] Check if charts render
   - [ ] View recent companies list

2. **Configure Plans** (http://localhost:3000/super-admin/plans)
   - [ ] Review default plans (Basic, Pro, Enterprise)
   - [ ] Edit pricing if needed
   - [ ] Adjust limits as needed
   - [ ] Create custom plans (optional)

3. **Platform Settings** (http://localhost:3000/super-admin/settings)
   - [ ] Update platform name
   - [ ] Set support email
   - [ ] Configure languages
   - [ ] Upload logo (optional)

4. **Test Companies Management** (http://localhost:3000/super-admin/companies)
   - [ ] View existing companies
   - [ ] Try filtering by status
   - [ ] Assign a plan to a company
   - [ ] Test suspend/activate

5. **Monitor System** (http://localhost:3000/super-admin/system)
   - [ ] Check system health
   - [ ] Verify API status
   - [ ] Check database connection

---

## 🐛 Troubleshooting

### Issue: "Cannot access super-admin page"
**Solution:**
1. Verify you're logged in as SUPERADMIN:
   ```javascript
   // Check in browser console
   localStorage.getItem('role')
   // Should return: "SUPERADMIN"
   ```
2. If not, logout and login with super admin credentials

### Issue: "Database connection error"
**Solution:**
1. Check `.env` file has correct `DATABASE_URL`
2. Ensure PostgreSQL is running
3. Run: `npx prisma studio` to test connection

### Issue: "Plans not showing"
**Solution:**
1. Re-run seed script: `node scripts/seed-super-admin.js`
2. Check database: `npx prisma studio`
3. Verify backend logs for errors

### Issue: "401 Unauthorized on API calls"
**Solution:**
1. Refresh token might be expired
2. Logout and login again
3. Check JWT token in localStorage:
   ```javascript
   localStorage.getItem('accessToken')
   ```

### Issue: "Page not found"
**Solution:**
1. Ensure frontend is running on port 3000
2. Ensure backend is running on port 3001
3. Check for any build errors in terminal

---

## 📊 Test Data (Optional)

### Assign Plans to Existing Companies

```javascript
// In Prisma Studio or via API
// Update a company:
{
  "planId": "<basic-plan-id>",
  "status": "ACTIVE"
}
```

### Create Activity Logs

```bash
# Via API or Prisma Studio
POST /super-admin/logs
{
  "action": "COMPANY_CREATED",
  "description": "New company XYZ registered",
  "companyId": "<company-id>"
}
```

---

## 🔧 Development Tips

### Hot Reload
- Backend: Nest will auto-reload on save
- Frontend: Next.js will hot-reload automatically

### Debugging
```javascript
// Backend (NestJS)
console.log('Debug:', data)

// Frontend (Next.js)
console.log('Debug:', data)
// Or use React Query DevTools
```

### Database Inspection
```bash
# Open Prisma Studio
npx prisma studio
# Opens at: http://localhost:5555
```

### Reset Database (if needed)
```bash
# WARNING: This will delete all data
npx prisma migrate reset
# Then re-run seed scripts
```

---

## 📱 Testing on Mobile

1. Find your local IP:
   ```bash
   ipconfig
   # Look for IPv4 Address: e.g., 192.168.1.100
   ```

2. Update frontend .env:
   ```
   NEXT_PUBLIC_API_URL=http://192.168.1.100:3001
   ```

3. Access from mobile:
   ```
   http://192.168.1.100:3000/super-admin
   ```

---

## 🎉 You're All Set!

Your Super Admin Dashboard is now running!

### Quick Links:
- 🏠 **Dashboard:** http://localhost:3000/super-admin
- 🏢 **Companies:** http://localhost:3000/super-admin/companies
- 💎 **Plans:** http://localhost:3000/super-admin/plans
- 💰 **Revenue:** http://localhost:3000/super-admin/revenue
- 👥 **Users:** http://localhost:3000/super-admin/users
- 📋 **Logs:** http://localhost:3000/super-admin/logs
- 🔧 **System:** http://localhost:3000/super-admin/system
- ⚙️ **Settings:** http://localhost:3000/super-admin/settings

### Next Steps:
1. Explore all pages
2. Configure platform settings
3. Create custom plans
4. Assign plans to companies
5. Monitor system health
6. Track revenue and growth

**Need help?** Check `SUPER_ADMIN_DOCUMENTATION.md` for detailed info.

---

**Happy Managing! 🚀**
