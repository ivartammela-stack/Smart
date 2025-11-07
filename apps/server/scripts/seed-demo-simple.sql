-- SmartFollow Demo Data Seed
-- Kustuta kõik kasutajad va admin ja loo demo andmed

-- 1. Delete all users except admin
DELETE FROM users WHERE email != 'admin@smartfollow.ee';

-- 2. Clean existing data
DELETE FROM tasks;
DELETE FROM deals;
DELETE FROM contacts;
DELETE FROM companies;

-- 3. Create demo companies
INSERT INTO companies (name, registration_code, phone, email, address, notes, created_at, updated_at) VALUES
('ACME Corporation OÜ', '12345678', '+372 5123 4567', 'info@acme.ee', 'Narva mnt 7, Tallinn 10117', 'Suur IT ettevõte, mis pakub tarkvaraarendust ja konsultatsiooni', NOW(), NOW()),
('TechSolutions AS', '87654321', '+372 5234 5678', 'kontakt@techsolutions.ee', 'Pärnu mnt 15, Tallinn 10141', 'Keskendub tarkvara testimisele ja kvaliteedile', NOW(), NOW()),
('MarketingPro OÜ', '11223344', '+372 5345 6789', 'info@marketingpro.ee', 'Viru väljak 2, Tallinn 10111', 'Digitaalturunduse agentuur', NOW(), NOW());

-- 4. Create demo contacts
INSERT INTO contacts (company_id, first_name, last_name, position, email, phone, notes, created_at, updated_at)
SELECT 
  c.id, 
  'Jüri', 
  'Tamm', 
  'Tegevjuht', 
  'juri.tamm@acme.ee', 
  '+372 5123 4567', 
  'Otsustaja, sõbralik ja avatud uutele ideedele',
  NOW(),
  NOW()
FROM companies c WHERE c.registration_code = '12345678';

INSERT INTO contacts (company_id, first_name, last_name, position, email, phone, notes, created_at, updated_at)
SELECT 
  c.id, 
  'Kadri', 
  'Kask', 
  'Projektijuht', 
  'kadri.kask@acme.ee', 
  '+372 5123 4568', 
  'Vastutab tehniliste projektide eest',
  NOW(),
  NOW()
FROM companies c WHERE c.registration_code = '12345678';

INSERT INTO contacts (company_id, first_name, last_name, position, email, phone, notes, created_at, updated_at)
SELECT 
  c.id, 
  'Marten', 
  'Mägi', 
  'CTO', 
  'marten.magi@techsolutions.ee', 
  '+372 5234 5679', 
  'Tehniline juht, huvitatud uutest tehnoloogiatest',
  NOW(),
  NOW()
FROM companies c WHERE c.registration_code = '87654321';

INSERT INTO contacts (company_id, first_name, last_name, position, email, phone, notes, created_at, updated_at)
SELECT 
  c.id, 
  'Liisa', 
  'Lepp', 
  'Müügijuht', 
  'liisa.lepp@marketingpro.ee', 
  '+372 5345 6790', 
  'Aktiivne ja energiline, otsib pidevalt uusi võimalusi',
  NOW(),
  NOW()
FROM companies c WHERE c.registration_code = '11223344';

INSERT INTO contacts (company_id, first_name, last_name, position, email, phone, notes, created_at, updated_at)
SELECT 
  c.id, 
  'Peeter', 
  'Poom', 
  'Creative Director', 
  'peeter.poom@marketingpro.ee', 
  '+372 5345 6791', 
  'Loominguline juht, nõuab kvaliteeti',
  NOW(),
  NOW()
FROM companies c WHERE c.registration_code = '11223344';

-- 5. Create demo deals
INSERT INTO deals (company_id, title, value, status, notes, created_at, updated_at)
SELECT 
  c.id, 
  'CRM süsteemi arendus', 
  25000, 
  'new', 
  'ACME soovib uut CRM lahendust. Esimene kohtumine 15. novembril.',
  NOW(),
  NOW()
