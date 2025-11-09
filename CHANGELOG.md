# Changelog

All notable changes to SmartFollow CRM will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.7.0] - 2025-11-09

### 🎉 Major Features

#### Multi-Tenant System
- **Account-based data isolation** - Each account (company/organization) has completely isolated data
- **System admin role** - Admins can view and manage multiple accounts
- **Account context switching** - System admins can use `x-account-id` header to access specific accounts
- **Complete data filtering** - All queries filtered by `account_id` (Companies, Contacts, Deals, Tasks, Reports, Search)

#### Trial & Billing System
- **14-day free trial** - Full ENTERPRISE-level access for 14 days
- **7-day grace period** - After trial ends, 7 days to choose a plan
- **Four plan tiers**: TRIAL, STARTER (9€), PRO (29€), ENTERPRISE (79€)
- **Plan-based limits** - maxUsers, maxCompanies, maxDeals per plan
- **Feature flags** - Different features available per plan (adminUsers, reports, apiAccess, etc.)
- **Settings → Billing UI** - Visual plan selection and status display
- **Trial countdown** - Shows days remaining in trial/grace period
- **Auto-lock mechanism** - Accounts lock automatically after grace period expires

### Added

#### Backend
- `Account` model with trial fields (`plan_locked`, `trial_ends_at`, `grace_ends_at`)
- `billing_plan` field: `TRIAL | STARTER | PRO | ENTERPRISE`
- `/api/billing/current` - Get current plan and subscription status
- `/api/billing/plans` - List all available plans
- `/api/billing/upgrade` - Upgrade/change plan
- `/api/billing/status` - Detailed account status with days remaining
- `attachAccount` middleware - Loads account context into `req.account`
- `requireMinPlan('PRO')` middleware - Require minimum plan level
- `requireFeature('adminUsers')` middleware - Require specific feature
- `checkLimit('companies')` middleware - Enforce entity limits
- `requireActiveAccount()` middleware - Block GRACE/LOCKED accounts
- Plan configuration system (`src/config/plans.ts`)
- Multi-tenant setup script (`npm run setup:multi-tenant`)
- Trial system migration script (`npm run migrate:trial-system`)
- Billing maintenance cron job (`npm run billing:maintenance`)

#### Frontend (Desktop)
- **Settings view** - New settings menu with ⚙️ icon
- **BillingPage component** - Plan selection UI with visual cards
- Trial status display (days remaining, grace warnings)
- Plan badges (TRIAL/STARTER/PRO/ENTERPRISE) with color coding
- Upgrade UI with plan comparison
- Real-time plan status from backend API

#### Scripts
- `npm run setup:multi-tenant` - Initialize multi-tenant database
- `npm run migrate:trial-system` - Add trial system fields to accounts
- `npm run billing:maintenance` - Auto-lock expired trials (cron-ready)

### Changed

#### Backend
- **BREAKING**: All services now filter by `account_id`
  - `CompanyService.getAllCompanies(accountId?)`
  - `ContactService.getAllContacts(accountId?)`
  - `DealService.getAllDeals(accountId?)`
  - `TaskService.getAllTasks(accountId?)`
- **BREAKING**: All controllers now use `AuthRequest` (includes `req.accountId`)
- **BREAKING**: Login response now includes `user.plan` and `user.account_id`
- User model: `plan` field changed from `'FREE'` to `'TRIAL'` as default
- Search controller: Filters results by account_id
- Reports controller: Statistics filtered by account_id

#### Frontend
- Plan type updated: `'FREE'` → `'TRIAL'` across all components
- `useCurrentPlan` hook: Reads plan from localStorage
- `PlanGuard` component: Updated plan hierarchy (TRIAL < STARTER < PRO < ENTERPRISE)
- Admin plan dropdown: Now includes TRIAL option
- Plan badge colors updated for TRIAL

### Fixed
- Sequelize TypeScript compatibility in setup scripts (`@ts-nocheck` for admin scripts)
- NULL checks in WHERE clauses (using `sequelize.literal`)
- Deal routes authentication middleware ordering
- Import statements for Account model

### Migration Guide

#### For Existing Installations:

```bash
# 1. Backup database
sudo -u postgres pg_dump smartfollow_db > backup_$(date +%F).sql

# 2. Pull latest code
cd ~/smartfollow
git fetch origin
git checkout feat/multi-tenant-system
git pull origin feat/multi-tenant-system

# 3. Install dependencies
cd apps/server
npm ci

# 4. Run migrations (IMPORTANT: in this order!)
npm run migrate:trial-system    # Adds trial fields
npm run setup:multi-tenant      # Creates default account, assigns data

# 5. Build and restart
npm run build
pm2 restart smartfollow-server

# 6. Verify
curl http://localhost:3000/health
curl http://localhost:3000/api/billing/plans
```

#### Database Changes:
- New table: `accounts` (if not exists)
- New columns on `users`: `account_id`
- New columns on `companies`, `contacts`, `deals`, `tasks`: `account_id`
- New columns on `accounts`: `plan_locked`, `trial_ends_at`, `grace_ends_at`
- Updated `users.plan` default: `'FREE'` → `'TRIAL'`
- Updated `accounts.billing_plan` default: `'FREE'` → `'TRIAL'`

### Security

- **Data isolation**: Users can only see data from their own account
- **Plan enforcement**: API endpoints check plan permissions before allowing access
- **Trial expiration**: Automatic account locking after grace period

### Performance

- Indexed `account_id` foreign keys for faster multi-tenant queries
- Efficient plan checks using in-memory configuration

### Known Limitations

- API access is feature-flagged but external API token system not yet implemented
- Advanced integrations (Google Calendar, Zapier, etc.) are planned for v1.8.0
- White-label customization planned for future releases
- Workflow automation and webhooks planned for v1.8.0+

---

## [1.6.5] - 2025-11-08

### Added
- Admin user management: delete users, reset passwords
- Password change functionality for regular users
- Custom SmartFollow application icon
- Plan system foundation (FREE/STARTER/PRO/ENTERPRISE badges)
- Clickable table rows in Companies, Contacts, Deals views
- Search result navigation

### Changed
- Widened main content area (1440px → 1700px)
- Improved password change button styling
- Updated rate limiter settings for production use

### Fixed
- Search functionality (database column names)
- Rate limiting issues (429 errors, trust proxy warnings)
- Desktop application version display

---

## [1.6.0] - 2025-11-07

### Added
- Initial functional CRUD views (Companies, Contacts, Deals, AdminUsers)
- Basic plan system (user-level plans)

### Fixed
- Restored functional components from Git history
- TypeScript compilation errors

---

## Earlier Versions

See git history for changes prior to v1.6.0.

