# SmartFollow CRM - Paketisüsteem (Plans System)

**Kuupäev:** 8. november 2025  
**Versioon:** v1.5.0 (Session #6)  
**Staatus:** ✅ Implementeeritud

---

## 📋 Ülevaade

SmartFollow CRM paketisüsteem võimaldab piirata funktsionaalsust ja limiite vastavalt kasutaja plaanile:
- **FREE** - tasuta algtase
- **STARTER** - algajatele ja väikefirmadele
- **PRO** - professionaalidele
- **ENTERPRISE** - suurettevõtetele

---

## 🏗️ Arhitektuur

### 1. Database

**Migration:** `apps/server/src/migrations/20251108-add-plan-to-users.ts`

```sql
ALTER TABLE users ADD COLUMN plan VARCHAR(20) NOT NULL DEFAULT 'FREE';
```

**User Model:** `apps/server/src/models/userModel.ts`

```typescript
export type UserPlan = 'FREE' | 'STARTER' | 'PRO' | 'ENTERPRISE';

export class User extends Model {
  public plan!: UserPlan;
  // ...
}
```

### 2. Plans Configuration

**Fail:** `apps/server/src/config/plans.ts`

```typescript
export const PLANS: Record<PlanId, PlanConfig> = {
  FREE: {
    maxUsers: 1,
    maxCompanies: 50,
    maxDeals: 50,
    features: {
      dashboardAnalytics: false,
      dealsPipeline: false,
      tasksModule: true,
      adminUsersModule: false,
      globalSearch: false
    }
  },
  STARTER: {
    maxUsers: 3,
    maxCompanies: 500,
    maxDeals: 1000,
    features: {
      dashboardAnalytics: true,
      dealsPipeline: true,
      tasksModule: true,
      adminUsersModule: false,
      globalSearch: true
    }
  },
  // ...
};
```

---

## 🔧 Backend Kasutamine

### Feature Guard (Middleware)

**Fail:** `apps/server/src/middleware/requireFeature.ts`

```typescript
import { requireFeature } from '../middleware/requireFeature';

router.get(
  '/pipeline',
  requireAuth,
  requireFeature('dealsPipeline'), // ✅ Check feature access
  controller.getPipeline
);
```

**Response kui ei ole ligipääsu:**

```json
{
  "message": "Your current plan does not include this feature.",
  "feature": "dealsPipeline",
  "plan": "FREE"
}
```

### Plan Limits (Utility)

**Fail:** `apps/server/src/utils/planLimits.ts`

```typescript
import { checkPlanLimit } from '../utils/planLimits';

export async function createCompany(req: Request, res: Response) {
  const user = req.user;
  const planId = user.plan || 'FREE';

  // Check current count
  const currentCount = await Company.count({
    where: { owner_id: user.id }
  });

  // Check limit
  const limit = checkPlanLimit(planId, 'companies', currentCount);

  if (!limit.ok) {
    return res.status(403).json({
      message: 'Company limit reached for your plan.',
      plan: planId,
      maxCompanies: limit.max,
      currentCompanies: limit.current
    });
  }

  // Create company...
}
```

---

## 🎨 Frontend Kasutamine

### 1. useCurrentPlan Hook

**Fail:** `apps/desktop/src/renderer/hooks/useCurrentPlan.ts`

```typescript
import { useCurrentPlan } from '../hooks/useCurrentPlan';

function MyComponent() {
  const { id, label, badgeColor } = useCurrentPlan();

  return (
    <div>
      <p>Praegune plaan: {label}</p>
      <span className={`badge-${badgeColor}`}>{id}</span>
    </div>
  );
}
```

### 2. PlanGuard Component

**Fail:** `apps/desktop/src/renderer/components/PlanGuard.tsx`

```typescript
import { PlanGuard } from '../components/PlanGuard';

function ContactsView() {
  return (
    <div>
      <h1>Contacts</h1>

      {/* Kõik kasutajad näevad seda */}
      <ContactsTable />

      {/* Ainult STARTER+ näevad */}
      <PlanGuard minPlan="STARTER">
        <AdvancedFilters />
      </PlanGuard>

      {/* Ainult PRO+ näevad */}
      <PlanGuard minPlan="PRO">
        <ContactsStatistics />
      </PlanGuard>
    </div>
  );
}
```

**Custom Fallback:**

```typescript
<PlanGuard
  minPlan="STARTER"
  fallback={
    <div className="locked-feature">
      <p>See funktsioon on saadaval Starter paketis.</p>
    </div>
  }
>
  <AdvancedFeature />
</PlanGuard>
```

### 3. Conditional Rendering

```typescript
import { useCurrentPlan } from '../hooks/useCurrentPlan';

function DashboardView() {
  const { id: planId } = useCurrentPlan();

  return (
    <div>
      {/* FREE users see upgrade banner */}
      {planId === 'FREE' && (
        <div className="upgrade-banner">
          <p>Upgrade to unlock more features!</p>
          <button className="btn-upgrade">Vaata pakette</button>
        </div>
      )}

      {/* ENTERPRISE users see special features */}
      {planId === 'ENTERPRISE' && (
        <EnterpriseOnlyFeatures />
      )}
    </div>
  );
}
```

---

## 📊 Paketide Tabel

| Feature | FREE | STARTER | PRO | ENTERPRISE |
|---------|------|---------|-----|------------|
| **Max Users** | 1 | 3 | 10 | 9999 |
| **Max Companies** | 50 | 500 | 5000 | 999999 |
| **Max Deals** | 50 | 1000 | 10000 | 999999 |
| **Dashboard Analytics** | ❌ | ✅ | ✅ | ✅ |
| **Deals Pipeline** | ❌ | ✅ | ✅ | ✅ |
| **Tasks Module** | ✅ | ✅ | ✅ | ✅ |
| **Admin Users** | ❌ | ❌ | ✅ | ✅ |
| **Global Search** | ❌ | ✅ | ✅ | ✅ |

---

## 🚀 Järgmised Sammud

### 1. Käivita Migration

```bash
cd apps/server
npm run migrate
```

### 2. Uuenda Login API

Veendu, et login endpoint tagastab `plan` välja:

```typescript
// apps/server/src/controllers/authController.ts
const response = {
  token: jwt.sign({ userId: user.id }, JWT_SECRET),
  user: {
    id: user.id,
    email: user.email,
    role: user.role,
    plan: user.plan // ✅ Lisa see
  }
};
```

### 3. Test Backend Middleware

```bash
# Test feature check
curl -X GET http://localhost:3001/api/pipeline \
  -H "Authorization: Bearer <token>"

# Expected for FREE user:
# 403 {"message": "Your current plan does not include this feature."}
```

### 4. Test Frontend PlanGuard

```typescript
// Test component
<PlanGuard minPlan="STARTER">
  <p>Seda näevad ainult STARTER+ kasutajad!</p>
</PlanGuard>
```

### 5. Lisa Route Guards

Uuenda olemasolevaid route'e:

```typescript
// Deals Pipeline - STARTER+
router.get('/pipeline', requireAuth, requireFeature('dealsPipeline'), ...);

// Dashboard Analytics - STARTER+
router.get('/reports/summary', requireAuth, requireFeature('dashboardAnalytics'), ...);

// Admin Users - PRO+
router.get('/admin/users', requireAuth, requireFeature('adminUsersModule'), ...);

// Global Search - STARTER+
router.get('/search', requireAuth, requireFeature('globalSearch'), ...);
```

---

## 🎨 CSS Klassid

```css
/* PlanGuard locked state */
.plan-guard-locked { }
.plan-guard-message { }
.plan-guard-icon { }
.plan-guard-title { }
.plan-guard-subtitle { }
.plan-guard-upgrade-btn { }

/* Upgrade banner */
.upgrade-banner { }
.btn-upgrade { }
```

---

## 📝 Näited

### Täielik Contacts View Näide

**Fail:** `apps/desktop/src/renderer/components/ContactsWithPlans.tsx`

```typescript
import { useCurrentPlan } from '../hooks/useCurrentPlan';
import { PlanGuard } from '../components/PlanGuard';

const ContactsView = () => {
  const { id: planId, label } = useCurrentPlan();

  return (
    <div>
      <header>
        <h1>Contacts</h1>
        <p>Plan: {label}</p>

        {/* STARTER+ feature */}
        <PlanGuard minPlan="STARTER">
          <AdvancedFilters />
        </PlanGuard>
      </header>

      {/* All plans */}
      <ContactsTable />

      {/* PRO+ feature */}
      <PlanGuard minPlan="PRO">
        <ContactsStatistics />
      </PlanGuard>

      {/* FREE upgrade banner */}
      {planId === 'FREE' && <UpgradeBanner />}
    </div>
  );
};
```

### Backend Controller Näide

**Fail:** `apps/server/src/controllers/companyController.example.ts`

Vt täielikku näidet failis.

---

## ✅ Lõplik Checklist

Backend:
- [x] Migration (`plan` column)
- [x] User model updated
- [x] Plans config created
- [x] `requireFeature` middleware
- [x] `planLimits` utility
- [x] Controller examples
- [ ] Login API updated (tagastab `plan`)
- [ ] Route guards added

Frontend:
- [x] `useCurrentPlan` hook
- [x] `PlanGuard` component
- [x] CSS styles
- [x] Example component
- [ ] Update existing views (Contacts, Deals, Admin)
- [ ] Test components

Testing:
- [ ] Test migration
- [ ] Test feature middleware
- [ ] Test plan limits
- [ ] Test PlanGuard UI
- [ ] Test upgrade banners

---

## 🤝 Support

Küsimused? Vaata:
- `apps/server/src/config/plans.ts` - Paketite konfiguratsioon
- `apps/desktop/src/renderer/components/ContactsWithPlans.tsx` - Täielik näide
- `apps/server/src/controllers/companyController.example.ts` - Backend näide

---

**Session #6 - Paketisüsteem implementeeritud!** 🎉

