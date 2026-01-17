# API Documentation

## Base URL
- Development: `http://localhost:3001/api`
- Authentication: Bearer Token (JWT)

## Table of Contents

1. [Consommation Module](#1-consommation-module) - Fuel, highways, expenses, services, overhead costs
2. [Cartes Module](#2-cartes-module-card-management) - Card management
3. [Settings Module](#3-settings-module) - Company profile, appearance, backup, security
4. [Authentication Module](#4-authentication-module) - Login, logout, password reset
5. [Quotes Module](#5-quotes-module) - Quote management and conversion
6. [Trips Module](#6-trips-module) - Trip management and profit calculation
7. [Dashboard Module](#7-dashboard-module) - Dashboard statistics
8. [Vehicles Module](#8-vehicles-module) - Vehicle management
9. [Drivers Module](#9-drivers-module) - Driver management and profiles
10. [Invoices Module](#10-invoices-module) - Invoice management
11. [Charges Module](#11-charges-module) - Charge tracking
12. [Companies Module](#12-companies-module) - Company management
13. [Finance Module](#13-finance-module) - PDF generation and financial stats
14. [Contracts Module](#14-contracts-module) - Contract management
15. [Role-Based Access Control](#role-based-access-control-rbac) - RBAC overview
16. [Response Format](#response-format) - Standard response structure
17. [File Upload](#file-upload) - File upload guidelines
18. [Database Models](#database-models) - Data model reference

## API Overview

This API provides comprehensive fleet management functionality including:

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **Fleet Operations**: Vehicles, drivers, trips, and quotes management
- **Financial Management**: Invoices, charges, expenses, and financial reporting
- **Consumption Tracking**: Fuel, highway tolls, services, and overhead costs
- **Card Management**: Fuel cards and recharge tracking
- **Document Generation**: PDF generation for quotes and invoices
- **Multi-tenancy**: Company-based data isolation

## Authentication Required
All endpoints require JWT authentication via `Authorization: Bearer <token>` header unless explicitly marked as public.

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

## 4. Authentication Module

### POST /auth/login
Login with email and password
- **Body**: LoginDto
  - `email`: string (required)
  - `password`: string (required)
- **Response**: 
  - `access`: JWT access token
  - Sets `refresh_token` httpOnly cookie
- **No authentication required**

### POST /auth/refresh
Refresh access token using refresh token cookie
- **Cookie**: `refresh_token` (httpOnly)
- **Response**: 
  - `access`: New JWT access token
  - Updates `refresh_token` httpOnly cookie
- **No authentication required**

### POST /auth/logout
Logout and invalidate refresh token
- **Cookie**: `refresh_token` (httpOnly)
- **Response**: `{ ok: true }`
- **No authentication required**

### POST /auth/forgot-password
Request password reset
- **Body**:
  - `email`: string (required)
  - `message`: string (optional)
- **Response**: Success message
- **Note**: Creates a password reset request for super admin review
- **No authentication required**

### POST /auth/reset-password
Reset password using token
- **Body**:
  - `token`: string (required)
  - `password`: string (required)
- **Response**: `{ ok: true }`
- **No authentication required**

---

## 5. Quotes Module

### POST /quotes
Create new quote
- **Body**: CreateQuoteDto
- **Query**: `companyId` (optional, defaults to user's company)
- **Roles**: ADMIN, STAFF
- **Response**: Created quote object

### GET /quotes
Get all quotes for company
- **Query**: `companyId` (optional, defaults to user's company)
- **Roles**: ADMIN, STAFF
- **Response**: Array of quote objects

### GET /quotes/:id
Get quote by ID
- **Params**: `id` - Quote ID
- **Roles**: ADMIN, STAFF, DRIVER
- **Response**: Quote object

### POST /quotes/:id/convert-to-trip
Convert quote to trip
- **Params**: `id` - Quote ID
- **Roles**: ADMIN, STAFF
- **Response**: Created trip object

---

## 6. Trips Module

### POST /trips
Create new trip
- **Body**: CreateTripDto
- **Query**: `companyId` (optional, defaults to user's company)
- **Roles**: ADMIN, STAFF
- **Response**: Created trip object

### GET /trips
Get all trips for company
- **Query**: `companyId` (optional, defaults to user's company)
- **Roles**: ADMIN, STAFF, DRIVER
- **Response**: Array of trip objects

### GET /trips/:id
Get trip by ID
- **Params**: `id` - Trip ID
- **Roles**: ADMIN, STAFF, DRIVER
- **Response**: Trip object with full details

### GET /trips/:id/profit
Calculate profit for specific trip
- **Params**: `id` - Trip ID
- **Roles**: ADMIN, STAFF
- **Response**: 
  - `revenue`: Trip revenue
  - `charges`: Total charges
  - `profit`: Net profit

---

## 7. Dashboard Module

### GET /dashboard/totals
Get dashboard summary statistics
- **Query**: `companyId` (optional, defaults to user's company)
- **Roles**: All authenticated users
- **Response**:
  - `revenue`: Total revenue from invoices
  - `charges`: Total charges
  - `profit`: Net profit (revenue - charges)
  - `profitPerTrip`: Array of profit breakdown per trip
  - `tripsCount`: Total number of trips

---

## 8. Vehicles Module

### POST /vehicles
Create new vehicle
- **Body**: CreateVehicleDto
- **Query**: `companyId` (required)
- **File**: `photoPrincipale` (optional)
  - Allowed types: JPG, JPEG, PNG, GIF
  - Max size: 5MB
  - Destination: `./uploads/vehicles`
- **Response**: Created vehicle object

### GET /vehicles
Get all vehicles for company
- **Query**: `companyId` (required)
- **Response**: Array of vehicle objects

### GET /vehicles/:id
Get vehicle by ID
- **Params**: `id` - Vehicle ID
- **Response**: Vehicle object with full details

### DELETE /vehicles/:id
Delete vehicle
- **Params**: `id` - Vehicle ID
- **Response**: Success confirmation

---

## 9. Drivers Module

### POST /drivers
Create new driver
- **Body**: CreateDriverDto
- **Query**: `companyId` (required)
- **Response**: Created driver object

### GET /drivers
Get all drivers for company
- **Query**: `companyId` (required)
- **Response**: Array of driver objects

### GET /drivers/:id
Get driver by ID
- **Params**: `id` - Driver ID
- **Response**: Driver object with full details

### PUT /drivers/:id
Update driver
- **Params**: `id` - Driver ID
- **Body**: UpdateDriverDto
- **Response**: Updated driver object

### DELETE /drivers/:id
Delete driver
- **Params**: `id` - Driver ID
- **Response**: Success confirmation

### GET /drivers/me
Get current driver's profile
- **Authentication**: Required (JWT)
- **Response**: Current driver's profile

### PUT /drivers/me
Update current driver's profile
- **Authentication**: Required (JWT)
- **Body**: UpdateDriverDto
- **File**: `photo` (optional)
- **Response**: Updated driver profile

---

## 10. Invoices Module

### POST /invoices
Create new invoice
- **Body**: CreateInvoiceDto
- **Query**: `companyId` (optional, defaults to user's company)
- **Roles**: ADMIN, STAFF
- **Response**: Created invoice object

### GET /invoices
Get all invoices for company
- **Query**: `companyId` (optional, defaults to user's company)
- **Roles**: ADMIN, STAFF
- **Response**: Array of invoice objects

### GET /invoices/:id
Get invoice by ID
- **Params**: `id` - Invoice ID
- **Roles**: ADMIN, STAFF, DRIVER
- **Response**: Invoice object with full details

### PUT /invoices/:id
Update invoice
- **Params**: `id` - Invoice ID
- **Body**: UpdateInvoiceDto
- **Roles**: ADMIN, STAFF
- **Response**: Updated invoice object

### DELETE /invoices/:id
Delete invoice
- **Params**: `id` - Invoice ID
- **Roles**: ADMIN, STAFF
- **Response**: 204 No Content

---

## 11. Charges Module

### POST /charges
Create new charge
- **Body**: CreateChargeDto
- **Query**: `companyId` (optional, defaults to user's company)
- **Roles**: ADMIN, STAFF
- **Response**: Created charge object

### GET /charges
Get all charges for company
- **Query**: `companyId` (optional, defaults to user's company)
- **Roles**: ADMIN, STAFF
- **Response**: Array of charge objects

### GET /charges/by-trip
Get charges for specific trip
- **Query**: `tripId` (required)
- **Roles**: ADMIN, STAFF, DRIVER
- **Response**: Array of charges for the specified trip

---

## 12. Companies Module

### POST /companies
Create new company
- **Body**: CreateCompanyDto
- **Response**: Created company object
- **Note**: Typically used by super admin

### GET /companies
Get all companies
- **Response**: Array of all company objects
- **Note**: Typically used by super admin

### GET /companies/:id
Get company by ID
- **Params**: `id` - Company ID
- **Response**: Company object with full details

### PATCH /companies/:id
Update company
- **Params**: `id` - Company ID
- **Body**: Partial<CreateCompanyDto>
- **Response**: Updated company object

### DELETE /companies/:id
Delete company
- **Params**: `id` - Company ID
- **Response**: Success confirmation

---

## 13. Finance Module

### GET /finance/quotes/:id/pdf
Generate PDF for quote
- **Params**: `id` - Quote ID
- **Roles**: ADMIN, STAFF
- **Response**: PDF file download
- **Headers**: 
  - `Content-Type: application/pdf`
  - `Content-Disposition: attachment; filename="devis-{id}.pdf"`

### GET /finance/invoices/:id/pdf
Generate PDF for invoice
- **Params**: `id` - Invoice ID
- **Roles**: ADMIN, STAFF
- **Response**: PDF file download
- **Headers**: 
  - `Content-Type: application/pdf`
  - `Content-Disposition: attachment; filename="facture-{id}.pdf"`

### POST /finance/charges
Create new charge (alternative endpoint)
- **Body**: CreateChargeDto
- **Query**: `companyId` (optional, defaults to user's company)
- **Roles**: ADMIN, STAFF
- **Response**: Created charge object

### POST /finance/quotes/:id/convert
Convert quote to invoice
- **Params**: `id` - Quote ID
- **Body**: 
  - `markAccepted`: boolean (optional) - Mark quote as accepted
- **Roles**: ADMIN, STAFF
- **Response**: Created invoice object

### GET /finance/dashboard/stats
Get financial dashboard statistics
- **Query**: 
  - `companyId` (optional, defaults to user's company)
  - `start` (optional) - Start date (ISO string)
  - `end` (optional) - End date (ISO string)
- **Roles**: ADMIN, STAFF, DRIVER
- **Response**: Financial statistics including revenue, expenses, profit, etc.

---

## 14. Contracts Module

### GET /contracts/metadata
Get contract metadata
- **Query**: `companyId` (required)
- **Response**: Contract metadata and statistics

### GET /contracts
Get all contracts for company
- **Query**: `companyId` (required)
- **Response**: Array of contract objects

### POST /contracts
Create new contract
- **Body**: CreateContractDto
- **Query**: `companyId` (required)
- **File**: `attachment` (optional)
  - Destination: `./uploads/contracts`
- **Response**: Created contract object

---

## Role-Based Access Control (RBAC)

The API implements role-based access control with the following roles:

- **SUPER_ADMIN**: Full system access, manages all companies
- **ADMIN**: Company administrator, full access to company data
- **STAFF**: Company staff member, access to most operations
- **DRIVER**: Limited access, primarily to assigned trips and profile

### Guard Stack
Most endpoints use the following guard stack:
1. **JwtGuard**: Validates JWT token
2. **RolesGuard**: Checks user role permissions
3. **CompanyGuard**: Ensures data isolation between companies

### Public Endpoints
The following endpoints do not require authentication:
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`

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

---

## Endpoint Quick Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Login with credentials |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | Logout and invalidate token |
| POST | `/auth/forgot-password` | Request password reset |
| POST | `/auth/reset-password` | Reset password with token |

### Consommation
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/consommation/carburant` | Create fuel entry |
| GET | `/consommation/carburant` | Get all fuel entries |
| GET | `/consommation/carburant/:id` | Get fuel entry by ID |
| PUT | `/consommation/carburant/:id` | Update fuel entry |
| DELETE | `/consommation/carburant/:id` | Delete fuel entry |
| POST | `/consommation/autoroutes` | Create highway toll entry |
| GET | `/consommation/autoroutes` | Get all highway toll entries |
| GET | `/consommation/autoroutes/:id` | Get highway toll by ID |
| PUT | `/consommation/autoroutes/:id` | Update highway toll |
| DELETE | `/consommation/autoroutes/:id` | Delete highway toll |
| POST | `/consommation/depenses` | Create expense |
| GET | `/consommation/depenses` | Get all expenses |
| GET | `/consommation/depenses/:id` | Get expense by ID |
| PUT | `/consommation/depenses/:id` | Update expense |
| DELETE | `/consommation/depenses/:id` | Delete expense |
| POST | `/consommation/services` | Create service entry |
| GET | `/consommation/services` | Get all services |
| GET | `/consommation/services/:id` | Get service by ID |
| PUT | `/consommation/services/:id` | Update service |
| DELETE | `/consommation/services/:id` | Delete service |
| POST | `/consommation/frais-generaux` | Create overhead cost |
| GET | `/consommation/frais-generaux` | Get all overhead costs |
| GET | `/consommation/frais-generaux/:id` | Get overhead cost by ID |
| PUT | `/consommation/frais-generaux/:id` | Update overhead cost |
| DELETE | `/consommation/frais-generaux/:id` | Delete overhead cost |
| POST | `/consommation/recharges-cartes` | Create card recharge |
| GET | `/consommation/recharges-cartes` | Get all card recharges |
| GET | `/consommation/recharges-cartes/:id` | Get card recharge by ID |
| PUT | `/consommation/recharges-cartes/:id` | Update card recharge |
| DELETE | `/consommation/recharges-cartes/:id` | Delete card recharge |
| GET | `/consommation/cartes` | Get all cards for dropdown |

### Cartes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/cartes` | Create new card |
| GET | `/cartes` | Get all cards |
| GET | `/cartes/:id` | Get card by ID |
| PUT | `/cartes/:id` | Update card |
| DELETE | `/cartes/:id` | Delete card |
| PUT | `/cartes/:id/activate` | Activate card |
| PUT | `/cartes/:id/deactivate` | Deactivate card |

### Settings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/settings/company-profile` | Get company profile |
| PUT | `/settings/company-profile` | Update company profile |
| GET | `/settings/appearance` | Get appearance settings |
| PUT | `/settings/appearance` | Update appearance settings |
| GET | `/settings/backup` | Get backup settings |
| PUT | `/settings/backup` | Update backup settings |
| GET | `/settings/security` | Get security settings |
| PUT | `/settings/security` | Update security settings |
| GET | `/settings/system-info` | Get system information |

### Quotes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/quotes` | Create new quote |
| GET | `/quotes` | Get all quotes |
| GET | `/quotes/:id` | Get quote by ID |
| POST | `/quotes/:id/convert-to-trip` | Convert quote to trip |

### Trips
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/trips` | Create new trip |
| GET | `/trips` | Get all trips |
| GET | `/trips/:id` | Get trip by ID |
| GET | `/trips/:id/profit` | Calculate trip profit |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard/totals` | Get dashboard statistics |

### Vehicles
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/vehicles` | Create new vehicle |
| GET | `/vehicles` | Get all vehicles |
| GET | `/vehicles/:id` | Get vehicle by ID |
| DELETE | `/vehicles/:id` | Delete vehicle |

### Drivers
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/drivers` | Create new driver |
| GET | `/drivers` | Get all drivers |
| GET | `/drivers/:id` | Get driver by ID |
| PUT | `/drivers/:id` | Update driver |
| DELETE | `/drivers/:id` | Delete driver |
| GET | `/drivers/me` | Get current driver profile |
| PUT | `/drivers/me` | Update current driver profile |

### Invoices
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/invoices` | Create new invoice |
| GET | `/invoices` | Get all invoices |
| GET | `/invoices/:id` | Get invoice by ID |
| PUT | `/invoices/:id` | Update invoice |
| DELETE | `/invoices/:id` | Delete invoice |

### Charges
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/charges` | Create new charge |
| GET | `/charges` | Get all charges |
| GET | `/charges/by-trip` | Get charges by trip |

### Companies
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/companies` | Create new company |
| GET | `/companies` | Get all companies |
| GET | `/companies/:id` | Get company by ID |
| PATCH | `/companies/:id` | Update company |
| DELETE | `/companies/:id` | Delete company |

### Finance
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/finance/quotes/:id/pdf` | Generate quote PDF |
| GET | `/finance/invoices/:id/pdf` | Generate invoice PDF |
| POST | `/finance/charges` | Create charge |
| POST | `/finance/quotes/:id/convert` | Convert quote to invoice |
| GET | `/finance/dashboard/stats` | Get financial statistics |

### Contracts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/contracts/metadata` | Get contract metadata |
| GET | `/contracts` | Get all contracts |
| POST | `/contracts` | Create new contract |

---

## Version History

- **v1.0** - Initial comprehensive API documentation
  - Documented all 14 modules
  - Added RBAC documentation
  - Added endpoint quick reference
  - Added database model descriptions

---

**Last Updated**: January 17, 2026  
**API Version**: 1.0  
**Documentation Status**: Complete
