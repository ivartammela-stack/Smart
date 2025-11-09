# Migration Guide: v1.6.x → v1.7.0

**⚠️ CRITICAL: This is a MAJOR upgrade with database schema changes!**

---

## 🎯 Overview

Version 1.7.0 introduces:
- Multi-tenant architecture (account-based data isolation)
- Trial & billing system (TRIAL/STARTER/PRO/ENTERPRISE)
- Breaking API changes

**Estimated Migration Time:** 10-15 minutes  
**Downtime Required:** 2-3 minutes

---

## ⚠️ Pre-Migration Checklist

### 1. **BACKUP YOUR DATABASE** (MANDATORY!)

```bash
# PostgreSQL backup
sudo -u postgres pg_dump smartfollow_db > ~/smartfollow_backup_$(date +%F_%H%M).sql

# Verify backup
ls -lh ~/smartfollow_backup_*.sql
```

### 2. **Check Current State**

```bash
# Check server status
pm2 status

# Check database connection
psql -U smartfollow -d smartfollow_db -c "SELECT COUNT(*) FROM users;"

# Note current data counts
psql -U smartfollow -d smartfollow_db -c "
  SELECT 
    (SELECT COUNT(*) FROM users) as users,
    (SELECT COUNT(*) FROM companies) as companies,
    (SELECT COUNT(*) FROM contacts) as contacts,
    (SELECT COUNT(*) FROM deals) as deals,
    (SELECT COUNT(*) FROM tasks) as tasks;
"
```

---

## 🔧 Migration Steps

### Step 1: Pull Latest Code

```bash
cd ~/smartfollow
git fetch origin
git checkout main
git pull origin main
```

### Step 2: Install Dependencies

```bash
cd apps/server
npm ci
```

### Step 3: Run Migrations **(CRITICAL ORDER!)**

```bash
# Migration 1: Add trial system fields
npm run migrate:trial-system
```

**What this does:**
- Syncs database schema with Sequelize models
- Adds `plan_locked`, `trial_ends_at`, `grace_ends_at` columns to `accounts` table
- Sets trial dates for existing TRIAL accounts (14 days from now)

**Expected output:**
```
✅ Schema synced (plan_locked, trial_ends_at, grace_ends_at added)
✅ Updated 0 TRIAL accounts with trial dates
```

```bash
# Migration 2: Setup multi-tenant structure
npm run setup:multi-tenant
```

**What this does:**
- Creates `accounts` table (if not exists)
- Creates default account (ID: 1, plan: TRIAL)
- Assigns ALL existing data to default account (`account_id = 1`)
- Upgrades admin user to `system_admin` role

**Expected output:**
```
✅ Default account created (ID: 1)
   Trial ends: 2025-11-23
   Grace ends: 2025-11-30
✅ Updated X users
✅ Updated X companies
✅ Updated X contacts
✅ Updated X deals
✅ Updated X tasks
✅ Admin user role updated to system_admin
```

### Step 4: Build Server

```bash
npm run build
```

**Expected output:**
```
No TypeScript errors
dist/ folder populated
```

### Step 5: Restart Server

```bash
pm2 restart smartfollow-server
sleep 3
pm2 logs smartfollow-server --lines 20
```

**Expected in logs:**
```
✅ Database connection established successfully
✅ Server is running on http://localhost:3000
```

---

## ✅ Post-Migration Verification

### 1. Check Server Health

```bash
curl http://localhost:3000/health
```

**Expected:** `{"status":"ok","message":"SmartFollow server is running 🚀"}`

### 2. Test Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@smartfollow.ee","password":"Passw0rd"}'
```

**Expected response includes:**
```json
{
  "success": true,
  "user": {
    "plan": "TRIAL",
    "account_id": 1
  }
}
```

### 3. Test Billing API

```bash
# Get token from login above, then:
TOKEN="your_token_here"

curl http://localhost:3000/api/billing/current \
  -H "Authorization: Bearer $TOKEN"
```

**Expected:**
```json
{
  "success": true,
  "data": {
    "plan": "TRIAL",
    "status": "TRIAL",
    "trialEndsAt": "2025-11-23...",
    "trialDaysLeft": 14
  }
}
```

### 4. Verify Multi-Tenant Filtering

```bash
curl http://localhost:3000/api/companies \
  -H "Authorization: Bearer $TOKEN"
```

**Expected:**
- Only companies with `account_id = 1` returned
- `count` matches your expected number

### 5. Check Database State

```bash
sudo -u postgres psql -d smartfollow_db

