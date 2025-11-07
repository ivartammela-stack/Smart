-- UTF-8 encoded SQL file
SET client_encoding = 'UTF8';

DELETE FROM tasks;
DELETE FROM deals;
DELETE FROM contacts;
DELETE FROM companies;

-- Companies with proper Estonian characters
INSERT INTO companies (name, registration_code, phone, email, address, notes, created_at, updated_at) VALUES 
('ACME Corporation OÜ', '12345678', '+372 5123 4567', 'info@acme.ee', 'Narva mnt 7, Tallinn 10117', 'Suur IT ettevõte', NOW(), NOW()),
('TechSolutions AS', '87654321', '+372 5234 5678', 'kontakt@techsolutions.ee', 'Pärnu mnt 15, Tallinn 10141', 'Keskendub tarkvara testimisele', NOW(), NOW()),
('MarketingPro OÜ', '11223344', '+372 5345 6789', 'info@marketingpro.ee', 'Viru väljak 2, Tallinn 10111', 'Digitaalturunduse agentuur', NOW(), NOW());

-- Contacts
INSERT INTO contacts (company_id, first_name, last_name, position, email, phone, notes, created_at, updated_at)
SELECT id, 'Jüri', 'Tamm', 'Tegevjuht', 'juri.tamm@acme.ee', '+372 5123 4567', 'Otsustaja', NOW(), NOW() FROM companies WHERE registration_code='12345678';

INSERT INTO contacts (company_id, first_name, last_name, position, email, phone, notes, created_at, updated_at)
SELECT id, 'Kadri', 'Kask', 'Projektijuht', 'kadri.kask@acme.ee', '+372 5123 4568', 'Projektijuht', NOW(), NOW() FROM companies WHERE registration_code='12345678';

INSERT INTO contacts (company_id, first_name, last_name, position, email, phone, notes, created_at, updated_at)
SELECT id, 'Marten', 'Mägi', 'CTO', 'marten.magi@techsolutions.ee', '+372 5234 5679', 'Tehniline juht', NOW(), NOW() FROM companies WHERE registration_code='87654321';

INSERT INTO contacts (company_id, first_name, last_name, position, email, phone, notes, created_at, updated_at)
SELECT id, 'Liisa', 'Lepp', 'Müügijuht', 'liisa.lepp@marketingpro.ee', '+372 5345 6790', 'Müügijuht', NOW(), NOW() FROM companies WHERE registration_code='11223344';

INSERT INTO contacts (company_id, first_name, last_name, position, email, phone, notes, created_at, updated_at)
SELECT id, 'Peeter', 'Poom', 'Creative Director', 'peeter.poom@marketingpro.ee', '+372 5345 6791', 'Looming', NOW(), NOW() FROM companies WHERE registration_code='11223344';

-- Deals
INSERT INTO deals (company_id, title, value, status, notes, created_at, updated_at)
SELECT id, 'CRM süsteemi arendus', 25000, 'new', 'ACME soovib uut CRM lahendust', NOW(), NOW() FROM companies WHERE registration_code='12345678';

INSERT INTO deals (company_id, title, value, status, notes, created_at, updated_at)
SELECT id, 'Testimise automatiseerimine', 15000, 'new', 'Automatiseeritud testimise lahendus', NOW(), NOW() FROM companies WHERE registration_code='87654321';

INSERT INTO deals (company_id, title, value, status, notes, created_at, updated_at)
SELECT id, 'Veebilehe redesign', 8500, 'won', 'Projekt võidetud', NOW(), NOW() FROM companies WHERE registration_code='11223344';

INSERT INTO deals (company_id, title, value, status, notes, created_at, updated_at)
SELECT id, 'IT turvalisuse konsultatsioon', 3500, 'lost', 'Klient valis teise pakkuja', NOW(), NOW() FROM companies WHERE registration_code='12345678';

-- Tasks  
INSERT INTO tasks (company_id, assigned_to, title, description, due_date, completed, created_at, updated_at)
SELECT c.id, u.id, 'Helista Jüri Tammele', 'Kinnita kohtumise aeg', CURRENT_DATE, false, NOW(), NOW()
FROM companies c, users u WHERE c.registration_code='12345678' AND u.email='admin@smartfollow.ee';

INSERT INTO tasks (company_id, assigned_to, title, description, due_date, completed, created_at, updated_at)
SELECT c.id, u.id, 'Saada pakkumine TechSolutions-ile', 'Koosta pakkumine', CURRENT_DATE, false, NOW(), NOW()
FROM companies c, users u WHERE c.registration_code='87654321' AND u.email='admin@smartfollow.ee';

INSERT INTO tasks (company_id, assigned_to, title, description, due_date, completed, created_at, updated_at)
SELECT c.id, u.id, 'Koosta veebilehe plaan', 'Ettevalmistus projektiga', CURRENT_DATE+1, false, NOW(), NOW()
FROM companies c, users u WHERE c.registration_code='11223344' AND u.email='admin@smartfollow.ee';

INSERT INTO tasks (company_id, assigned_to, title, description, due_date, completed, created_at, updated_at)
SELECT c.id, u.id, 'Kohtumine ACME projektijuhiga', 'Arutelu nõuete üle', CURRENT_DATE+7, false, NOW(), NOW()
FROM companies c, users u WHERE c.registration_code='12345678' AND u.email='admin@smartfollow.ee';

INSERT INTO tasks (company_id, assigned_to, title, description, due_date, completed, created_at, updated_at)
SELECT c.id, u.id, 'Follow-up kõne Liisa Lepaga', 'Tänan projekti eest', CURRENT_DATE, true, NOW(), NOW()
FROM companies c, users u WHERE c.registration_code='11223344' AND u.email='admin@smartfollow.ee';

SELECT 'Demo data seeded!' as status;

