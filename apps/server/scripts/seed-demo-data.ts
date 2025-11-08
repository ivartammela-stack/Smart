import { sequelize } from '../src/config/database';
import { User, Company, Contact, Deal, Task } from '../src/models';
import bcrypt from 'bcrypt';

async function seedDemoData() {
  try {
    console.log('🌱 Starting demo data seeding...');

    // 1. Delete all users except admin
    console.log('🗑️  Deleting non-admin users...');
    const adminUser = await User.findOne({ where: { email: 'admin@smartfollow.ee' } });
    
    if (!adminUser) {
      console.log('⚠️  Admin user not found. Creating admin user...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        username: 'admin',
        email: 'admin@smartfollow.ee',
        password: hashedPassword,
        role: 'admin',
      });
      console.log('✅ Admin user created');
    }

    // Delete all users except admin
    await User.destroy({
      where: {
        email: { [sequelize.Sequelize.Op.ne]: 'admin@smartfollow.ee' }
      }
    });
    console.log('✅ Non-admin users deleted');

    // 2. Delete all existing data
    console.log('🗑️  Cleaning existing data...');
    await Task.destroy({ where: {} });
    await Deal.destroy({ where: {} });
    await Contact.destroy({ where: {} });
    await Company.destroy({ where: {} });
    console.log('✅ Old data cleaned');

    // 3. Create demo companies
    console.log('🏢 Creating demo companies...');
    
    const acmeCorp = await Company.create({
      name: 'ACME Corporation OÜ',
      registry_code: '12345678',
      vat_number: 'EE102345678',
      address: 'Narva mnt 7, Tallinn 10117',
      phone: '+372 5123 4567',
      email: 'info@acme.ee',
      website: 'https://acme.ee',
      industry: 'IT teenused',
      notes: 'Suur IT ettevõte, mis pakub tarkvaraarendust ja konsultatsiooni',
    });

    const techSolutions = await Company.create({
      name: 'TechSolutions AS',
      registry_code: '87654321',
      vat_number: 'EE108765432',
      address: 'Pärnu mnt 15, Tallinn 10141',
      phone: '+372 5234 5678',
      email: 'kontakt@techsolutions.ee',
      website: 'https://techsolutions.ee',
      industry: 'Tehnoloogia',
      notes: 'Keskendub tarkvara testimisele ja kvaliteedile',
    });

    const marketingPro = await Company.create({
      name: 'MarketingPro OÜ',
      registry_code: '11223344',
      vat_number: 'EE101122334',
      address: 'Viru väljak 2, Tallinn 10111',
      phone: '+372 5345 6789',
      email: 'info@marketingpro.ee',
      website: 'https://marketingpro.ee',
      industry: 'Turundus',
      notes: 'Digitaalturunduse agentuur',
    });

    console.log('✅ 3 demo companies created');

    // 4. Create demo contacts
    console.log('👤 Creating demo contacts...');
    
    await Contact.create({
      company_id: acmeCorp.id,
      name: 'Jüri Tamm',
      position: 'Tegevjuht',
      email: 'juri.tamm@acme.ee',
      phone: '+372 5123 4567',
      notes: 'Otsustaja, sõbralik ja avatud uutele ideedele',
    });

    await Contact.create({
      company_id: acmeCorp.id,
      name: 'Kadri Kask',
      position: 'Projektijuht',
      email: 'kadri.kask@acme.ee',
      phone: '+372 5123 4568',
      notes: 'Vastutab tehniliste projektide eest',
    });

    await Contact.create({
      company_id: techSolutions.id,
      name: 'Marten Mägi',
      position: 'CTO',
      email: 'marten.magi@techsolutions.ee',
      phone: '+372 5234 5679',
      notes: 'Tehniline juht, huvitatud uutest tehnoloogiatest',
    });

    await Contact.create({
      company_id: marketingPro.id,
      name: 'Liisa Lepp',
      position: 'Müügijuht',
      email: 'liisa.lepp@marketingpro.ee',
      phone: '+372 5345 6790',
      notes: 'Aktiivne ja energiline, otsib pidevalt uusi võimalusi',
    });

    await Contact.create({
      company_id: marketingPro.id,
      name: 'Peeter Poom',
      position: 'Creative Director',
      email: 'peeter.poom@marketingpro.ee',
      phone: '+372 5345 6791',
      notes: 'Loominguline juht, nõuab kvaliteeti',
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
    });

    await Deal.create({
      company_id: techSolutions.id,
      title: 'Testimise automatiseerimine',
      value: 15000,
      status: 'new',
      notes: 'TechSolutions vajab automatiseeritud testimise lahendust',
    });

    await Deal.create({
      company_id: marketingPro.id,
      title: 'Veebilehe redesign',
      value: 8500,
      status: 'won',
      notes: 'Projekt võidetud! Alustame detsembris.',
    });

    await Deal.create({
      company_id: acmeCorp.id,
      title: 'Konsultatsioon IT turvalisuse teemal',
      value: 3500,
      status: 'lost',
      notes: 'Klient valis teise pakkuja',
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
      due_date: today.toISOString().split('T')[0],
      completed: false,
    });

    await Task.create({
      company_id: techSolutions.id,
      deal_id: null,
      assigned_to: adminUser!.id,
      title: 'Saada pakkumine TechSolutions-ile',
      description: 'Koosta detailne pakkumine testimise automatiseerimise kohta',
      due_date: today.toISOString().split('T')[0],
      completed: false,
    });

    await Task.create({
      company_id: marketingPro.id,
      deal_id: null,
      assigned_to: adminUser!.id,
      title: 'Koosta veebilehe redesigni plaan',
      description: 'Ettevalmistus projektiga alustamiseks',
      due_date: tomorrow.toISOString().split('T')[0],
      completed: false,
    });

    await Task.create({
      company_id: acmeCorp.id,
      deal_id: null,
      assigned_to: adminUser!.id,
      title: 'Kohtumine ACME projektijuhiga',
      description: 'Arutelu tehniliste nõuete üle',
      due_date: nextWeek.toISOString().split('T')[0],
      completed: false,
    });

    await Task.create({
      company_id: marketingPro.id,
      deal_id: null,
      assigned_to: adminUser!.id,
      title: 'Follow-up kõne Liisa Lepaga',
      description: 'Tänan projekti võitmise eest',
      due_date: today.toISOString().split('T')[0],
      completed: true,
    });

    console.log('✅ 5 demo tasks created');

    console.log('\n🎉 Demo data seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log('   - Users: 1 (admin)');
    console.log('   - Companies: 3');
    console.log('   - Contacts: 5');
    console.log('   - Deals: 4 (1 new, 1 won, 1 lost)');
    console.log('   - Tasks: 5 (3 pending today, 1 tomorrow, 1 completed)');
    console.log('\n✅ Ready to demo!');

  } catch (error) {
    console.error('❌ Error seeding demo data:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Run the seeder
seedDemoData();

