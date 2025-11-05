# 📋 SmartFollow CRM - Arenduse Logi

---

## 📅 Sessioon: 2025-11-05
### 🎯 Teema: Backend Vundament + JWT Autentimine

---

## ✅ Tänase Töö Kokkuvõte

### 1. **PostgreSQL Andmebaas (Docker)**
- ✅ `docker-compose.yml` loodud
- ✅ PostgreSQL konteiner käivitatud ja töötab
- ✅ Tabelid loodud: `users`, `companies`, `contacts`, `deals`, `tasks`
- ✅ Port 5432 avatud

### 2. **Backend Server Konfiguratsioon**
- ✅ `.env` fail loodud (`apps/server/.env`)
- ✅ Sequelize ühendus konfigureeritud (`src/config/database.ts`)
- ✅ Server käivitub edukalt (`npm run dev`)
- ✅ `/health` endpoint töötab → `http://localhost:3000/health`

### 3. **Company CRUD API**
- ✅ Company mudel (`src/models/companyModel.ts`)
- ✅ Company service (`src/services/companyService.ts`)
- ✅ Company controller (`src/controllers/companyController.ts`)
- ✅ Company routes (`src/routes/companyRoutes.ts`)
- ✅ CRUD operatsioonid: GET, POST, PUT, DELETE

### 4. **JWT Autentimine** 🔐
- ✅ User mudel koos `role` ja `username` väljadega (`src/models/userModel.ts`)
- ✅ Auth controller: `register` ja `login` (`src/controllers/authController.ts`)
- ✅ Auth middleware: `authenticateJWT` (`src/middleware/authMiddleware.ts`)
- ✅ Auth routes: `/api/auth/register`, `/api/auth/login`
- ✅ bcrypt password hashing (salt rounds: 10)
- ✅ JWT token genereerimine (kehtivus: **2 tundi**)

### 5. **Company API Kaitse**
- ✅ POST/PUT/DELETE kaitstud JWT'ga
- ✅ GET päringud jäävad avalikuks
- ✅ `created_by` täitub automaatselt tokeni põhjal

---

## 🚀 Järgmise Sammu Plaan

### Prioriteet 1: Testimine
- ⬜ Testi kasutaja registreerimist
- ⬜ Testi sisselogimist (saa JWT token)
- ⬜ Testi Company loomist koos tokeniga
- ⬜ Kontrolli, et ilma tokenita POST/PUT/DELETE ei toimi

### Prioriteet 2: Contacts (Kontaktisikud)
- ⬜ Contact mudel
- ⬜ Contact CRUD API
- ⬜ Seos Company'ga (foreign key)

### Prioriteet 3: Deals (Tehingud)
- ⬜ Deal mudel
- ⬜ Deal CRUD API
- ⬜ Staatus: 'new', 'offer', 'won', 'lost'

### Prioriteet 4: Tasks (Järeltegevused)
- ⬜ Task mudel
- ⬜ Task CRUD API
- ⬜ "Täna" vaade (due_date filter)

---

## 📝 Arendus Checklist

### Backend Vundament
- [x] Docker PostgreSQL seadistatud
- [x] Sequelize ühendus töötab
- [x] `.gitignore` sisaldab `node_modules`, `.env`
- [x] TypeScript types installitud
- [x] Server käivitub ja töötab stabiilselt

### Autentimine & Turvalisus
- [x] User mudel loodud
- [x] Paroolide hasheerimine (bcrypt)
- [x] JWT tokeni genereerimine
- [x] Auth middleware
- [x] Protected routes (POST/PUT/DELETE)
- [ ] Refresh token (tulevikus)
- [ ] Password reset (tulevikus)

### Company CRUD
- [x] Company mudel
- [x] GET /api/companies (avalik)
- [x] GET /api/companies/:id (avalik)
- [x] POST /api/companies (kaitstud)
- [x] PUT /api/companies/:id (kaitstud)
- [x] DELETE /api/companies/:id (kaitstud)
- [x] `created_by` automaatne täitmine

### Contacts CRUD
- [ ] Contact mudel
- [ ] GET /api/contacts
- [ ] POST /api/contacts
- [ ] PUT /api/contacts/:id
- [ ] DELETE /api/contacts/:id
- [ ] Seos Company'ga

