# SmartFollow CRM - Arendustegevuste Plaan (Roadmap)

> **Viimati uuendatud:** 10.11.2025  
> **Projekt:** SmartFollow CRM Desktop (Multi-tenant SaaS)  
> **Konkurent:** CSC.ee CRM

---

## 🎯 **VISIO

ON**

SmartFollow CRM on **lihtsam, kiirem ja kaasaegsem** alternatiiv rasketele enterprise CRM süsteemidele.

**Eristume:**
- 🚀 Kiire ja intuitiivne UI (vs CSC raskepärane interface)
- 🤖 AI-assistent müügitöö automatiseerimiseks
- 💰 Taskukohane pricing väikestele ja keskmise suurusega ettevõtetele
- 🔌 Lihtne integreerimine kolmandate osapooltega

---

## 📊 **PROJEKT STATUS (10.11.2025)**

**Versioon:** v1.6.5  
**Kokku töötunde:** ~102h  
**MVP staatus:** ✅ 85% valmis

### ✅ **VALMIS:**
- Multi-tenant account süsteem
- Plan management (TRIAL, STARTER, PRO, ENTERPRISE)
- Role-based access (SUPER_ADMIN, COMPANY_ADMIN, USER)
- Companies, Contacts, Deals, Tasks CRUD
- Super Admin dashboard
- Settings → Plaan & Kasutajad
- Create new company (SUPER_ADMIN)

### 🚧 **POOLELI:**
- Plan limits enforcement
- Trial expiry automation
- Company admin kasutajate haldus

---

## 🗓️ **FAAS 1: KOHE (See nädal) - MVP Finaliseerimine**

### 🎯 **Eesmärk:** SmartFollow on täielikult kasutatav multi-tenant CRM

| Prioriteet | Ülesanne | Kirjeldus | Aeg | Status |
|------------|----------|-----------|-----|--------|
| **P0** | Company Admin kasutajate haldus | POST /api/admin/users + frontend UI | 2h | 🚧 POOLELI |
| **P0** | Plan limits enforcement | Middleware checkLimit() users/companies/deals | 3h | ⏳ TODO |
| **P0** | Trial expiry cron job | Auto-lock accountid pärast grace perioodi | 2h | ⏳ TODO |
| **P1** | UI/UX cleanup | Rollikohased menüüd, selged pealkirjad | 2h | ⏳ TODO |
| **P1** | Backend API õiguste audit | Kontrolli kõik endpoint'id auth/role kaitsega | 2h | ⏳ TODO |
| **P1** | Production deployment | Deploy serverisse, testi live | 1h | ⏳ TODO |

**Kokku aega:** ~12h  
**Tähtaeg:** 15.11.2025

---

## 🚀 **FAAS 2: JÄRGMINE ETAPP (1-2 nädalat) - Integratsioonid**

### 🎯 **Eesmärk:** Lisa väärtuspakkumine - automatiseerimine ja mitmekanalilisus

| Prioriteet | Valdkond | Ülesanded | Aeg |
|------------|----------|-----------|-----|
| **P0** | 📧 E-posti integratsioon | - SMTP config<br>- Send email API<br>- Email templates<br>- Email log | 8h |
| **P0** | 📱 SMS integratsioon | - Twilio/SMSAPI setup<br>- Send SMS API<br>- SMS log | 6h |
| **P1** | 🎯 Turunduse automatiseerimine | - Campaigns moodul<br>- Bulk email/SMS<br>- Campaign statistics | 10h |
| **P1** | 🔌 Public API (v1) | - REST API dokumentatsioon<br>- Swagger UI<br>- API keys management | 8h |
| **P2** | 🔍 Täiustatud otsing | - Full-text search<br>- Advanced filters<br>- Saved searches | 6h |
| **P2** | 📊 Reports v2 | - Custom report builder<br>- Export to Excel/PDF<br>- Scheduled reports | 8h |

**Kokku aega:** ~46h (6 tööpäeva)  
**Tähtaeg:** 25.11.2025

---

