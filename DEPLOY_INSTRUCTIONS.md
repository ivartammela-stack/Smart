# 🚀 SmartFollow Deployment Instructions

## KUI UJUMAST TAGASI TULED:

### 📦 Desktop App v1.6.1

**Installer asukoht:**
```
C:\Users\koolitööd\Desktop\smartfollow-desktop\apps\desktop\release\SmartFollow-Setup-1.6.1.exe
```

**Installeeri:**
1. Sulge vana SmartFollow app (kui avatud)
2. Topeltkliki `SmartFollow-Setup-1.6.1.exe`
3. Järgi installer'i juhiseid
4. Käivita SmartFollow CRM

**Login:**
- Email: `admin@smartfollow.ee`
- Parool: `admin123`

---

### 🖥️ Server Deployment (185.170.198.120)

**VARIANT 1: Kiire käsk (kopeeri serveris terminalis):**

```bash
cd ~/smartfollow && git pull origin main && cd apps/server && npm ci && npm run build && pm2 restart smartfollow-server && pm2 logs smartfollow-server --lines 5
```

**VARIANT 2: Samm-sammult:**

```bash
# 1. SSH serverisse
ssh root@185.170.198.120

# 2. Mine projekti kausta
cd ~/smartfollow

# 3. Pull uusim kood
git pull origin main

# 4. Build backend
cd apps/server
npm ci
npm run build

# 5. Restart server
pm2 restart smartfollow-server

# 6. Kontrolli
pm2 logs smartfollow-server --lines 10
```

**VARIANT 3: Deploy script (kui lõin)**

```bash
# Serveris:
cd ~/smartfollow
chmod +x deploy-server.sh
./deploy-server.sh
```

---

## ✅ Mis on uut v1.6.1-s:

### Frontend (Desktop App):
1. **Taastatud originaalsed komponendid v1.4.1-st:**
   - ✅ Companies (Ettevõtted) - täielik CRUD
   - ✅ Contacts (Kontaktid) - täielik CRUD
   - ✅ Deals (Tehingud) - täielik CRUD + staatused
   - ✅ AdminUsers (Kasutajad) - kasutajate haldus

2. **Parooli muutmine:**
   - ✅ User profile'is nupp "🔒 Muuda parooli"
   - ✅ Modal vorm: praegune parool + uus parool + kinnitus
   - ✅ Valideerib et paroolid ühtivad
   - ✅ Min 6 tähemärki

3. **Custom ikoon:**
   - ✅ SmartFollow sinine logo (ei enam Electron atom)
   - ✅ Desktop shortcut'is ja taskbar'is

4. **Versiooni konsistentsus:**
   - ✅ Kõikjal 1.6.1 (sidebar + user profile)

### Backend:
1. **Trust proxy seadistus:**
   - ✅ `app.set('trust proxy', true);`
   - ✅ Elimineerib nginx X-Forwarded-For hoiatused

2. **Password change API:**
   - ✅ `PUT /api/users/password`
   - ✅ Nõuab autentimist (JWT)
   - ✅ Valideerib praegust parooli
   - ✅ Hashib uue parooli (bcrypt, 10 rounds)

---

## 🧪 Testimine

### Desktop App - Kontrolli kõiki vaateid:

- [ ] **Login** - admin@smartfollow.ee / admin123
- [ ] **Dashboard** - KPI'd ja graafikud
- [ ] **Ettevõtted** - Lisa/muuda/kustuta
- [ ] **Kontaktid** - Lisa/muuda/kustuta
- [ ] **Tehingud** - Lisa/muuda/kustuta (staatused!)
- [ ] **Ülesanded** - Lisa ülesanne, märgi tehtuks
- [ ] **Admin** - Lisa kasutaja, vaata nimekirja
- [ ] **Parooli muutmine** - Kliki "🔒 Muuda parooli", muuda parool
- [ ] **Logout** - Logi välja ja tagasi sisse

### Server - Test API'sid:

```bash
# Health check
curl http://185.170.198.120/health

# Login
curl -X POST http://185.170.198.120/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@smartfollow.ee","password":"admin123"}'

# Companies (auth required)
curl http://185.170.198.120/api/companies \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🐛 Kui midagi ei toimi:

### Desktop App:
- Kontrolli et server on üleval: `http://185.170.198.120/health`
- Vaata Developer Tools (F12) console'i
- Logi välja ja uuesti sisse

### Server:
```bash
# SSH serverisse
ssh root@185.170.198.120

# Kontrolli PM2
pm2 status

# Vaata logisid
pm2 logs smartfollow-server --lines 50

# Restart kui vaja
pm2 restart smartfollow-server

# Kontrolli nginx
sudo systemctl status nginx
sudo nginx -t
```

---

## 📞 Production Server Info:

**Server:** 185.170.198.120  
**OS:** Ubuntu 22.04 LTS  
**Location:** Vilnius, Lithuania

**Services:**
- Node.js: v24.11.0
- PostgreSQL: 14.19
- Nginx: 1.18.0
- PM2: Latest

**Database:**
- Name: smartfollow_db
- User: smartfollow_user
- Password: TurvalineParool123!

**Ports:**
- Backend: 3000 (internal)
- Nginx: 80 (public)

---

Hea ujumist! 🏊

Kui tagasi tuled:
1. ✅ Desktop app v1.6.1 valmis installimiseks
2. ✅ Server deploy'miseks ready
3. ✅ Kõik juhised siin failis

**LOO PR GITHUB'IS (link avatud browser'is) ja MERGE kui checks rohelised!**

Siis deploy serverisse ja testi! 🚀