### Deals CRUD
- [ ] Deal mudel
- [ ] GET /api/deals
- [ ] POST /api/deals
- [ ] PUT /api/deals/:id
- [ ] DELETE /api/deals/:id

### Tasks CRUD
- [ ] Task mudel
- [ ] GET /api/tasks
- [ ] GET /api/tasks/today (täna tähtaeg)
- [ ] POST /api/tasks
- [ ] PUT /api/tasks/:id
- [ ] DELETE /api/tasks/:id

---

## 🧪 Postman Teststsenaariumid

### 1️⃣ Health Check (Testimine ilma tokenita)

**Request:**
```http
GET http://localhost:3000/health
```

**Expected Response (200 OK):**
```json
{
  "status": "ok",
  "message": "SmartFollow server is running 🚀"
}
```

---

### 2️⃣ Kasutaja Registreerimine

**Request:**
```http
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "username": "testkasutaja",
  "email": "test@example.com",
  "password": "123456"
}
```

> **NB!** Kasutame `username` (mitte `name`) - see on kooskõlas User mudeliga!

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "testkasutaja",
    "email": "test@example.com"
  }
}
```

**Kontrollpunktid:**
- ✅ Parool on hashitud andmebaasis (ei ole plaintext)
- ✅ Email on unique (sama emailiga uuesti ei saa registreeruda)

---

### 3️⃣ Sisselogimine (JWT tokeni saamine)

**Request:**
```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "123456"
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJ0ZXN0QGV4YW1wbGUuY29tIiwidXNlcm5hbWUiOiJ0ZXN0a2FzdXRhamEiLCJpYXQiOjE3MzA4MzQwMDAsImV4cCI6MTczMDg0MTIwMH0.XYZ...",
  "user": {
    "id": 1,
    "username": "testkasutaja",
    "email": "test@example.com"
  }
}
```

**📋 KOPEERI TOKEN järgmiste päringute jaoks!**

**Kontrollpunktid:**
- ✅ Vale parooliga ei saa sisse logida
- ✅ Olematava emailiga ei saa sisse logida
- ✅ Token kehtib 2 tundi

---

### 4️⃣ Klientide Nimekiri (Avalik - ilma tokenita)

**Request:**
```http
GET http://localhost:3000/api/companies
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "count": 0,
  "data": []
}
```

**Kontrollpunktid:**
- ✅ Töötab ilma Authorization headerita
- ✅ Tagastab tühja massiivi, kui kliente pole

---

### 5️⃣ Uue Kliendi Loomine (Kaitstud - vajab tokenit)

**Request:**
```http
POST http://localhost:3000/api/companies
Authorization: Bearer <SINU_TOKEN_SIIA>
Content-Type: application/json

{
  "name": "OÜ AutoPro",
  "registration_code": "12345678",
  "phone": "+372 5555 5555",
  "email": "info@autopro.ee",
  "address": "Tallinn, Eesti",
  "notes": "Autoteenindus ja remont"
}
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "message": "Company created successfully",
  "data": {
    "id": 1,
    "name": "OÜ AutoPro",
    "registration_code": "12345678",
    "phone": "+372 5555 5555",
    "email": "info@autopro.ee",
    "address": "Tallinn, Eesti",
    "notes": "Autoteenindus ja remont",
    "created_by": 1,
    "createdAt": "2025-11-05T17:30:00.000Z",
    "updatedAt": "2025-11-05T17:30:00.000Z"
  }
}
```

**Kontrollpunktid:**
- ✅ `created_by` on automaatselt täidetud tokenist
- ✅ `registration_code` on unique (sama koodiga uuesti ei saa)

---

### 6️⃣ Kliendi Loomine ILMA Tokenita (peaks ebaõnnestuma)

**Request:**
```http
POST http://localhost:3000/api/companies
Content-Type: application/json

{
  "name": "OÜ TestFirma",
  "registration_code": "99999999"
}
```

**Expected Response (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Missing token"
}
```

**Kontrollpunktid:**
- ✅ Tagastab 401 statuse
- ✅ Klienti EI looda andmebaasi

---

### 7️⃣ Kliendi Uuendamine (Kaitstud)

**Request:**
```http
PUT http://localhost:3000/api/companies/1
Authorization: Bearer <SINU_TOKEN_SIIA>
Content-Type: application/json

{
  "phone": "+372 6666 6666",
  "notes": "Uuendatud kontaktandmed"
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Company updated successfully",
  "data": {
    "id": 1,
    "name": "OÜ AutoPro",
    "phone": "+372 6666 6666",
    "notes": "Uuendatud kontaktandmed",
    ...
  }
}
```

