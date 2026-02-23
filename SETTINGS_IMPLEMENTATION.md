# Company Profile Settings - Implementation

## What Was Implemented

### Backend Changes

1. **Database Storage** - Company profile data is now stored in the `CompanyProfile` table:
   - Logo (file path)
   - Company name
   - Tagline/slogan
   - Phone number
   - Email address
   - Website URL
   - Physical address
   - Country

2. **File Upload System**:
   - Logo files are uploaded to `/uploads` directory
   - Files are stored with random names to prevent conflicts
   - Supported formats: Any image format (jpg, png, svg, etc.)
   - Files are served statically at `http://localhost:3001/uploads/filename`

3. **API Endpoints**:
   - `GET /api/settings/company-profile` - Fetch current profile
   - `PUT /api/settings/company-profile` - Save/update profile with logo upload

### Frontend Changes

1. **Auto-load Existing Data**:
   - On page load, fetches existing company profile from database
   - Pre-fills all form fields with saved data

2. **Save Functionality**:
   - Saves all fields including logo to database
   - Shows success/error messages
   - Supports file upload for logo

3. **Live Preview**:
   - Shows how the profile will look in real-time
   - Updates as user types

## How to Use

1. **Navigate to Settings** (Paramètres in menu)
2. **Open "Profil Société" section** (should be open by default)
3. **Fill in all fields**:
   - Upload a logo (optional)
   - Enter company name
   - Add tagline/slogan
   - Provide contact information
4. **Click "💾 Enregistrer le profil"**
5. **Confirmation message** will appear

## Technical Details

### File Upload
- Files are saved to: `c:\Users\Bismilah\Desktop\abdoapp\uploads\`
- Format: Random 32-character hex filename + original extension
- Example: `a7f3e2c1d9b8f4e6a7f3e2c1d9b8f4e6.png`

### Database Schema
```prisma
model CompanyProfile {
  id        String   @id @default(uuid())
  companyId String   @unique
  company   Company  @relation(fields: [companyId], references: [id], onDelete: Cascade)
  logo      String?
  name      String?
  tagline   String?
  phone     String?
  email     String?
  website   String?
  address   String?
  country   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### API Request Format

**Fetch Profile:**
```bash
GET /api/settings/company-profile
Authorization: Bearer <token>
```

**Update Profile:**
```bash
PUT /api/settings/company-profile
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
- logo: [file]
- name: "Company Name"
- tagline: "Company Slogan"
- phone: "+212 5XX XX XX XX"
- email: "contact@company.com"
- website: "https://company.com"
- address: "123 Street, City"
- country: "Maroc"
```

## Features

✅ **Persistent Storage** - All data saved to PostgreSQL database
✅ **File Upload** - Logo images uploaded and stored
✅ **Auto-load** - Existing data loaded on page load
✅ **Live Preview** - See changes in real-time
✅ **Success Messages** - Visual feedback on save
✅ **Multi-tenant** - Each company has their own profile
✅ **Validation** - Backend validates all inputs
✅ **Static File Serving** - Uploaded files accessible via URL

## Testing

1. **Start Backend**: `npm run start:dev` (from root)
2. **Start Frontend**: `cd frontend && npm run dev`
3. **Navigate to**: http://localhost:3000/settings
4. **Login if needed**
5. **Fill form and save**
6. **Refresh page** - Data should persist
7. **Check database**: Use Prisma Studio (`npx prisma studio`)

## Notes

- Logo files are stored permanently in uploads folder
- Each company can only have one profile (upsert operation)
- File paths are stored as relative URLs: `/uploads/filename.ext`
- Images are served at: `http://localhost:3001/uploads/filename.ext`
- Frontend can display uploaded logos by using the API URL

## Future Enhancements

- [ ] Add image size validation (max 2MB)
- [ ] Add image format validation (jpg, png, svg only)
- [ ] Add image cropping/resizing
- [ ] Delete old logo when uploading new one
- [ ] Add more profile fields if needed
- [ ] Export profile as PDF
- [ ] Share profile publicly with unique URL