-- Check accounts
SELECT id, name, billing_plan, plan_locked, trial_ends_at, grace_ends_at 
FROM accounts;

-- Check data assignment
SELECT 
  (SELECT COUNT(*) FROM users WHERE account_id = 1) as users_in_account_1,
  (SELECT COUNT(*) FROM companies WHERE account_id = 1) as companies_in_account_1,
  (SELECT COUNT(*) FROM users WHERE account_id IS NULL) as orphan_users,
  (SELECT COUNT(*) FROM companies WHERE account_id IS NULL) as orphan_companies;
```

**Expected:**
- Account 1 exists with TRIAL plan
- All users/companies assigned to account 1
- No orphan records (account_id IS NULL should be 0)

---

## 🔄 Rollback Procedure

**If something goes wrong:**

```bash
# 1. Stop server
pm2 stop smartfollow-server

# 2. Restore database
sudo -u postgres psql -d smartfollow_db < ~/smartfollow_backup_YYYY-MM-DD_HHMM.sql

# 3. Checkout previous version
cd ~/smartfollow
git checkout v1.6.5  # or previous tag

# 4. Rebuild and restart
cd apps/server
npm ci
npm run build
pm2 restart smartfollow-server
```

---

## 🐛 Common Issues

### Issue 1: "Account not found" error

**Symptom:** Users can't see any data after migration

**Solution:**
```bash
# Check if data was assigned
psql -U smartfollow -d smartfollow_db -c \
  "SELECT account_id, COUNT(*) FROM companies GROUP BY account_id;"

# If account_id is NULL, re-run setup
cd ~/smartfollow/apps/server
npm run setup:multi-tenant
```

### Issue 2: TypeScript errors in setup script

**Symptom:** `setup:multi-tenant` fails with TS errors

**Solution:** File should have `// @ts-nocheck` at top. Verify:
```bash
head -1 apps/server/scripts/setup-multi-tenant.ts
```

### Issue 3: Login doesn't return `plan` field

**Symptom:** Desktop app doesn't show trial badge

**Solution:** Check authController loads Account:
```bash
# Should have this in authController.ts:
grep "Account.findByPk" apps/server/src/controllers/authController.ts
```

### Issue 4: Billing routes return 404

**Symptom:** `/api/billing/plans` returns 404

**Solution:** Verify routes are registered:
```bash
grep "billingRoutes" apps/server/src/routes/index.ts
```

---

## 📊 Data Impact

**After migration, your data will be:**

| Table | Change | Impact |
|-------|--------|--------|
| `accounts` | **Created** | 1 default account added |
| `users` | `account_id` added | All assigned to account 1 |
| `companies` | `account_id` added | All assigned to account 1 |
| `contacts` | `account_id` added | All assigned to account 1 |
| `deals` | `account_id` added | All assigned to account 1 |
| `tasks` | `account_id` added | All assigned to account 1 |

**No data is deleted or modified** - only new columns added and relationships established.

---

## 🎓 Testing the Migration

### Test Checklist

- [ ] Server starts without errors
- [ ] Login works and returns `user.plan` and `user.account_id`
- [ ] `/api/billing/current` returns trial info
- [ ] `/api/billing/plans` returns 3 plans (STARTER, PRO, ENTERPRISE)
- [ ] Companies view shows correct data (filtered by account)
- [ ] Desktop app shows Settings menu
- [ ] Settings → Billing page displays correctly
- [ ] Trial countdown shows "14 days remaining"

---

## 🔐 Security Notes

- ✅ All data now filtered by `account_id` - complete isolation
- ✅ Plan-based access control enforced at middleware level
- ✅ Trial expiration handled automatically
- ✅ No SQL injection risk (parameterized queries)

---

## 📞 Support

If you encounter issues during migration:

1. **Check logs:** `pm2 logs smartfollow-server`
2. **Verify database:** Run verification queries above
3. **Rollback if needed:** Use backup restore procedure
4. **Contact support:** Open GitHub issue with error logs

---

## 🎊 Post-Migration

**Your SmartFollow instance is now:**
- ✅ Multi-tenant ready
- ✅ Trial system active (14 days)
- ✅ Account-isolated
- ✅ Plan-enforced

**Next steps:**
1. Test desktop app (login, view data, check Settings)
2. Configure cron job for trial maintenance (optional)
3. Customize plan prices/limits in `src/config/plans.ts` (optional)

---

**Migration complete! Welcome to SmartFollow v1.7.0!** 🎉

