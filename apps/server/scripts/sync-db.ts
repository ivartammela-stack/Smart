import sequelize from '../src/config/database';
import '../src/models'; // Import all models to register associations

async function syncDatabase() {
  try {
    console.log('🔄 Syncing database schema with models...');
    
    // alter: true will add missing columns without dropping existing data
    await sequelize.sync({ alter: true });
    
    console.log('✅ Database schema synced successfully!');
    console.log('📝 Added/updated columns to match model definitions');
    
  } catch (error) {
    console.error('❌ Error syncing database:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
}

syncDatabase();

