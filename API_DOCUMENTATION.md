# API Documentation

## Base URL
- Development: `http://localhost:3001/api`
- Authentication: Bearer Token (JWT)

## Authentication Required
All endpoints require JWT authentication via `Authorization: Bearer <token>` header.

---

## 1. Consommation Module

### Carburant (Fuel)

#### POST /consommation/carburant
Create new fuel entry
- **Body**: CreateCarburantDto
- **File**: attachment (optional)
- **Fields**: vehicle, collaborator, number, date, time, fuelType, station, paymentMode, quantity, unitPrice, amountHT, tva, amountTTC, plein, kilometrage, distance, percentConso, indexHoraire, comment

#### GET /consommation/carburant
Get all fuel entries

#### GET /consommation/carburant/:id
Get fuel entry by ID

#### PUT /consommation/carburant/:id
Update fuel entry
- **Body**: CreateCarburantDto
- **File**: attachment (optional)

#### DELETE /consommation/carburant/:id
Delete fuel entry

---

### Autoroutes (Highways)

#### POST /consommation/autoroutes
Create highway toll entry
- **Body**: CreateAutoRouteDto
- **File**: attachment (optional)
- **Fields**: vehicle, collaborator, date, time, entryGate, exitGate, paymentMode, amountTTC, comment

#### GET /consommation/autoroutes
Get all highway toll entries

#### GET /consommation/autoroutes/:id
Get highway toll entry by ID

#### PUT /consommation/autoroutes/:id
Update highway toll entry

#### DELETE /consommation/autoroutes/:id
Delete highway toll entry

---

### Depenses (Expenses)

#### POST /consommation/depenses
Create expense entry
- **Body**: CreateDepenseDto
- **File**: attachment (optional)
- **Fields**: date, category, amount, tva, comment

#### GET /consommation/depenses
Get all expenses

#### GET /consommation/depenses/:id
Get expense by ID

#### PUT /consommation/depenses/:id
Update expense

#### DELETE /consommation/depenses/:id
Delete expense

---

### Services

#### POST /consommation/services
Create service entry
- **Body**: CreateServiceDto
- **File**: attachment (optional)
- **Fields**: vehicle, date, serviceType, provider, amount, comment

#### GET /consommation/services
Get all services

#### GET /consommation/services/:id
Get service by ID

#### PUT /consommation/services/:id
Update service

#### DELETE /consommation/services/:id
Delete service

---

### Frais Généraux (Overhead Costs)

#### POST /consommation/frais-generaux
Create overhead cost entry
- **Body**: CreateFraisGenerauxDto
- **File**: attachment (optional)
- **Fields**: date, category, amount, comment

#### GET /consommation/frais-generaux
Get all overhead costs

#### GET /consommation/frais-generaux/:id
Get overhead cost by ID

#### PUT /consommation/frais-generaux/:id
Update overhead cost

#### DELETE /consommation/frais-generaux/:id
Delete overhead cost

---

### Recharges Cartes (Card Recharges)

#### POST /consommation/recharges-cartes
Create card recharge entry
- **Body**: CreateRechargeCarteDto
- **Fields**: card, date, amount, provider, comment

#### GET /consommation/recharges-cartes
Get all card recharges

#### GET /consommation/recharges-cartes/:id
Get card recharge by ID

#### PUT /consommation/recharges-cartes/:id
Update card recharge

#### DELETE /consommation/recharges-cartes/:id
Delete card recharge

---

### Cartes List

#### GET /consommation/cartes
Get all cards (for dropdown selections)

---

## 2. Cartes Module (Card Management)

#### POST /cartes
Create new card
- **Body**: CreateCarteDto
- **Fields**: number, type, holder, vehicle, balance, status, expirationDate, comment

#### GET /cartes
Get all cards

#### GET /cartes/:id
Get card by ID

#### PUT /cartes/:id
Update card

#### DELETE /cartes/:id
Delete card

#### PUT /cartes/:id/activate
Activate card

#### PUT /cartes/:id/deactivate
Deactivate card

---

## 3. Settings Module

### Company Profile

#### GET /settings/company-profile
Get company profile
- **Response**: logo, name, tagline, phone, email, website, address, country

#### PUT /settings/company-profile
Update company profile
- **Body**: UpdateCompanyProfileDto
- **File**: logo (optional)
- **Fields**: name, tagline, phone, email, website, address, country

---

### Appearance Settings

#### GET /settings/appearance
Get appearance settings
- **Response**: theme (light|dark|system)

#### PUT /settings/appearance
Update appearance settings
- **Body**: UpdateAppearanceDto
- **Fields**: theme

---

### Backup Settings

#### GET /settings/backup
Get backup settings
- **Response**: frequency, storage

#### PUT /settings/backup
Update backup settings
- **Body**: UpdateBackupDto
- **Fields**: frequency (daily|weekly|monthly), storage (local|cloud)

---

### Security Settings

#### GET /settings/security
Get security settings
- **Response**: twoFactorEnabled, passwordPolicy

#### PUT /settings/security
Update security settings
- **Body**: UpdateSecurityDto
- **Fields**: twoFactorEnabled, passwordPolicy (low|medium|high)

---

### System Info

#### GET /settings/system-info
Get system information
- **Response**: version, lastUpdate, updateAvailable

---

## Existing Modules (Already Implemented)

- **Auth** - /auth
- **Companies** - /companies
- **Vehicles** - /vehicles
- **Drivers** - /drivers
- **Trips** - /trips
- **Quotes** - /quotes
- **Invoices** - /invoices
- **Charges** - /charges
- **Dashboard** - /dashboard
- **Finance** - /finance
- **Contracts** - /contracts
- **Administratif** - /administratif

---

## Response Format

All responses follow this structure:

```json
{
  "data": {...},
  "message": "Operation completed successfully"
}
```

Error responses:
```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Bad Request"
}
```

---

## File Upload

For endpoints that support file upload, use `multipart/form-data` with the field name `attachment` or `logo`.

Maximum file size: TBD
Allowed types: PDF, Images (JPG, PNG), Documents

---

## Database Models

### Carburant
- Vehicle reference
- Fuel details (type, station, quantity, price)
- Kilometrage and consumption tracking
- Optional attachment

### Autoroute
- Vehicle reference
- Entry/exit gates
- Payment details
- Optional attachment

### Depense
- Category-based expense tracking
- TVA calculation
- Optional attachment

### Service
- Vehicle maintenance tracking
- Service provider details
- Optional attachment

### FraisGeneraux
- General overhead costs
- Category-based tracking
- Optional attachment

### RechargeCarte
- Card recharge tracking
- Provider and amount
- References Carte model

### Carte
- Card number and type
- Holder information
- Vehicle assignment
- Balance tracking
- Status management (active/inactive/blocked)

### CompanyProfile
- Company branding (logo, name, tagline)
- Contact information
- Address details

### AppSettings
- Theme preferences
- Application-wide settings

---

## Notes

1. All timestamps are stored in ISO 8601 format
2. Financial amounts are stored as Float
3. All models have `createdAt` and `updatedAt` timestamps
4. Soft delete is not implemented - DELETE endpoints permanently remove records
5. Multi-tenancy is handled via `companyId` - users only see their company's data
6. File uploads are handled via multer middleware
7. All endpoints are protected by JWT authentication
8. Role-based access control (RBAC) should be implemented per business requirements