FROM companies c WHERE c.registration_code = '12345678';

INSERT INTO deals (company_id, title, value, status, notes, created_at, updated_at)
SELECT 
  c.id, 
  'Testimise automatiseerimine', 
  15000, 
  'new', 
  'TechSolutions vajab automatiseeritud testimise lahendust',
  NOW(),
  NOW()
FROM companies c WHERE c.registration_code = '87654321';

INSERT INTO deals (company_id, title, value, status, notes, created_at, updated_at)
SELECT 
  c.id, 
  'Veebilehe redesign', 
  8500, 
  'won', 
  'Projekt võidetud! Alustame detsembris.',
  NOW(),
  NOW()
FROM companies c WHERE c.registration_code = '11223344';

INSERT INTO deals (company_id, title, value, status, notes, created_at, updated_at)
SELECT 
  c.id, 
  'Konsultatsioon IT turvalisuse teemal', 
  3500, 
  'lost', 
  'Klient valis teise pakkuja',
  NOW(),
  NOW()
FROM companies c WHERE c.registration_code = '12345678';

-- 6. Create demo tasks
INSERT INTO tasks (company_id, assigned_to, title, description, due_date, completed, created_at, updated_at)
SELECT 
  c.id,
  u.id,
  'Helista Jüri Tammele',
  'Kinnita esimese kohtumise aeg ja arutle CRM vajaduste üle',
  CURRENT_DATE,
  false,
  NOW(),
  NOW()
FROM companies c, users u
WHERE c.registration_code = '12345678' AND u.email = 'admin@smartfollow.ee';

INSERT INTO tasks (company_id, assigned_to, title, description, due_date, completed, created_at, updated_at)
SELECT 
  c.id,
  u.id,
  'Saada pakkumine TechSolutions-ile',
  'Koosta detailne pakkumine testimise automatiseerimise kohta',
  CURRENT_DATE,
  false,
  NOW(),
  NOW()
FROM companies c, users u
WHERE c.registration_code = '87654321' AND u.email = 'admin@smartfollow.ee';

INSERT INTO tasks (company_id, assigned_to, title, description, due_date, completed, created_at, updated_at)
SELECT 
  c.id,
  u.id,
  'Koosta veebilehe redesigni plaan',
  'Ettevalmistus projektiga alustamiseks',
  CURRENT_DATE + INTERVAL '1 day',
  false,
  NOW(),
  NOW()
FROM companies c, users u
WHERE c.registration_code = '11223344' AND u.email = 'admin@smartfollow.ee';

INSERT INTO tasks (company_id, assigned_to, title, description, due_date, completed, created_at, updated_at)
SELECT 
  c.id,
  u.id,
  'Kohtumine ACME projektijuhiga',
  'Arutelu tehniliste nõuete üle',
  CURRENT_DATE + INTERVAL '7 days',
  false,
  NOW(),
  NOW()
FROM companies c, users u
WHERE c.registration_code = '12345678' AND u.email = 'admin@smartfollow.ee';

INSERT INTO tasks (company_id, assigned_to, title, description, due_date, completed, created_at, updated_at)
SELECT 
  c.id,
  u.id,
  'Follow-up kõne Liisa Lepaga',
  'Tänan projekti võitmise eest',
  CURRENT_DATE,
  true,
  NOW(),
  NOW()
FROM companies c, users u
WHERE c.registration_code = '11223344' AND u.email = 'admin@smartfollow.ee';

-- Summary
SELECT '✅ Demo data seeded successfully!' as status;
SELECT 'Companies: ' || COUNT(*) as companies FROM companies;
SELECT 'Contacts: ' || COUNT(*) as contacts FROM contacts;
SELECT 'Deals: ' || COUNT(*) as deals FROM deals;
SELECT 'Tasks: ' || COUNT(*) as tasks FROM tasks;
SELECT 'Users: ' || COUNT(*) as users FROM users;

