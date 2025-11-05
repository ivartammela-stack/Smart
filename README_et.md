# SmartFollow CRM töölauarakendus

## Ülevaade
SmartFollow on kliendisuhete halduse (CRM) rakendus, mis aitab ettevõtetel hallata kliendisuhtlust ja sujuvamaks muuta äriprotsesse. See projekt loob töölauarakenduse, mis kasutab Electronit ja TypeScripti ning Node.js/ PostgreSQL-i taustaks andmete haldamiseks.

## Projekti struktuur

- **apps/desktop**: Electroni töölauarakendus.
- **apps/server**: Node.js taustserver.
- **packages/shared**: Jagatud kood ja tüüpide definitsioonid.
- **docker**: Docker konfiguratsioonid PostgreSQL andmebaasile.
- **scripts**: Abiskriptid arenduseks ja käivitamiseks.

## Kasutatavad tehnoloogiad

- **Frontend**: Electron, React, TypeScript, CSS
- **Backend**: Node.js, Express, TypeScript, PostgreSQL
- **Andmebaas**: PostgreSQL
- **Containeriseerimine**: Docker
- **Paketihaldus**: pnpm

## Arenduse plaan (lühike)

### Faas 1: Seadistamine (nädalad 1–2)
- Repo initsialiseerimine ja kataloogistruktuuri loomine.
- `package.json` ja `tsconfig.json` seadistamine desktopi ja serveri jaoks.

### Faas 2: Frontend (nädalad 3–5)
- Electroni põhifailid ja akna loomine (`src/main/main.ts`).
- Preload-skripti seadistamine (`src/preload/preload.ts`).
- React-renderer (`src/renderer/index.tsx`) ja peakomponent (`src/renderer/components/App.tsx`).

### Faas 3: Backend (nädalad 6–8)
- Express-serveri seadistamine (`src/index.ts`).
- Autentimise kontrollija (`src/controllers/authController.ts`) ja kasutajate teenused (`src/services/userService.ts`).
- Andmebaasi migratsioonid (`src/db/migrations/001_init.sql`) ja algandmed (`src/db/seed/seed_users.sql`).

### Faas 4: Andmebaas ja Docker (nädalad 9–10)
- PostgreSQL Dockerfile ja initskriptid (`docker/postgres`).

### Faas 5: Testimine ja deploy (nädalad 11–12)
- Ühik- ja integratsioonitestid frontendile ja backendile.
- `scripts/start-dev.sh` arenduskõrvale.

## Kuidas alustada

1. Paigalda sõltuvused projekti juurest või vastavalt pakettidele (kasutatakse pnpm).
2. Käivita serveri ja desktopi arendusrežiimis (vt `scripts/start-dev.sh`).
3. Veendu, et PostgreSQL on üles ja migratsioonid/seadistused on rakendatud.

## Märkused

See fail on eestikeelne kokkuvõte peamisest `README.md` failist, mis asub samas kaustas.

Kui vajad abi või täpsustusi, ava issue või võta ühendust projekti omanikuga.