## 🌍 **FAAS 3: STRATEEGILINE (1-3 kuud) - Enterprise Features**

### 🎯 **Eesmärk:** Konkureerida CSC.ee-ga full-feature tasandil

| Valdkond | Ülesanded | Põhjendus | Aeg |
|----------|-----------|-----------|-----|
| **🎧 VoIP integratsioon** | - Twilio Voice API<br>- Call logging<br>- Click-to-call<br>- Call recordings | CSC tugevus - kõnede logi CRM-is | 20h |
| **📈 Advanced Analytics** | - Sales funnel analysis<br>- Conversion tracking<br>- Revenue forecasting<br>- Custom dashboards | Business intelligence - CSC konkurents | 15h |
| **💬 Internal Chat** | - Team messaging<br>- Deal-based threads<br>- File sharing | Tiimitöö platvorm CRM sees | 12h |
| **🌐 Marketing Website** | - smartfollow.ee landing page<br>- Pricing page<br>- Sign-up flow<br>- Demo video | Turundus ja müük | 20h |
| **🎓 Help Center** | - help.smartfollow.ee<br>- User guides<br>- Video tutorials<br>- FAQ | Klienditugi ja onboarding | 10h |
| **🤖 AI Assistant (v1)** | - Smart lead scoring<br>- Auto follow-up suggestions<br>- Email drafting helper | **UNIQUE FEATURE** - CSC ei paku! | 30h |

**Kokku aega:** ~107h (13 tööpäeva)  
**Tähtaeg:** Q1 2026

---

## 💡 **UNIKAALNE ERISTUS CSC.ee-st**

### **SmartFollow TRUMP CARDS:**

| Feature | SmartFollow | CSC.ee | Eelis |
|---------|-------------|--------|-------|
| **UI/UX** | Modern, intuitiivne, kiire | Vananenud, aeglane | ⭐⭐⭐⭐⭐ |
| **Hind** | 9-79€/kasutaja/kuu | 100€+ setup + 50€+/kuu | ⭐⭐⭐⭐⭐ |
| **Setup aeg** | 5 minutit | 2-4 nädalat | ⭐⭐⭐⭐⭐ |
| **AI integratsioon** | ✅ Built-in AI assistant | ❌ Puudub | ⭐⭐⭐⭐⭐ |
| **Desktop app** | ✅ Electron (offline-ready) | ❌ Ainult web | ⭐⭐⭐⭐ |
| **Multi-tenant** | ✅ Täielik isolatsioon | ⚠️ Segased õigused | ⭐⭐⭐⭐ |
| **API** | ✅ REST API (v1.7) | ⚠️ Piiratud | ⭐⭐⭐ |

---

## 📋 **JÄRGMISED SAMMUD (prioriteedid)**

### **TÄNA (10.11.2025):**
1. ✅ Security fix: COMPANY_ADMIN ei saa muuta paketti
2. ⏳ Company Admin kasutajate haldus
3. ⏳ Plan limits enforcement

### **HOMME (11.11.2025):**
1. Trial expiry cron job
2. UI/UX cleanup
3. Production deployment + testimine

### **SEE NÄDAL:**
1. SMTP integratsioon (SendGrid)
2. SMS integratsioon (Twilio)
3. Campaigns moodul (v0.1)

---

## 🔗 **VIITED**

- **Projekt repo:** https://github.com/ivartammela-stack/Smart
- **Production server:** http://185.170.198.120
- **Konkurent analüüs:** https://csc.ee/crm
- **Tech stack:** Node.js, Express, PostgreSQL, React, Electron, Sequelize

---

## 📝 **MÄRKMED**

- **Testimine:** Iga feature peab olema testitud nii SUPER_ADMIN kui COMPANY_ADMIN rollidega
- **Security:** Kõik API endpoint'id peavad olema kaitstud auth + role middleware'iga
- **Performance:** Limit queries < 100ms, UI interaktsioonid < 200ms
- **Documentation:** Iga uus API endpoint vajab Swagger dokumentatsiooni

---

**Viimane uuendus:** Session #10, 10.11.2025, 15:30 UTC

