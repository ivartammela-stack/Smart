// @ts-nocheck
/**
 * Multi-tenant Setup Script
 * 
 * This script:
 * 1. Syncs database schema (creates accounts table, adds account_id columns)
 * 2. Creates default account
 * 3. Assigns all existing data to default account (account_id = 1)
 * 4. Sets admin user role to 'system_admin'
 */

import sequelize from '../src/config/database';
import { Account, User, Company, Contact, Deal, Task } from '../src/models';

async function setupMultiTenant() {
  try {
    console.log('🔄 Starting multi-tenant setup...\n');

    // Step 1: Sync database schema
    console.log('📊 Step 1: Syncing database schema...');
    await sequelize.sync({ alter: true });
    console.log('✅ Database schema synced\n');

    // Step 2: Create default account with TRIAL
    console.log('🏢 Step 2: Creating default account...');
    let defaultAccount = await Account.findByPk(1);
    
    if (!defaultAccount) {
      const now = new Date();
      const trialEnds = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // +14 days
      const graceEnds = new Date(trialEnds.getTime() + 7 * 24 * 60 * 60 * 1000); // +7 days

      defaultAccount = await Account.create({
        id: 1,
        name: 'Default Account',
        is_active: true,
        billing_plan: 'TRIAL',
        plan_locked: false,
        trial_ends_at: trialEnds,
        grace_ends_at: graceEnds,
      });
      console.log('✅ Default account created (ID: 1)');
      console.log(`   Trial ends: ${trialEnds.toISOString().split('T')[0]}`);
      console.log(`   Grace ends: ${graceEnds.toISOString().split('T')[0]}\n`);
    } else {
      console.log('ℹ️  Default account already exists (ID: 1)\n');
    }

    // Step 3: Assign all existing data to default account
    console.log('🔗 Step 3: Assigning existing data to default account...');
    
    // Update users
    const [usersUpdated] = await User.update(
      { account_id: 1 },
      { where: { account_id: null } }
    );
    console.log(`   ✅ Updated ${usersUpdated} users`);

    // Update companies
    const [companiesUpdated] = await Company.update(
      { account_id: 1 },
      { where: { account_id: null } }
    );
    console.log(`   ✅ Updated ${companiesUpdated} companies`);

    // Update contacts
    const [contactsUpdated] = await Contact.update(
      { account_id: 1 },
      { where: { account_id: null } }
    );
    console.log(`   ✅ Updated ${contactsUpdated} contacts`);

    // Update deals
    const [dealsUpdated] = await Deal.update(
      { account_id: 1 },
      { where: { account_id: null } }
    );
    console.log(`   ✅ Updated ${dealsUpdated} deals`);

    // Update tasks
    const [tasksUpdated] = await Task.update(
      { account_id: 1 },
      { where: { account_id: null } }
    );
    console.log(`   ✅ Updated ${tasksUpdated} tasks\n`);

    // Step 4: Set admin user to system_admin
    console.log('👑 Step 4: Setting admin user role to system_admin...');
    const admin = await User.findOne({ where: { email: 'admin@smartfollow.ee' } });
    if (admin && admin.role !== 'system_admin') {
      await admin.update({ role: 'system_admin' });
      console.log('✅ Admin user role updated to system_admin\n');
    } else if (admin) {
      console.log('ℹ️  Admin is already system_admin\n');
    } else {
      console.log('⚠️  Admin user not found\n');
    }

    // Summary
    console.log('🎉 Multi-tenant setup completed successfully!\n');
    console.log('📋 Summary:');
    console.log(`   - Default account created (ID: 1, Name: "${defaultAccount.name}")`);
    console.log(`   - ${usersUpdated[0]} users assigned to default account`);
    console.log(`   - ${companiesUpdated[0]} companies assigned to default account`);
    console.log(`   - ${contactsUpdated[0]} contacts assigned to default account`);
    console.log(`   - ${dealsUpdated[0]} deals assigned to default account`);
    console.log(`   - ${tasksUpdated[0]} tasks assigned to default account`);
    console.log('\n✅ System ready for multi-tenant operation!');
    console.log('\n💡 Next steps:');
    console.log('   1. Restart server: pm2 restart smartfollow-server');
    console.log('   2. Create new accounts for different clients');
    console.log('   3. Assign users to their accounts');

  } catch (error) {
    console.error('❌ Error during multi-tenant setup:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

setupMultiTenant();

