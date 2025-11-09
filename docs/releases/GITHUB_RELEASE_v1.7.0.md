# 🎉 SmartFollow CRM v1.7.0 - Multi-Tenant & Trial System

## 🌟 Major Release - Enterprise SaaS Capabilities

This release transforms SmartFollow into a true **multi-tenant SaaS platform** with complete account isolation and a sophisticated trial & billing system.

---

## 🚀 What's New

### 🏢 Multi-Tenant Architecture
- **Account-based data isolation** - Each organization has completely separate data
- **System admin role** - Manage multiple client accounts from one interface
- **Secure filtering** - All queries automatically filtered by account_id
- **Zero data leakage** - Tested and verified complete isolation

### 📊 Trial & Billing System
- **14-day free trial** with full ENTERPRISE features
- **7-day grace period** after trial ends
- **Four plan tiers**: TRIAL → STARTER (€9) → PRO (€29) → ENTERPRISE (€79)
- **Smart limits**: Users, companies, and deals per plan
- **Feature flags**: Different capabilities per plan level
- **Beautiful billing UI** in Settings → Billing

### ⚙️ New Settings View
- New Settings menu (⚙️ icon)
- Billing page with plan comparison
- Trial countdown timer
- Visual upgrade interface
- Plan status and days remaining

---

## ✨ Key Features

✅ **Multi-tenant filtering** - Companies, Contacts, Deals, Tasks, Reports, Search  
✅ **Trial system** - 14 days full access + 7 days grace  
✅ **Auto-lock** - Expired trials automatically locked  
✅ **Plan enforcement** - Middleware checks for features and limits  
✅ **Billing API** - `/api/billing/current`, `/plans`, `/upgrade`  
✅ **Settings UI** - Professional plan selection interface  
✅ **Cron automation** - `billing:maintenance` for trial expiration

---

## 📦 Installation

### New Installations

```bash
git clone https://github.com/ivartammela-stack/Smart.git
cd Smart/apps/server
npm ci
npm run migrate:trial-system
npm run setup:multi-tenant
npm run build
npm start
```

### Upgrading from v1.6.x

**⚠️ BACKUP YOUR DATABASE FIRST!**

```bash
# Backup
sudo -u postgres pg_dump smartfollow_db > backup.sql

# Update
cd ~/smartfollow
git pull origin main
cd apps/server
npm ci
npm run migrate:trial-system
npm run setup:multi-tenant
npm run build
pm2 restart smartfollow-server
```

---

## 🎯 Plan Comparison

| Feature | TRIAL | STARTER | PRO | ENTERPRISE |
|---------|-------|---------|-----|------------|
| **Duration** | 14 days | ∞ | ∞ | ∞ |
| **Users** | ∞ | 3 | 10 | ∞ |
| **Companies** | ∞ | 100 | 1,000 | ∞ |
| **Deals** | ∞ | 500 | 5,000 | ∞ |
| **Dashboard** | ✅ | ✅ | ✅ | ✅ |
| **Admin Users** | ✅ | ❌ | ✅ | ✅ |
| **Reports** | ✅ | ❌ | ✅ | ✅ |
| **API Access** | ✅ | ❌ | Basic | Full |
| **Price** | Free | €9/user | €29/user | €79/user |

---

## 🔧 Technical Changes

### Backend
- ✅ Account model with trial fields
- ✅ Multi-tenant filtering middleware
- ✅ Plan guards (`requireMinPlan`, `requireFeature`, `checkLimit`)
- ✅ Billing routes and controllers
- ✅ Migration scripts

### Frontend
- ✅ Settings view with Billing page
- ✅ Plan badges and status display
- ✅ Trial countdown UI
- ✅ Upgrade interface

### Database
- New `accounts` table
- `account_id` foreign keys on all entities
- Trial system fields: `plan_locked`, `trial_ends_at`, `grace_ends_at`
- Plan type: `'TRIAL' | 'STARTER' | 'PRO' | 'ENTERPRISE'`

---

## ⚠️ Breaking Changes

1. **Login response structure changed** - Now includes `user.plan` and `user.account_id`
2. **All API endpoints now filter by account** - Multi-tenant isolation enforced
3. **FREE plan removed** - Replaced with TRIAL (14 days)

---

## 🐛 Bug Fixes

- Fixed Sequelize TypeScript compatibility in migration scripts
- Fixed NULL checks in WHERE clauses
- Fixed Deal routes authentication ordering
- Removed deprecated plan utility files

---

## 📋 Full Changelog

See [CHANGELOG.md](../../CHANGELOG.md) for complete details.

---

## 🔮 Coming in v1.8.0

- 📧 Email notifications (trial expiration reminders)
- 🔌 Integrations (Google Calendar, Outlook, Zapier)
- 📊 Advanced analytics & forecasting
- 🎨 White-label customization
- 🔑 API token management
- 🤖 Workflow automation

---

## 📸 Screenshots

*(Add screenshots of Billing page, Trial countdown, Plan badges)*

---

## 🙏 Thank You

Thank you to all testers and early adopters! Your feedback makes SmartFollow better.

**Start your 14-day free trial today!** 🎊

---

**Download:** [SmartFollow-Setup-1.7.0.exe](https://github.com/ivartammela-stack/Smart/releases/download/v1.7.0/SmartFollow-Setup-1.7.0.exe)

**Full Release Notes:** [v1.7.0-release-notes.md](./v1.7.0-release-notes.md)

