# 🚀 ArwaPark SaaS Landing Page & Demo Request System

A complete SaaS marketing landing page with integrated demo request system, email/WhatsApp notifications, and super-admin management dashboard.

## 📋 Overview

This implementation provides a professional, production-ready landing page for ArwaPark with:

- ✅ **Public Marketing Landing Page** - Hero, features, pricing sections
- ✅ **Demo Request Form** - Only entry point (no public signup)
- ✅ **Email Notifications** - Beautiful HTML emails to admin
- ✅ **WhatsApp Notifications** - Mock service ready for Twilio/Meta API
- ✅ **Super-Admin Dashboard** - Manage and track all demo requests
- ✅ **Status Workflow** - NEW → CONTACTED → CONVERTED/REJECTED
- ✅ **Analytics** - Track conversion rates and request statistics

## 🎯 Features

### Landing Page (`/`)
- **Hero Section**: Compelling headline with CTA buttons
- **Features Section**: 6 key features with icons (Fleet Management, Trip Planning, Invoicing, Expense Tracking, Driver Management, Security)
- **Pricing Section**: 3 plans (Starter, Pro, Enterprise) with detailed features
- **Mobile Responsive**: Fully responsive design with mobile menu
- **Modal Form**: Demo request form opens in beautiful modal
- **Professional Design**: Gradient colors, animations, modern UI

### Demo Request Form
- **Validation**: Real-time form validation using react-hook-form
- **Required Fields**: Company name, full name, email, phone, fleet size, interested plan
- **Optional Message**: Additional message field
- **Success State**: Success confirmation with auto-close
- **Error Handling**: User-friendly error messages
- **Plan Pre-selection**: Automatically selects plan when opened from pricing section

### Backend API
- **Public Endpoint**: `POST /api/demo-requests` (no auth required)
- **Admin Endpoints**: GET, PATCH, DELETE (requires SUPERADMIN role)
- **Database**: PostgreSQL with Prisma ORM
- **Validation**: class-validator with DTOs
- **Non-blocking Notifications**: Email and WhatsApp send async

### Email Notifications
- **HTML Template**: Professional gradient design with company branding
- **Rich Content**: All demo request details formatted in table
- **CTA Button**: Direct link to admin dashboard
- **SMTP Support**: Works with Gmail, Outlook, SendGrid, Mailgun, AWS SES
- **Error Resilience**: Failures don't block request submission

### WhatsApp Notifications (Mock)
- **Formatted Messages**: Emoji-rich WhatsApp-style formatting
- **Ready for Integration**: Commented Twilio SDK example included
- **Non-blocking**: Errors don't affect user experience
- **Easy to Enable**: Follow ENVIRONMENT_VARIABLES.md instructions

### Super-Admin Dashboard (`/super-admin/demo-requests`)
- **Overview Stats**: Total, New, Contacted, Converted, Rejected, Conversion Rate
- **Request Table**: Sortable table with all demo requests
- **Status Filters**: Filter by NEW, CONTACTED, CONVERTED, REJECTED
- **Status Management**: Dropdown to update status inline
- **Details Modal**: View full request details with quick status actions
- **Delete Function**: Remove spam or test requests
- **Real-time Updates**: Stats update automatically after changes

## 🗂️ File Structure

```
Backend:
├── prisma/
│   └── schema.prisma                          # DemoRequest model + enum
├── src/modules/demo-requests/
│   ├── demo-requests.module.ts                # Module registration
│   ├── demo-requests.controller.ts            # API endpoints
│   ├── demo-requests.service.ts               # Business logic
│   ├── email.service.ts                       # Email notifications
│   ├── whatsapp.service.ts                    # WhatsApp mock service
│   └── dto/
│       ├── create-demo-request.dto.ts         # Create validation
│       └── update-demo-request.dto.ts         # Update validation

Frontend:
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx                           # Landing page entry
│   │   └── LandingPage.tsx                    # Main landing component
│   ├── api/demo-requests/
│   │   └── route.ts                           # Next.js API route
│   └── super-admin/demo-requests/
│       └── page.tsx                           # Admin management page
├── components/
│   ├── DemoRequestForm.tsx                    # Demo request form
│   └── super-admin/
│       └── SuperAdminSidebar.tsx              # Updated with Demo Requests link

Documentation:
├── ENVIRONMENT_VARIABLES.md                    # Complete env vars guide
├── LANDING_PAGE_README.md                      # This file
└── QUICKSTART.md                               # Updated with new features
```

