# SmartFollow Demo Data Seed via API
# This ensures UTF-8 encoding is preserved

$baseUrl = "http://localhost:3000/api"

# Login as admin
$loginBody = @{
    email = "admin@smartfollow.ee"
    password = "admin123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginBody -ContentType "application/json; charset=utf-8"
$token = $loginResponse.token

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json; charset=utf-8"
}

Write-Host "🏢 Creating companies..." -ForegroundColor Green

# Company 1
$company1 = @{
    name = "ACME Corporation OÜ"
    registration_code = "12345678"
    phone = "+372 5123 4567"
    email = "info@acme.ee"
    address = "Narva mnt 7, Tallinn 10117"
    notes = "Suur IT ettevõte, mis pakub tarkvaraarendust ja konsultatsiooni"
} | ConvertTo-Json -Depth 10

$c1 = Invoke-RestMethod -Uri "$baseUrl/companies" -Method POST -Body $company1 -Headers $headers

# Company 2
$company2 = @{
    name = "TechSolutions AS"
    registration_code = "87654321"
    phone = "+372 5234 5678"
    email = "kontakt@techsolutions.ee"
    address = "Pärnu mnt 15, Tallinn 10141"
    notes = "Keskendub tarkvara testimisele ja kvaliteedile"
} | ConvertTo-Json -Depth 10

$c2 = Invoke-RestMethod -Uri "$baseUrl/companies" -Method POST -Body $company2 -Headers $headers

# Company 3
$company3 = @{
    name = "MarketingPro OÜ"
    registration_code = "11223344"
    phone = "+372 5345 6789"
    email = "info@marketingpro.ee"
    address = "Viru väljak 2, Tallinn 10111"
    notes = "Digitaalturunduse agentuur"
} | ConvertTo-Json -Depth 10

$c3 = Invoke-RestMethod -Uri "$baseUrl/companies" -Method POST -Body $company3 -Headers $headers

Write-Host "✅ 3 companies created" -ForegroundColor Green

Write-Host "👤 Creating contacts..." -ForegroundColor Green

