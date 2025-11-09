/**
 * Billing Maintenance - Automated trial/grace/lock management
 * 
 * Run this script periodically (e.g., daily via cron) to:
 * 1. Lock expired TRIAL accounts (trial_ends_at < now)
 * 2. Mark accounts for deletion (grace_ends_at < now)
 * 
 * Usage:
 *   node-cron: schedule.scheduleJob('0 2 * * *', () => { ... })
 *   Manual: npm run billing:maintenance
 *   PM2 cron: pm2 start billing-maintenance.js --cron "0 2 * * *"
 */

import sequelize from '../src/config/database';
import { Account } from '../src/models';
import { Op } from 'sequelize';

async function billingMaintenance() {
  try {
    console.log('🔄 Starting billing maintenance...\n');
    const now = new Date();

    // Step 1: Lock expired TRIAL accounts
    console.log('🔒 Step 1: Locking expired TRIAL accounts...');
    
    const [lockedCount] = await Account.update(
      {
        plan_locked: true,
      },
      {
        where: {
          billing_plan: 'TRIAL',
          plan_locked: false,
          trial_ends_at: {
            [Op.lt]: now,
          },
        },
      }
    );

    console.log(`✅ Locked ${lockedCount} expired TRIAL accounts\n`);

    // Step 2: Find accounts that should be deleted (grace period ended)
    console.log('🗑️  Step 2: Finding accounts with expired grace period...');
    
    const expiredAccounts = await Account.findAll({
      where: {
        billing_plan: 'TRIAL',
        plan_locked: true,
        grace_ends_at: {
          [Op.lt]: now,
        },
      },
    });

    console.log(`⚠️  Found ${expiredAccounts.length} accounts with expired grace period`);

    // For safety, we don't auto-delete yet - just mark them
    // You can uncomment the deletion logic below when ready
    /*
    for (const account of expiredAccounts) {
      console.log(`   - Deleting account: ${account.id} (${account.name})`);
      
      // Delete all related data first
      await User.destroy({ where: { account_id: account.id } });
      await Company.destroy({ where: { account_id: account.id } });
      await Contact.destroy({ where: { account_id: account.id } });
      await Deal.destroy({ where: { account_id: account.id } });
      await Task.destroy({ where: { account_id: account.id } });
      
      // Delete account
      await account.destroy();
    }
    */

    if (expiredAccounts.length > 0) {
      console.log('\n⚠️  IMPORTANT: Auto-deletion is disabled for safety.');
      console.log('   To enable, uncomment the deletion logic in billing-maintenance.ts');
      console.log('\n   Accounts pending deletion:');
      expiredAccounts.forEach((acc) => {
        console.log(`   - ID: ${acc.id}, Name: ${acc.name}, Grace ended: ${acc.grace_ends_at?.toISOString().split('T')[0]}`);
      });
    }

    // Step 3: Send warnings for accounts in grace period
    console.log('\n📧 Step 3: Finding accounts in grace period...');
    
    const graceAccounts = await Account.findAll({
      where: {
        billing_plan: 'TRIAL',
        plan_locked: true,
        grace_ends_at: {
          [Op.gte]: now,
        },
      },
    });

    console.log(`📬 Found ${graceAccounts.length} accounts in grace period`);
    
    if (graceAccounts.length > 0) {
      console.log('   TODO: Send email reminders to these accounts:');
      graceAccounts.forEach((acc) => {
        const daysLeft = Math.ceil((acc.grace_ends_at!.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        console.log(`   - ${acc.name} (${daysLeft} days left)`);
      });
    }

    // Summary
    console.log('\n🎉 Billing maintenance completed!');
    console.log('📋 Summary:');
    console.log(`   - Locked accounts: ${lockedCount}`);
    console.log(`   - Accounts in grace: ${graceAccounts.length}`);
    console.log(`   - Accounts pending deletion: ${expiredAccounts.length}`);

  } catch (error) {
    console.error('❌ Billing maintenance error:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

billingMaintenance();

