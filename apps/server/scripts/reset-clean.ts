/**
 * Reset Clean - Complete database reset
 * Keeps only SUPER_ADMIN users, removes all data
 */

import 'dotenv/config';
import sequelize from '../src/config/database';
import { User } from '../src/models';
import { Op } from 'sequelize';

async function main() {
  try {
    console.log('🧹 SmartFollow – puhastan kõik andmed, alles jääb ainult SUPER_ADMIN...\n');

    await sequelize.authenticate();
    console.log('✅ Database connection established\n');

    await sequelize.transaction(async (t) => {
      // 1️⃣ Truncate all tenant tables
      const tables = ['tasks', 'deals', 'contacts', 'companies', 'accounts'];
      
      for (const table of tables) {
        console.log(`   → Truncate ${table}`);
        await sequelize.query(`TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE;`, {
          transaction: t,
        });
      }

      // 2️⃣ Delete all non-SUPER_ADMIN users
      console.log('   → Kustutan kõik non-superadmin kasutajad');
      const deletedUsers = await User.destroy({
        where: {
          role: {
            [Op.ne]: 'SUPER_ADMIN',
          },
        },
        transaction: t,
      });
      console.log(`   ✓ Kustutatud ${deletedUsers} kasutajat`);

      // 3️⃣ Ensure SUPER_ADMINs have account_id = NULL
      console.log('   → Nullin SUPER_ADMIN account_id');
      const [updatedCount] = await User.update(
        { account_id: null },
        {
          where: { role: 'SUPER_ADMIN' },
          transaction: t,
        }
      );
      console.log(`   ✓ Uuendatud ${updatedCount} SUPER_ADMIN kasutajat`);
    });

    console.log('\n✅ Puhastus valmis!');
    console.log('\n📊 Tulemus:');
    console.log('   - Alles: Ainult SUPER_ADMIN kasutajad (account_id = NULL)');
    console.log('   - Kustutatud: Kõik accounts, companies, contacts, deals, tasks');
    console.log('   - Süsteem on valmis nullist alustamiseks!\n');

    const remainingUsers = await User.findAll({
      attributes: ['id', 'email', 'role', 'account_id'],
    });

    console.log('👥 Alles jäänud kasutajad:');
    remainingUsers.forEach(u => {
      console.log(`   - ${u.email} (${u.role}, account_id: ${u.account_id})`);
    });

  } catch (error) {
    console.error('\n❌ Reset ebaõnnestus:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// Run the reset
main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});

