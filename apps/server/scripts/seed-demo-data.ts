import sequelize from '../src/config/database';
import { Op } from 'sequelize';
import { User, Company, Contact, Deal, Task, Account } from '../src/models';
import bcrypt from 'bcrypt';

async function seedDemoData() {
  try {
    console.log('🌱 Starting demo data seeding (multi-tenant)...');

    // 1. Clean existing data
    console.log('🗑️  Cleaning existing data...');
    await Task.destroy({ where: {} });
    await Deal.destroy({ where: {} });
    await Contact.destroy({ where: {} });
    await Company.destroy({ where: {} });
    await User.destroy({ where: { email: { [Op.ne]: 'admin@smartfollow.ee' } } });
    await Account.destroy({ where: {} });
    console.log('✅ Old data cleaned');

    // 2. Create accounts
    console.log('🏢 Creating accounts...');
    const demoAccount = await Account.create({
      name: 'Demo Account',
      billing_plan: 'ENTERPRISE',
      is_active: true,
      plan_locked: false,
    });
    console.log(`✅ Demo Account created (ID: ${demoAccount.id})`);

    // 3. Setup SUPER_ADMIN user
    console.log('👤 Setting up SUPER_ADMIN...');
    let adminUser = await User.findOne({ where: { email: 'admin@smartfollow.ee' } });
    
    if (!adminUser) {
      console.log('⚠️  Admin user not found. Creating SUPER_ADMIN...');
      const hashedPassword = await bcrypt.hash('Passw0rd', 10);
      adminUser = await User.create({
        username: 'admin',
        email: 'admin@smartfollow.ee',
        password: hashedPassword,
        role: 'SUPER_ADMIN',
        plan: 'ENTERPRISE',
        account_id: null, // SUPER_ADMIN has no specific account
        is_active: true,
      });
      console.log('✅ SUPER_ADMIN created');
    } else {
      // Update existing admin to correct role and account_id
      await adminUser.update({
        role: 'SUPER_ADMIN',
        account_id: null,
        is_active: true,
      });
      console.log('✅ Existing admin updated to SUPER_ADMIN');
    }

    // 3. Create demo companies
    console.log('🏢 Creating demo companies...');
    
    const acmeCorp = await Company.create({
      name: 'ACME Corporation OÜ',
      registration_code: '12345678',
      vat_number: 'EE102345678',
      address: 'Narva mnt 7, Tallinn 10117',
      phone: '+372 5123 4567',
      email: 'info@acme.ee',
      website: 'https://acme.ee',
      industry: 'IT teenused',
      notes: 'Suur IT ettevõte, mis pakub tarkvaraarendust ja konsultatsiooni',
      account_id: demoAccount.id,
    });

    const techSolutions = await Company.create({
      name: 'TechSolutions AS',
      registration_code: '87654321',
      vat_number: 'EE108765432',
      address: 'Pärnu mnt 15, Tallinn 10141',
      phone: '+372 5234 5678',
      email: 'kontakt@techsolutions.ee',
      website: 'https://techsolutions.ee',
      industry: 'Tehnoloogia',
      notes: 'Keskendub tarkvara testimisele ja kvaliteedile',
      account_id: demoAccount.id,
    });

    const marketingPro = await Company.create({
      name: 'MarketingPro OÜ',
      registration_code: '11223344',
      vat_number: 'EE101122334',
      address: 'Viru väljak 2, Tallinn 10111',
      phone: '+372 5345 6789',
      email: 'info@marketingpro.ee',
      website: 'https://marketingpro.ee',
      industry: 'Turundus',
      notes: 'Digitaalturunduse agentuur',
      account_id: demoAccount.id,
    });

    console.log('✅ 3 demo companies created');

    // 4. Create demo contacts
    console.log('👤 Creating demo contacts...');
    
    await Contact.create({
      company_id: acmeCorp.id,
      first_name: 'Jüri',
      last_name: 'Tamm',
      position: 'Tegevjuht',
      email: 'juri.tamm@acme.ee',
      phone: '+372 5123 4567',
      notes: 'Otsustaja, sõbralik ja avatud uutele ideedele',
      account_id: demoAccount.id,
    });

    await Contact.create({
      company_id: acmeCorp.id,
      first_name: 'Kadri',
      last_name: 'Kask',
      position: 'Projektijuht',
      email: 'kadri.kask@acme.ee',
      phone: '+372 5123 4568',
      notes: 'Vastutab tehniliste projektide eest',
      account_id: demoAccount.id,
    });

    await Contact.create({
      company_id: techSolutions.id,
      first_name: 'Marten',
      last_name: 'Mägi',
      position: 'CTO',
      email: 'marten.magi@techsolutions.ee',
      phone: '+372 5234 5679',
      notes: 'Tehniline juht, huvitatud uutest tehnoloogiatest',
      account_id: demoAccount.id,
    });

    await Contact.create({
      company_id: marketingPro.id,
      first_name: 'Liisa',
      last_name: 'Lepp',
      position: 'Müügijuht',
      email: 'liisa.lepp@marketingpro.ee',
      phone: '+372 5345 6790',
      notes: 'Aktiivne ja energiline, otsib pidevalt uusi võimalusi',
      account_id: demoAccount.id,
    });

    await Contact.create({
      company_id: marketingPro.id,
      first_name: 'Peeter',
      last_name: 'Poom',
      position: 'Creative Director',
      email: 'peeter.poom@marketingpro.ee',
      phone: '+372 5345 6791',
      notes: 'Loominguline juht, nõuab kvaliteetti',
      account_id: demoAccount.id,
    });

    console.log('✅ 5 demo contacts created');

    // 5. Create demo deals
    console.log('💼 Creating demo deals...');
    
    await Deal.create({
      company_id: acmeCorp.id,
      title: 'CRM süsteemi arendus',
      value: 25000,
      status: 'new',
      notes: 'ACME soovib uut CRM lahendust. Esimene kohtumine 15. novembril.',
      account_id: demoAccount.id,
    });

    await Deal.create({
      company_id: techSolutions.id,
      title: 'Testimise automatiseerimine',
      value: 15000,
      status: 'new',
      notes: 'TechSolutions vajab automatiseeritud testimise lahendust',
      account_id: demoAccount.id,
    });

    await Deal.create({
      company_id: marketingPro.id,
      title: 'Veebilehe redesign',
      value: 8500,
      status: 'won',
      notes: 'Projekt võidetud! Alustame detsembris.',
      account_id: demoAccount.id,
    });

    await Deal.create({
      company_id: acmeCorp.id,
      title: 'Konsultatsioon IT turvalisuse teemal',
      value: 3500,
      status: 'lost',
      notes: 'Klient valis teise pakkuja',
      account_id: demoAccount.id,
    });

    console.log('✅ 4 demo deals created');

    // 6. Create demo tasks
    console.log('✅ Creating demo tasks...');
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    await Task.create({
      company_id: acmeCorp.id,
      deal_id: null,
      assigned_to: adminUser!.id,
      title: 'Helista Jüri Tammele',
      description: 'Kinnita esimese kohtumise aeg ja arutle CRM vajaduste üle',
      due_date: today,
      completed: false,
      account_id: demoAccount.id,
    });

    await Task.create({
      company_id: techSolutions.id,
      deal_id: null,
      assigned_to: adminUser!.id,
      title: 'Saada pakkumine TechSolutions-ile',
      description: 'Koosta detailne pakkumine testimise automatiseerimise kohta',
      due_date: today,
      completed: false,
      account_id: demoAccount.id,
    });

    await Task.create({
      company_id: marketingPro.id,
      deal_id: null,
      assigned_to: adminUser!.id,
      title: 'Koosta veebilehe redesigni plaan',
      description: 'Ettevalmistus projektiga alustamiseks',
      due_date: tomorrow,
      completed: false,
      account_id: demoAccount.id,
    });

    await Task.create({
      company_id: acmeCorp.id,
      deal_id: null,
      assigned_to: adminUser!.id,
      title: 'Kohtumine ACME projektijuhiga',
      description: 'Arutelu tehniliste nõuete üle',
      due_date: nextWeek,
      completed: false,
      account_id: demoAccount.id,
    });

    await Task.create({
      company_id: marketingPro.id,
      deal_id: null,
      assigned_to: adminUser!.id,
      title: 'Follow-up kõne Liisa Lepaga',
      description: 'Tänan projekti võitmise eest',
      due_date: today,
      completed: true,
      account_id: demoAccount.id,
    });

    console.log('✅ 5 demo tasks created');

    console.log('\n🎉 Demo data seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log('   - Accounts: 1 (Demo Account)');
    console.log('   - Users: 1 (SUPER_ADMIN with account_id = NULL)');
    console.log('   - Companies: 3 (all in Demo Account)');
    console.log('   - Contacts: 5');
    console.log('   - Deals: 4 (1 new, 1 won, 1 lost)');
    console.log('   - Tasks: 5 (3 pending today, 1 tomorrow, 1 completed)');
    console.log('\n🎯 Multi-tenant setup:');
    console.log(`   - Demo data in Account ID: ${demoAccount.id}`);
    console.log('   - SUPER_ADMIN can access all accounts (account_id = NULL)');
    console.log('   - Ready for testing!');

  } catch (error) {
    console.error('❌ Error seeding demo data:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Run the seeder
seedDemoData();