## 🚀 Quick Start

### 1. Database Setup

Run the migration:
```bash
npx prisma migrate dev --name add_demo_requests
npx prisma generate
```

### 2. Environment Variables

Create `.env` in the backend root:

```bash
# Email Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="ArwaPark <noreply@arwapark.com>"
ADMIN_EMAIL="admin@yourcompany.com"

# Application
APP_URL="http://localhost:3001"

# WhatsApp (Optional)
ADMIN_WHATSAPP="+212600000000"
```

See [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md) for detailed setup instructions.

### 3. Install Dependencies

```bash
# Backend
npm install

# Frontend
cd frontend
npm install
```

### 4. Start the Application

```bash
# Backend (Terminal 1)
npm run start:dev

# Frontend (Terminal 2)
cd frontend
npm run dev
```

### 5. Access the Application

- **Landing Page**: http://localhost:3001
- **Login**: http://localhost:3001/login
- **Super-Admin Dashboard**: http://localhost:3001/super-admin
- **Demo Requests Management**: http://localhost:3001/super-admin/demo-requests

## 🧪 Testing

### Test Demo Request Submission

1. Open http://localhost:3001
2. Click "Request Demo" button in hero or pricing section
3. Fill out the form with test data
4. Submit and verify:
   - Success message appears
   - Email received at ADMIN_EMAIL
   - Request appears in super-admin dashboard
   - WhatsApp log appears in backend console

### Test Status Workflow

1. Log in as super-admin
2. Navigate to Demo Requests page
3. View new request (should be status: NEW)
4. Update status to CONTACTED
5. Mark as CONVERTED or REJECTED
6. Verify stats update correctly

### API Testing (cURL)

```bash
# Create demo request
curl -X POST http://localhost:3000/demo-requests \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Test Transport Co",
    "fullName": "Ahmed Benali",
    "email": "ahmed@test.com",
    "phone": "+212600000000",
    "fleetSize": "15",
    "interestedPlan": "PRO",
    "message": "Interested in trying ArwaPark for our fleet"
  }'

# Get all requests (requires auth token)
curl -X GET http://localhost:3000/demo-requests \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Update status (requires auth token)
curl -X PATCH http://localhost:3000/demo-requests/REQUEST_ID \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "CONTACTED"}'
```

## 📊 Database Schema

```prisma
enum DemoRequestStatus {
  NEW
  CONTACTED
  CONVERTED
  REJECTED
}

model DemoRequest {
  id             String             @id @default(cuid())
  companyName    String
  fullName       String
  email          String
  phone          String
  fleetSize      String
  interestedPlan String
  message        String?
  status         DemoRequestStatus  @default(NEW)
  createdAt      DateTime           @default(now())
  updatedAt      DateTime           @updatedAt

  @@index([status])
  @@index([createdAt])
}
```

## 🎨 Customization

### Modify Landing Page Content

Edit `frontend/app/(marketing)/LandingPage.tsx`:

```tsx
// Hero headline
<h1>Your Custom Headline</h1>

// Pricing plans
const plans = [
  { name: 'Starter', price: '1,500 DH', features: [...] },
  // Add or modify plans
]

// Features
const features = [
  { icon: Truck, title: 'Feature Name', description: '...' },
  // Add or modify features
]
```

### Customize Email Template

