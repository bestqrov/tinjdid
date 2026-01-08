# Super Admin Dashboard - ArwaPark

## 📋 Vue d'ensemble

Le Super Admin Dashboard est une interface complète de gestion de la plateforme SaaS ArwaPark. Il permet au propriétaire de la plateforme de gérer l'ensemble des entreprises clientes, abonnements, revenus et utilisateurs.

## 🎯 Fonctionnalités Principales

### 1. Dashboard Global (/)
- **KPIs en temps réel:**
  - Total entreprises, entreprises actives, entreprises en essai
  - Total utilisateurs et trajets
  - MRR (Monthly Recurring Revenue)
  - ARR (Annual Recurring Revenue)
  - Taux de churn
  - Profit de la plateforme

- **Graphiques:**
  - Évolution MRR sur 90 jours
  - Volume de trajets
  - Revenus par plan
  - Entreprises récentes

### 2. Gestion des Entreprises (/super-admin/companies)
- Liste complète de toutes les entreprises
- Filtrage par statut (Active, Trial, Suspended, Expired, Canceled)
- Actions:
  - Voir détails d'une entreprise
  - Suspendre/Activer une entreprise
  - Changer le plan d'abonnement
  - Supprimer une entreprise (soft delete)

### 3. Plans & Abonnements (/super-admin/plans)
- Gestion des plans d'abonnement
- Types de plans: Basic, Pro, Enterprise, Custom
- Configuration:
  - Limites utilisateurs
  - Limites véhicules
  - Limites trajets
  - Prix mensuel/annuel
  - Modules activés
- Création, modification et suppression de plans

### 4. Revenus & Finance (/super-admin/revenue)
- Vue d'ensemble financière
- MRR et ARR détaillés
- Revenu moyen par entreprise
- Statut des paiements (Payés, En attente, Échoués)
- Répartition des revenus par plan
- Export de données (CSV, JSON)

### 5. Gestion des Utilisateurs (/super-admin/users)
- Liste globale de tous les utilisateurs
- Filtrage par entreprise et rôle
- Actions:
  - Réinitialiser mot de passe
  - Bloquer/Débloquer utilisateur
  - Vue détaillée par utilisateur

### 6. Journaux d'Activité (/super-admin/logs)
- Traçabilité complète des actions
- Types d'actions trackées:
  - Création/suspension/activation d'entreprise
  - Changement de plan
  - Blocage d'utilisateur
  - Paiements reçus/échoués
  - Modifications de paramètres
- Filtrage par entreprise et type d'action

### 7. Santé du Système (/super-admin/system)
- Monitoring en temps réel
- Statut API et Base de données
- Uptime du serveur
- Métriques de performance (CPU, Mémoire, Disque)
- Historique des erreurs
- Auto-refresh toutes les 30 secondes

### 8. Paramètres (/super-admin/settings)
- Configuration globale de la plateforme
- Nom et branding
- Email de support
- Paramètres de langue (FR, AR, EN)
- Mode maintenance
- Templates de notifications

## 🏗️ Architecture Technique

### Backend (NestJS)

**Module:** `src/modules/super-admin/`
- `super-admin.controller.ts` - Endpoints API
- `super-admin.service.ts` - Logique métier
- `super-admin.module.ts` - Configuration module
- `dto/` - Data Transfer Objects

**Endpoints Principaux:**
```
GET    /super-admin/dashboard          # Dashboard overview
GET    /super-admin/dashboard/stats    # Statistiques
GET    /super-admin/dashboard/charts   # Données graphiques

GET    /super-admin/companies          # Liste entreprises
GET    /super-admin/companies/:id      # Détails entreprise
PUT    /super-admin/companies/:id/status
PUT    /super-admin/companies/:id/plan
DELETE /super-admin/companies/:id

GET    /super-admin/plans              # Liste plans
POST   /super-admin/plans              # Créer plan
PUT    /super-admin/plans/:id          # Modifier plan
DELETE /super-admin/plans/:id          # Supprimer plan

GET    /super-admin/revenue            # Stats revenus
GET    /super-admin/revenue/by-plan    # Revenus par plan
GET    /super-admin/revenue/export     # Export données

GET    /super-admin/users              # Tous les utilisateurs
PUT    /super-admin/users/:id/block    # Bloquer utilisateur
PUT    /super-admin/users/:id/unblock  # Débloquer

GET    /super-admin/logs               # Journaux activité
POST   /super-admin/logs               # Créer log

GET    /super-admin/system/health      # Santé système
GET    /super-admin/system/errors      # Erreurs récentes

GET    /super-admin/settings           # Paramètres
PUT    /super-admin/settings           # Modifier paramètres
```

