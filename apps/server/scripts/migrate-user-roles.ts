// @ts-nocheck
/**
 * Migration: Update User Roles
 * 
 * Converts old role values to new standardized names:
 * - 'system_admin' → 'SUPER_ADMIN'
 * - 'admin' → 'COMPANY_ADMIN'
 * - 'user' → 'USER'
 */

import sequelize from '../src/config/database';
import { User } from '../src/models';

async function migrateUserRoles() {
  try {
    console.log('🔄 Starting user roles migration...\n');

    // Step 1: Update system_admin → SUPER_ADMIN
    console.log('👑 Step 1: Converting system_admin → SUPER_ADMIN...');
    const [superAdminCount] = await User.update(
      { role: 'SUPER_ADMIN' },
      { where: { role: 'system_admin' } }
    );
    console.log(`✅ Updated ${superAdminCount} users\n`);

    // Step 2: Update admin → COMPANY_ADMIN
    console.log('🏢 Step 2: Converting admin → COMPANY_ADMIN...');
    const [companyAdminCount] = await User.update(
      { role: 'COMPANY_ADMIN' },
      { where: { role: 'admin' } }
    );
    console.log(`✅ Updated ${companyAdminCount} users\n`);

    // Step 3: Update user → USER
    console.log('👤 Step 3: Converting user → USER...');
    const [userCount] = await User.update(
      { role: 'USER' },
      { where: { role: 'user' } }
    );
    console.log(`✅ Updated ${userCount} users\n`);

    // Summary
    const totalUsers = await User.count();
    const roleDistribution = await sequelize.query(
      'SELECT role, COUNT(*) as count FROM users GROUP BY role ORDER BY count DESC',
      { type: sequelize.QueryTypes.SELECT }
    );

    console.log('🎉 User roles migration completed!\n');
    console.log('📋 Summary:');
    console.log(`   - Total users: ${totalUsers}`);
    console.log('   - Role distribution:');
    roleDistribution.forEach((r: any) => {
      console.log(`     • ${r.role}: ${r.count}`);
    });

  } catch (error) {
    console.error('❌ Migration error:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

migrateUserRoles();