Edit `src/modules/demo-requests/email.service.ts`:

```typescript
const html = `
  <!-- Modify HTML structure, colors, fonts, etc. -->
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
    <!-- Your custom design -->
  </div>
`
```

### Add More Status Types

1. Update enum in `prisma/schema.prisma`:
```prisma
enum DemoRequestStatus {
  NEW
  CONTACTED
  QUALIFIED  // New status
  DEMO_SCHEDULED  // New status
  CONVERTED
  REJECTED
}
```

2. Run migration:
```bash
npx prisma migrate dev --name add_new_statuses
```

3. Update frontend status badges in `frontend/app/super-admin/demo-requests/page.tsx`

## 🔒 Security Considerations

### Public Endpoints
- Demo request submission is **intentionally public** (no auth required)
- Implement rate limiting to prevent abuse
- Add CAPTCHA for production (Google reCAPTCHA recommended)
- Validate and sanitize all inputs (already implemented with class-validator)

### Admin Endpoints
- Protected with JWT authentication
- Requires SUPERADMIN role
- All modifications are logged (can be extended)

### Email Security
- Use environment variables for credentials (never hardcode)
- Use App Passwords for Gmail (not regular password)
- Consider dedicated transactional email service for production

## 🚀 Production Deployment

### Pre-deployment Checklist

- [ ] Update all environment variables (see ENVIRONMENT_VARIABLES.md)
- [ ] Change JWT secrets to strong random strings
- [ ] Set up production SMTP credentials
- [ ] Configure production DATABASE_URL
- [ ] Set APP_URL to production domain
- [ ] Add rate limiting middleware
- [ ] Implement CAPTCHA on demo form
- [ ] Set up monitoring (Sentry, LogRocket, etc.)
- [ ] Configure SSL/TLS certificates
- [ ] Set up backup strategy for database
- [ ] Test email deliverability
- [ ] Enable WhatsApp integration (if needed)

### Recommended Services

**Email**:
- SendGrid (99% deliverability, free tier available)
- Mailgun (Developer-friendly, good pricing)
- AWS SES (Cheapest for high volume)

**WhatsApp**:
- Twilio WhatsApp API (Easiest to integrate)
- Meta WhatsApp Business API (Official, more features)

**Monitoring**:
- Sentry (Error tracking)
- LogRocket (Session replay)
- Google Analytics (Traffic analytics)

## 📈 Analytics & Tracking

Current built-in analytics:
- Total demo requests
- Requests by status (NEW, CONTACTED, CONVERTED, REJECTED)
- Conversion rate calculation
- Date-based filtering (can be extended)

To add Google Analytics:

1. Add to `frontend/.env.local`:
```bash
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

2. Add tracking script to `frontend/app/layout.tsx`

3. Track demo request submissions:
```typescript
// In DemoRequestForm.tsx
gtag('event', 'demo_request_submitted', {
  plan: data.interestedPlan,
  fleet_size: data.fleetSize,
})
```

## 🐛 Troubleshooting

### Email not sending
- Check SMTP credentials in .env
- Verify SMTP_PORT (587 for TLS, 465 for SSL)
- For Gmail: use App Password, not regular password
- Check backend console for error messages

### Demo requests not appearing in admin dashboard
- Verify backend is running
- Check database connection
- Ensure migrations are applied
- Verify JWT token is valid

### Landing page not loading
- Check frontend is running on port 3001
- Verify NEXT_PUBLIC_API_URL is correct
- Check browser console for errors

### WhatsApp not working
- Currently mock implementation (logs only)
- See ENVIRONMENT_VARIABLES.md to enable Twilio

## 📝 License

Proprietary - ArwaPark SaaS Platform

## 👥 Support

For support or questions:
- Email: support@arwapark.com
- Documentation: See other README files in project root

---

**Built with** ❤️ **using Next.js, NestJS, Prisma, and TypeScript**