### Frontend (Next.js)

**Structure:** `frontend/app/super-admin/`
```
super-admin/
├── layout.tsx                 # Layout avec vérification role
├── page.tsx                   # Dashboard principal
├── companies/
│   └── page.tsx              # Gestion entreprises
├── plans/
│   └── page.tsx              # Gestion plans
├── revenue/
│   └── page.tsx              # Finance & revenus
├── users/
│   └── page.tsx              # Gestion utilisateurs
├── logs/
│   └── page.tsx              # Journaux activité
├── system/
│   └── page.tsx              # Santé système
└── settings/
    └── page.tsx              # Paramètres plateforme
```

### Base de Données (Prisma)

**Nouveaux Modèles:**

```prisma
enum SubscriptionStatus {
  ACTIVE
  TRIAL
  SUSPENDED
  EXPIRED
  CANCELED
}

enum PlanType {
  BASIC
  PRO
  ENTERPRISE
  CUSTOM
}

enum ActivityLogAction {
  COMPANY_CREATED
  COMPANY_SUSPENDED
  COMPANY_ACTIVATED
  COMPANY_DELETED
  PLAN_CHANGED
  USER_BLOCKED
  USER_UNBLOCKED
  PAYMENT_RECEIVED
  PAYMENT_FAILED
  SETTINGS_UPDATED
}

model Company {
  // Champs ajoutés:
  status              SubscriptionStatus
  planId              String?
  plan                SubscriptionPlan?
  trialEndsAt         DateTime?
  subscriptionEndsAt  DateTime?
  monthlyRevenue      Float
}

model SubscriptionPlan {
  id              String
  name            String
  type            PlanType
  description     String?
  maxUsers        Int
  maxVehicles     Int
  maxTrips        Int
  priceMonthly    Float
  priceYearly     Float
  features        Json?
  modulesEnabled  String[]
  isActive        Boolean
  companies       Company[]
}

model ActivityLog {
  id          String
  companyId   String?
  company     Company?
  userId      String?
  action      ActivityLogAction
  description String
  metadata    Json?
  ipAddress   String?
  userAgent   String?
  createdAt   DateTime
}

model PlatformSettings {
  id                    String
  platformName          String
  platformLogo          String?
  supportEmail          String?
  defaultLanguage       String
  enabledLanguages      String[]
  maintenanceMode       Boolean
  maintenanceMessage    String?
  notificationTemplates Json?
}

model SystemHealth {
  id              String
  apiStatus       String
  databaseStatus  String
  uptime          Float
  errorCount      Int
  lastErrorAt     DateTime?
  lastErrorMsg    String?
  cpuUsage        Float?
  memoryUsage     Float?
  diskUsage       Float?
  timestamp       DateTime
  metadata        Json?
}
```

## 🔐 Sécurité

### Authentification
- JWT avec vérification du rôle `SUPERADMIN`
- Guard NestJS: `SuperAdminGuard`
- Protection frontend: vérification localStorage

### Autorisations
- Seuls les utilisateurs avec `role === 'SUPERADMIN'` peuvent accéder
- Isolation des données tenant contournée pour le super admin
- Journalisation de toutes les actions sensibles

## 🚀 Déploiement

### 1. Migration Base de Données
```bash
npx prisma migrate dev --name add_super_admin_features
npx prisma generate
```

### 2. Seed Initial (Plans de base)
```bash
npx prisma db seed
```

### 3. Créer Super Admin
```bash
node scripts/create-superadmin-arwa.js
```

### 4. Démarrage
```bash
# Backend
npm run start:dev

# Frontend
cd frontend && npm run dev
```

## 📊 UI/UX Design

### Palette de Couleurs
- **Super Admin:** Purple gradient (sophistication)
- **Succès:** Green (revenus, actif)
- **Warning:** Orange/Yellow (attention, essai)
- **Danger:** Red (erreurs, suspensions)
- **Info:** Blue (données, stats)

### Composants Réutilisables
- `KPICard` - Cartes de métriques
- `StatusBadge` - Badges de statut colorés
- `RoleBadge` - Badges de rôles
- Charts (Recharts): LineChart, BarChart, PieChart