---

### 8️⃣ Kliendi Kustutamine (Kaitstud)

**Request:**
```http
DELETE http://localhost:3000/api/companies/1
Authorization: Bearer <SINU_TOKEN_SIIA>
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Company deleted successfully"
}
```

**Kontrollpunktid:**
- ✅ Klient kustutatakse andmebaasist
- ✅ Järgnev GET /api/companies ei näita enam seda klienti

---

## 🔧 Tehnilised Märkmed & Õppimised

### 1. **PostgreSQL 18+ Volume Probleem**
**Probleem:** Docker konteiner restartimine - `EADDRINUSE: port in use`

**Lahendus:**
```yaml
volumes:
  - postgres_data:/var/lib/postgresql  # mitte /var/lib/postgresql/data
```

---

### 2. **TypeScript Import/Export**
**Probleem:** `Module has no exported member 'router'`

**Lahendus:**
- Kasuta `export default router` ja `import router from '...'`
- VÕI kasuta `export { router }` ja `import { router } from '...'`
- OLULINE: Ole konsistentne läbi projekti!

---

### 3. **Sequelize Timestamps**
**Probleem:** `created_at` vs `createdAt`

**Lahendus:**
```typescript
{
  sequelize,
  tableName: 'companies',
  timestamps: true,
  createdAt: 'created_at',  // PostgreSQL kasutab snake_case
  updatedAt: 'updated_at',
}
```

---

### 4. **JWT Middleware TypeScript Typing**
**Probleem:** `req.user` pole Request tüübil olemas

**Lahendus:**
```typescript
export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    username: string;
  };
}

export const createNewCompany = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id; // ✅ TypeScript on rahul
}
```

---

### 5. **bcrypt ja Asynchronous Hashing**
**Oluline:** Kasuta alati `await` bcrypt funktsioonidega!

```typescript
// ✅ Õige
const hashed = await bcrypt.hash(password, 10);
const valid = await bcrypt.compare(password, user.password);

// ❌ Vale (sync versioon on aeglane ja blokeerib)
const hashed = bcrypt.hashSync(password, 10);
```

---

## 📂 Koodinäidete Sektsioon

### Failide Struktuur
```
apps/server/src/
├── config/
│   └── database.ts           # Sequelize ühendus
├── models/
│   ├── userModel.ts          # User mudel
│   └── companyModel.ts       # Company mudel
├── controllers/
│   ├── authController.ts     # register, login
│   └── companyController.ts  # Company CRUD
├── services/
│   ├── userService.ts        # User äriloogika
│   └── companyService.ts     # Company äriloogika
├── middleware/
│   └── authMiddleware.ts     # JWT kontrollimine
├── routes/
│   ├── index.ts              # Põhi router
│   ├── authRoutes.ts         # /api/auth/*
│   └── companyRoutes.ts      # /api/companies/*
└── index.ts                  # Express server
```

---

### Sequelize Ühendus (database.ts)
```typescript
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'smartfollow_db',
  process.env.DB_USER || 'smartfollow',
  process.env.DB_PASSWORD || 'yourpassword',
  {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
  }
);

// Test connection
export const testConnection = async (): Promise<boolean> => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully.');
    return true;
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    return false;
  }
};

export default sequelize;
```

---

### JWT Middleware (authMiddleware.ts)
```typescript
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret123';

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, message: 'Missing token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Invalid token' });
  }
};
```

---

### Protected Route (companyRoutes.ts)
```typescript
import { authenticateJWT } from '../middleware/authMiddleware';

router.post('/', authenticateJWT, createNewCompany);        // Kaitstud
router.put('/:id', authenticateJWT, updateExistingCompany); // Kaitstud
router.delete('/:id', authenticateJWT, removeCompany);      // Kaitstud
```

---

## 🎯 Järgmise Sessiooni Eesmärgid

1. **Testi kogu API Postmanis** (käi läbi kõik 8 stsenaariumi)
2. **Lisa Contacts mudel ja CRUD**
3. **Lisa Deals mudel ja CRUD**
4. **Loo "Täna" vaade Tasks jaoks**

---

