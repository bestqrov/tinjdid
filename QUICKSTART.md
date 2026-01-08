# Quick Start Guide - Backend APIs

## Prerequisites
- Node.js (v16 or higher)
- PostgreSQL database running
- .env file configured with DATABASE_URL

## Installation & Setup

### 1. Install Dependencies
```bash
cd c:\Users\Bismilah\Desktop\abdoapp
npm install
```

### 2. Generate Prisma Client
```bash
npx prisma generate
```

### 3. Apply Database Migrations
```bash
npx prisma migrate deploy
```
Or for development:
```bash
npx prisma migrate dev
```

### 4. Start Backend Server
```bash
npm run start:dev
```

The API will be available at: **http://localhost:3001**

---

## Testing the APIs

### Get an Auth Token

First, login to get a JWT token:
```bash
POST http://localhost:3001/api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "your-password"
}
```

Save the token from the response. You'll need it for all other requests.

---

## API Examples

### 1. Create Fuel Entry

```bash
POST http://localhost:3001/api/consommation/carburant
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "vehicle": "vehicle-id-here",
  "date": "2024-01-01",
  "fuelType": "Diesel",
  "station": "Station Mobil",
  "quantity": 50,
  "unitPrice": 12.5,
  "amountTTC": 625,
  "plein": true,
  "kilometrage": 15000
}
```

### 2. Get All Fuel Entries

```bash
GET http://localhost:3001/api/consommation/carburant
Authorization: Bearer YOUR_TOKEN_HERE
```

### 3. Create Highway Toll

```bash
POST http://localhost:3001/api/consommation/autoroutes
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "vehicle": "vehicle-id-here",
  "date": "2024-01-01",
  "entryGate": "Casablanca",
  "exitGate": "Rabat",
  "paymentMode": "Carte bancaire",
  "amountTTC": 45
}
```

### 4. Update Company Profile

```bash
PUT http://localhost:3001/api/settings/company-profile
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "name": "My Transport Company",
  "tagline": "Excellence in Transportation",
  "phone": "+212 5 XX XX XX XX",
  "email": "contact@company.ma",
  "address": "123 Main St, Casablanca",
  "country": "Maroc"
}
```

### 5. Create Card

```bash
POST http://localhost:3001/api/cartes
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "number": "1234567890",
  "type": "Fuel Card",
  "holder": "Driver Name",
  "balance": 1000,
  "status": "active"
}
```

### 6. Get All Cards

```bash
GET http://localhost:3001/api/cartes
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## File Upload Example

For endpoints that support file upload (carburant, autoroutes, depenses, services, frais-generaux), use multipart/form-data:

```bash
POST http://localhost:3001/api/consommation/carburant
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: multipart/form-data

Form Data:
- vehicle: vehicle-id-here
- date: 2024-01-01
- fuelType: Diesel
- quantity: 50
- unitPrice: 12.5
- attachment: [your-file.pdf]
```

---

## Available Endpoints

### Consommation Module
- **Carburant**: /api/consommation/carburant
- **Autoroutes**: /api/consommation/autoroutes
- **Depenses**: /api/consommation/depenses
- **Services**: /api/consommation/services
- **Frais Généraux**: /api/consommation/frais-generaux
- **Recharges Cartes**: /api/consommation/recharges-cartes

### Settings Module
- **Company Profile**: /api/settings/company-profile
- **Appearance**: /api/settings/appearance
- **Backup**: /api/settings/backup
- **Security**: /api/settings/security
- **System Info**: /api/settings/system-info

### Cartes Module
- **Cards CRUD**: /api/cartes
- **Activate**: /api/cartes/:id/activate
- **Deactivate**: /api/cartes/:id/deactivate

### Existing Modules
- **Auth**: /api/auth
- **Companies**: /api/companies
- **Vehicles**: /api/vehicles
- **Drivers**: /api/drivers
- **Trips**: /api/trips
- **Quotes**: /api/quotes
- **Invoices**: /api/invoices
- **Charges**: /api/charges
- **Dashboard**: /api/dashboard
- **Finance**: /api/finance
- **Contracts**: /api/contracts

---

## Common HTTP Methods

- **GET** - Retrieve data (list all or get one)
- **POST** - Create new entry
- **PUT** - Update existing entry
- **DELETE** - Remove entry

---

## Response Format

### Success Response
```json
{
  "data": {...},
  "message": "Operation completed successfully"
}
```

### Error Response
```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Bad Request"
}
```

---

## Troubleshooting

### Database Connection Error
- Check your .env file has correct DATABASE_URL
- Ensure PostgreSQL is running
- Run `npx prisma migrate deploy`

### Authentication Error
- Make sure you're using a valid JWT token
- Token should be in format: `Bearer YOUR_TOKEN`
- Token might be expired, get a new one from /api/auth/login

### Module Not Found
- Run `npm install` to ensure all dependencies are installed
- Run `npx prisma generate` to regenerate Prisma client

### TypeScript Errors
- The project should auto-compile on changes
- If errors persist, restart the dev server: `npm run start:dev`

---

## Database Management

### View Database
```bash
npx prisma studio
```
This opens a web interface to view/edit database records.

### Reset Database (WARNING: Deletes all data)
```bash
npx prisma migrate reset
```

### Create New Migration
```bash
npx prisma migrate dev --name your_migration_name
```

---

## Development Tips

1. **Auto-Reload**: The dev server automatically reloads on file changes
2. **Logging**: Check console output for request logs and errors
3. **Database**: Use Prisma Studio to inspect database during development
4. **Testing**: Use Postman or Thunder Client VS Code extension for API testing
5. **Documentation**: Refer to API_DOCUMENTATION.md for complete endpoint reference

---

## Next Steps

1. **Implement Business Logic**: Currently services return mock data. Implement actual Prisma queries.
2. **Add Pagination**: Add pagination to list endpoints
3. **Implement Filtering**: Add query parameters for filtering results
4. **File Storage**: Configure file upload destination (local or cloud)
5. **Error Handling**: Add comprehensive error handling
6. **Testing**: Write unit and integration tests
7. **RBAC**: Implement role-based access control
8. **Validation**: Enhance input validation

---

## Support

For issues or questions:
1. Check IMPLEMENTATION_SUMMARY.md for architecture overview
2. Check API_DOCUMENTATION.md for detailed API reference
3. Review code comments in controller/service files
4. Check console logs for error details

---

**Status**: Backend APIs are ready for testing and implementation!