### Responsive Design
- Mobile-first approach
- Grilles adaptatives (grid-cols-1 md:grid-cols-2 lg:grid-cols-4)
- Tables avec scroll horizontal
- Navigation sidebar fixe

## 🎨 Style Guidelines

### Conventions de Nommage
- Pages: PascalCase (e.g., `CompaniesPage`)
- Composants: PascalCase (e.g., `KPICard`)
- Fonctions: camelCase (e.g., `formatUptime`)
- Classes CSS: kebab-case via Tailwind

### Structure des Pages
```tsx
1. Header (Gradient avec titre et description)
2. Filtres/Actions
3. Contenu principal (Tables, Cards, Charts)
4. Pagination (si applicable)
```

## 📈 Métriques Importantes

### KPIs Suivis
- **Total Companies:** Nombre total d'entreprises
- **Active Companies:** Entreprises avec abonnement actif
- **Trial Companies:** Entreprises en période d'essai
- **MRR:** Revenu mensuel récurrent
- **ARR:** Revenu annuel récurrent
- **Churn Rate:** Taux d'attrition (30 jours)
- **Platform Profit:** Marge bénéficiaire estimée

### Calculs
```typescript
// MRR
MRR = Σ(priceMonthly de tous les plans actifs)

// ARR
ARR = MRR × 12

// Churn Rate (30 jours)
ChurnRate = (Entreprises annulées / Total entreprises) × 100

// Revenu moyen par entreprise
AvgRevenue = MRR / Nombre entreprises actives
```

## 🔄 Flux de Données

### Création d'Entreprise
1. Entreprise créée → Status: `TRIAL`
2. Log créé: `COMPANY_CREATED`
3. Attribution plan (optionnel)
4. Email de bienvenue (à implémenter)

### Changement de Plan
1. Super admin assigne nouveau plan
2. Mise à jour `planId` dans Company
3. Log créé: `PLAN_CHANGED`
4. Recalcul MRR automatique

### Suspension d'Entreprise
1. Status → `SUSPENDED`
2. Log créé: `COMPANY_SUSPENDED`
3. Accès bloqué pour les utilisateurs
4. Exclusion du calcul MRR

## 🛠️ Maintenance

### Tâches Régulières
- Vérifier santé système quotidiennement
- Analyser logs d'erreurs hebdomadairement
- Exporter rapports financiers mensuellement
- Backup base de données (automatisé)

### Monitoring
- Uptime: 99.9% objectif
- Response time API: < 500ms
- Erreurs système: tracking automatique
- Usage ressources: alertes si > 80%

## 📱 Responsive Breakpoints

```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablets */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
```

## 🌐 Internationalisation (Future)

### Langues Prévues
- FR: Français (défaut)
- AR: Arabe
- EN: English

### Fichiers i18n
```
locales/
├── fr.json
├── ar.json
└── en.json
```

## 📝 Notes Importantes

1. **Isolation Tenant:** Le super admin contourne l'isolation normale des données
2. **Performance:** Queries optimisées avec include/select Prisma
3. **Cache:** Utiliser React Query pour cache automatique
4. **Real-time:** WebSockets pour notifications futures
5. **Audit:** Tous les changements sensibles sont loggés

## 🎓 Formation Super Admin

### Accès Initial
1. Créer compte super admin via script
2. Se connecter avec email/password
3. Accès automatique au dashboard super admin

### Fonctionnalités Clés
1. **Dashboard:** Vue d'ensemble quotidienne
2. **Companies:** Gestion opérationnelle
3. **Plans:** Configuration business model
4. **Revenue:** Suivi financier
5. **System:** Monitoring technique

## 🚨 Troubleshooting

### Problème: Dashboard vide
- Vérifier rôle utilisateur = `SUPERADMIN`
- Vérifier connexion base de données
- Vérifier logs backend

### Problème: Erreurs API
- Vérifier token JWT valide
- Vérifier SuperAdminGuard activé
- Vérifier endpoints dans logs

### Problème: Données incorrectes
- Vérifier calculs MRR/ARR
- Vérifier associations Plan-Company
- Recalculer via migration si nécessaire

## 📞 Support

Pour toute question technique, contacter l'équipe de développement.

---

**Version:** 1.0.0  
**Dernière mise à jour:** January 4, 2026  
**Développé pour:** ArwaPark SaaS Platform