## 💡 Lessons Learned (Õppetunnid)

### 1. **PostgreSQL 18+ nõuab teistsugust volume struktuuri**
- **Probleem:** Konteiner restartimine - volume path viga
- **Lahendus:** Kasuta `/var/lib/postgresql` (mitte `/var/lib/postgresql/data`)
- **Õppetund:** Loe alati uusimate versioonide release notes'e!

### 2. **TypeScript import/export konsistentsus on kriitilise tähtsusega**
- **Probleem:** `Module has no exported member 'router'`
- **Lahendus:** Vali üks variant (`export default` VÕI `export { ... }`) ja kasuta kõikjal sama
- **Õppetund:** Named vs default exports - ole järjepidev kogu projektis

### 3. **Sequelize timestamps + PostgreSQL = snake_case**
- **Probleem:** Sequelize kasutab camelCase (`createdAt`), PostgreSQL ootab snake_case (`created_at`)
- **Lahendus:** Määra Sequelize config'is `createdAt: 'created_at'`
- **Õppetund:** ORM ja andmebaasi nimereeglid peavad sobima kokku

### 4. **JWT middleware vajab custom TypeScript interface'i**
- **Probleem:** `req.user` pole Express Request'il olemas
- **Lahendus:** Loo `AuthRequest extends Request` interface
- **Õppetund:** TypeScript type safety on oluline - ära kasuta `any`!

### 5. **bcrypt on asünkroonne - kasuta ALATI await**
- **Probleem:** Sync versioonid blokeerivad event loop'i
- **Lahendus:** `await bcrypt.hash()` ja `await bcrypt.compare()`
- **Õppetund:** Node.js-is on async/await eelistatud praktika

---

## 📌 Märkmed & Ideed

- [ ] Kaaluda `createdAt` ja `updatedAt` eestikeelsete nimedega (`loodud`, `uuendatud`)
- [ ] Lisa `role`-põhine juurdepääsukontroll (admin vs kasutaja)
- [ ] Lisa pagination Company GET päringule (kui kliente on palju)
- [ ] Kaaluda GraphQL'i kasutamist REST API asemel (tulevikus)
- [ ] Frontend (Electron) alustamine - järgmine suur samm
- [ ] **Lisa Postman testide screenshot'id** → `docs/screenshots/`
- [ ] **Dokumenteeri API errorid** (4xx, 5xx response format)

---

## 📸 Visuaalne Dokumentatsioon

### Screenshot'ide struktuur:
```
docs/screenshots/
├── 2025-11-05_health_check.png
├── 2025-11-05_register_success.png
├── 2025-11-05_login_jwt_token.png
├── 2025-11-05_company_create_protected.png
└── 2025-11-05_company_create_no_token_fails.png
```

> **Järgmises sessioonis:** Lisa Postman testide ekraanipildid!

---

**Viimati uuendatud:** 2025-11-05, 20:15  
**Autor:** AI Assistant + Kasutaja  
**Versioon:** 1.1 - Backend MVP + Lessons Learned

---
---

# 📅 Template - Järgmise Sessiooni Jaoks

---

## 📅 Sessioon: [KUUPÄEV]
### 🎯 Teema: [TEEMA NIMI]

---

## ✅ Tänase Töö Kokkuvõte

### 1. **[Moodul/Feature Nimi]**
- ✅ [Konkreetne saavutus 1]
- ✅ [Konkreetne saavutus 2]

---

## 🚀 Järgmise Sammu Plaan

### Prioriteet 1: [Feature]
- ⬜ [Ülesanne 1]
- ⬜ [Ülesanne 2]

---

## 🧪 Testitud Funktsioonid

| Test | Endpoint | Tulemus |
|------|----------|---------|
| ✅ | GET /api/... | Töötab |
| ❌ | POST /api/... | Viga leitud |

---

## 💡 Lessons Learned

### 1. **[Õppetund 1]**
- **Probleem:** [Kirjeldus]
- **Lahendus:** [Kuidas lahendasin]
- **Õppetund:** [Mis õppisin]

---

## 📸 Screenshot'id

![Postman test - Success](screenshots/[KUUPÄEV]_[NIMI].png)

---

**Viimati uuendatud:** [KUUPÄEV], [KL]  
**Autor:** AI Assistant + Kasutaja  
**Versioon:** [X.X] - [Kirjeldus]

