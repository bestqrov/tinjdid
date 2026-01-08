# ArwaPark SaaS - Environment Variables Documentation

This document describes all required environment variables for the ArwaPark SaaS platform, including the new landing page and demo request system.

## Backend (.env)

### Database
```bash
DATABASE_URL="mongodb+srv://user:password@cluster.mongodb.net/arwapark?retryWrites=true&w=majority"
```
رابط اتصال MongoDB لـ Prisma ORM.

### JWT Authentication
```bash
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_REFRESH_SECRET="your-refresh-token-secret-change-in-production"
```
Secret keys for JWT token generation and validation. **MUST be changed in production!**

### Email Configuration (SMTP)
```bash
# SMTP Server Configuration
SMTP_HOST="smtp.gmail.com"              # For Gmail
SMTP_PORT=587                           # Use 587 for TLS, 465 for SSL
SMTP_USER="your-email@gmail.com"        # Your email address
SMTP_PASS="your-app-specific-password"  # Gmail App Password (not regular password)
SMTP_FROM="ArwaPark <noreply@arwapark.com>"  # From email display name

# Admin Notifications
ADMIN_EMAIL="admin@yourcompany.com"     # Email to receive demo request notifications
```

**Gmail Setup:**
1. Enable 2-Factor Authentication in your Google Account
2. Go to: https://myaccount.google.com/apppasswords
3. Generate an App Password for "Mail"
4. Use that 16-character password as SMTP_PASS

**Other Email Providers:**
- **Outlook/Office365**: smtp.office365.com:587
- **SendGrid**: smtp.sendgrid.net:587 (use API key as password)
- **Mailgun**: smtp.mailgun.org:587
- **AWS SES**: email-smtp.region.amazonaws.com:587

### WhatsApp Configuration (Optional)
```bash
# WhatsApp Notifications - Currently Mock Implementation
ADMIN_WHATSAPP="+212600000000"          # Admin WhatsApp number to receive alerts

# When ready to integrate Twilio (uncomment and configure):
# TWILIO_ACCOUNT_SID="your-twilio-account-sid"
# TWILIO_AUTH_TOKEN="your-twilio-auth-token"
# TWILIO_WHATSAPP_FROM="whatsapp:+14155238886"  # Your Twilio WhatsApp number
```

**To Enable Real WhatsApp (Twilio):**
1. Sign up at https://www.twilio.com/
2. Get your Account SID and Auth Token
3. Request WhatsApp sandbox or production number
4. Uncomment the configuration above
5. Update `src/modules/demo-requests/whatsapp.service.ts` with Twilio SDK implementation

### Application Configuration
```bash
APP_URL="http://localhost:3001"         # Frontend URL (used in email links)
PORT=3000                               # Backend server port (default: 3000)
```

## Frontend (.env.local)

```bash
# Backend API URL
NEXT_PUBLIC_API_URL="http://localhost:3000"

# Optional: Google Analytics
# NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

## Example .env File (Backend)

Create `c:\Users\Bismilah\Desktop\abdoapp\.env`:

```bash
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/arwapark?schema=public"

# JWT
JWT_SECRET="change-this-to-a-random-string-in-production-min-32-chars"
JWT_REFRESH_SECRET="another-random-string-for-refresh-tokens-min-32-chars"

# Email (Gmail Example)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-16-char-app-password"
SMTP_FROM="ArwaPark <noreply@arwapark.com>"
ADMIN_EMAIL="admin@yourcompany.com"

# WhatsApp (Mock for now)
ADMIN_WHATSAPP="+212600000000"

# Application
APP_URL="http://localhost:3001"
PORT=3000
```

## Example .env.local File (Frontend)

Create `c:\Users\Bismilah\Desktop\abdoapp\frontend\.env.local`:

```bash
NEXT_PUBLIC_API_URL="http://localhost:3000"
```

## Production Considerations

### Security Checklist:
- [ ] Change all JWT secrets to strong random strings (min 32 characters)
- [ ] Use environment-specific SMTP credentials (not personal Gmail)
- [ ] Set APP_URL to your production domain (https://yourdomain.com)
- [ ] Use production database with strong password
- [ ] Enable SSL/TLS for database connections
- [ ] Store secrets in secure vault (AWS Secrets Manager, Azure Key Vault, etc.)
- [ ] Never commit .env files to version control

### Email Best Practices:
- Use a dedicated transactional email service (SendGrid, Mailgun, AWS SES)
- Set up SPF, DKIM, and DMARC records for your domain
- Use a dedicated sending domain (e.g., mail.arwapark.com)
- Monitor bounce rates and spam complaints
- Implement rate limiting to prevent abuse

### WhatsApp Best Practices:
- Use Twilio or official Meta WhatsApp Business API for production
- Get your WhatsApp business account verified
- Follow WhatsApp's messaging policy (no spam, user-initiated only)
- Implement opt-in/opt-out mechanisms
- Monitor message delivery status

## Testing Email Configuration

Run this command to test your SMTP setup:

```bash
# From backend directory
npm run test-email
```

Or manually test using:

```bash
curl -X POST http://localhost:3000/demo-requests \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Test Company",
    "fullName": "John Doe",
    "email": "test@example.com",
    "phone": "+212600000000",
    "fleetSize": "10",
    "interestedPlan": "STARTER",
    "message": "This is a test request"
  }'
```

Check your ADMIN_EMAIL inbox for the notification.

## Troubleshooting

### Email not sending:
1. Check SMTP credentials are correct
2. Verify SMTP_PORT (587 for TLS, 465 for SSL)
3. For Gmail: ensure App Password is used (not regular password)
4. Check firewall allows outbound connections on SMTP_PORT
5. Review backend console for error messages

### Demo requests not appearing:
1. Verify DATABASE_URL is correct and database is running
2. Check migrations are applied: `npx prisma migrate deploy`
3. Verify backend is running: `npm run start`
4. Check frontend API_URL points to correct backend

### WhatsApp not working:
- Currently using mock implementation (only logs to console)
- See WhatsApp Configuration section above to enable real integration

## Support

For additional help with configuration, contact the development team or refer to:
- Nodemailer docs: https://nodemailer.com/
- Twilio WhatsApp docs: https://www.twilio.com/docs/whatsapp
- Prisma docs: https://www.prisma.io/docs
