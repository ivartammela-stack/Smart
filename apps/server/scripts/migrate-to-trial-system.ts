/**
 * Migration script: Add trial system fields to accounts table
 * 
 * This script:
 * 1. Adds plan_locked, trial_ends_at, grace_ends_at columns
 * 2. Updates billing_plan DEFAULT from 'FREE' → 'TRIAL'
 * 3. Sets trial dates for existing TRIAL accounts (14 days + 7 grace)
 */

import sequelize from '../src/config/database';
import { Account } from '../src/models';

async function migrateToTrialSystem() {
  try {
    console.log('🔄 Starting trial system migration...\n');

    // Step 1: Sync database schema (adds new columns)
    console.log('📊 Step 1: Syncing database schema...');
    await sequelize.sync({ alter: true });
    console.log('✅ Schema synced (plan_locked, trial_ends_at, grace_ends_at added)\n');

    // Step 2: Set trial dates for existing TRIAL accounts
    console.log('📅 Step 2: Setting trial dates for existing accounts...');
    
    const now = new Date();
    const trialEnds = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000); // +14 days
    const graceEnds = new Date(trialEnds.getTime() + 7 * 24 * 60 * 60 * 1000); // +7 days

    const [updated] = await Account.update(
      {
        trial_ends_at: trialEnds,
        grace_ends_at: graceEnds,
      },
      {
        where: {
          billing_plan: 'TRIAL',
          trial_ends_at: null, // Only update accounts without trial dates
        },
      }
    );

    console.log(`✅ Updated ${updated} TRIAL accounts with trial dates\n`);

    // Step 3: Summary
    const totalAccounts = await Account.count();
    const trialAccounts = await Account.count({ where: { billing_plan: 'TRIAL' } });
    const paidAccounts = totalAccounts - trialAccounts;

    console.log('🎉 Trial system migration completed!\n');
    console.log('📋 Summary:');
    console.log(`   - Total accounts: ${totalAccounts}`);
    console.log(`   - TRIAL accounts: ${trialAccounts}`);
    console.log(`   - Paid accounts: ${paidAccounts}`);
    console.log(`   - Trial ends: ${trialEnds.toISOString().split('T')[0]}`);
    console.log(`   - Grace ends: ${graceEnds.toISOString().split('T')[0]}`);
    console.log('\n✅ Ready for trial system!');

  } catch (error) {
    console.error('❌ Migration error:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

migrateToTrialSystem();