# Contacts
$contact1 = @{
    company_id = $c1.company.id
    first_name = "Jüri"
    last_name = "Tamm"
    position = "Tegevjuht"
    email = "juri.tamm@acme.ee"
    phone = "+372 5123 4567"
    notes = "Otsustaja, sõbralik ja avatud uutele ideedele"
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "$baseUrl/contacts" -Method POST -Body $contact1 -Headers $headers | Out-Null

$contact2 = @{
    company_id = $c1.company.id
    first_name = "Kadri"
    last_name = "Kask"
    position = "Projektijuht"
    email = "kadri.kask@acme.ee"
    phone = "+372 5123 4568"
    notes = "Vastutab tehniliste projektide eest"
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "$baseUrl/contacts" -Method POST -Body $contact2 -Headers $headers | Out-Null

$contact3 = @{
    company_id = $c2.company.id
    first_name = "Marten"
    last_name = "Mägi"
    position = "CTO"
    email = "marten.magi@techsolutions.ee"
    phone = "+372 5234 5679"
    notes = "Tehniline juht, huvitatud uutest tehnoloogiatest"
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "$baseUrl/contacts" -Method POST -Body $contact3 -Headers $headers | Out-Null

$contact4 = @{
    company_id = $c3.company.id
    first_name = "Liisa"
    last_name = "Lepp"
    position = "Müügijuht"
    email = "liisa.lepp@marketingpro.ee"
    phone = "+372 5345 6790"
    notes = "Aktiivne ja energiline, otsib pidevalt uusi võimalusi"
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "$baseUrl/contacts" -Method POST -Body $contact4 -Headers $headers | Out-Null

$contact5 = @{
    company_id = $c3.company.id
    first_name = "Peeter"
    last_name = "Poom"
    position = "Creative Director"
    email = "peeter.poom@marketingpro.ee"
    phone = "+372 5345 6791"
    notes = "Loominguline juht, nõuab kvaliteeti"
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "$baseUrl/contacts" -Method POST -Body $contact5 -Headers $headers | Out-Null

Write-Host "✅ 5 contacts created" -ForegroundColor Green

Write-Host "💼 Creating deals..." -ForegroundColor Green

# Deals
$deal1 = @{
    company_id = $c1.company.id
    title = "CRM süsteemi arendus"
    value = 25000
    status = "new"
    notes = "ACME soovib uut CRM lahendust. Esimene kohtumine 15. novembril."
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "$baseUrl/deals" -Method POST -Body $deal1 -Headers $headers | Out-Null

$deal2 = @{
    company_id = $c2.company.id
    title = "Testimise automatiseerimine"
    value = 15000
    status = "new"
    notes = "TechSolutions vajab automatiseeritud testimise lahendust"
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "$baseUrl/deals" -Method POST -Body $deal2 -Headers $headers | Out-Null

$deal3 = @{
    company_id = $c3.company.id
    title = "Veebilehe redesign"
    value = 8500
    status = "won"
    notes = "Projekt võidetud! Alustame detsembris."
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "$baseUrl/deals" -Method POST -Body $deal3 -Headers $headers | Out-Null

$deal4 = @{
    company_id = $c1.company.id
    title = "IT turvalisuse konsultatsioon"
    value = 3500
    status = "lost"
    notes = "Klient valis teise pakkuja"
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "$baseUrl/deals" -Method POST -Body $deal4 -Headers $headers | Out-Null

Write-Host "✅ 4 deals created" -ForegroundColor Green

Write-Host "✅ Creating tasks..." -ForegroundColor Green

# Get admin user ID
$users = Invoke-RestMethod -Uri "$baseUrl/users" -Method GET -Headers $headers
$adminId = $users.users[0].id

$today = Get-Date -Format "yyyy-MM-dd"
$tomorrow = (Get-Date).AddDays(1).ToString("yyyy-MM-dd")
$nextWeek = (Get-Date).AddDays(7).ToString("yyyy-MM-dd")

# Tasks
$task1 = @{
    company_id = $c1.company.id
    assigned_to = $adminId
    title = "Helista Jüri Tammele"
    description = "Kinnita esimese kohtumise aeg ja arutle CRM vajaduste üle"
    due_date = $today
    completed = $false
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "$baseUrl/tasks" -Method POST -Body $task1 -Headers $headers | Out-Null

$task2 = @{
    company_id = $c2.company.id
    assigned_to = $adminId
    title = "Saada pakkumine TechSolutions-ile"
    description = "Koosta detailne pakkumine testimise automatiseerimise kohta"
    due_date = $today
    completed = $false
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "$baseUrl/tasks" -Method POST -Body $task2 -Headers $headers | Out-Null

$task3 = @{
    company_id = $c3.company.id
    assigned_to = $adminId
    title = "Koosta veebilehe redesigni plaan"
    description = "Ettevalmistus projektiga alustamiseks"
    due_date = $tomorrow
    completed = $false
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "$baseUrl/tasks" -Method POST -Body $task3 -Headers $headers | Out-Null

$task4 = @{
    company_id = $c1.company.id
    assigned_to = $adminId
    title = "Kohtumine ACME projektijuhiga"
    description = "Arutelu tehniliste nõuete üle"
    due_date = $nextWeek
    completed = $false
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "$baseUrl/tasks" -Method POST -Body $task4 -Headers $headers | Out-Null

$task5 = @{
    company_id = $c3.company.id
    assigned_to = $adminId
    title = "Follow-up kõne Liisa Lepaga"
    description = "Tänan projekti võitmise eest"
    due_date = $today
    completed = $true
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "$baseUrl/tasks" -Method POST -Body $task5 -Headers $headers | Out-Null

Write-Host "✅ 5 tasks created" -ForegroundColor Green

Write-Host ""
Write-Host "🎉 Demo data seeded successfully with proper UTF-8 encoding!" -ForegroundColor Cyan
Write-Host "   - Companies: 3" -ForegroundColor White
Write-Host "   - Contacts: 5" -ForegroundColor White
Write-Host "   - Deals: 4" -ForegroundColor White
Write-Host "   - Tasks: 5" -ForegroundColor White

