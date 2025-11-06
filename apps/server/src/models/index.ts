import sequelize from '../config/database';
import Contact from './contactModel';
import Company from './companyModel';
import User from './userModel';

// Define model associations (relationships)
Company.hasMany(Contact, { foreignKey: 'company_id', as: 'contacts' });
Contact.belongsTo(Company, { foreignKey: 'company_id', as: 'company' });

// Export all models
export {
  sequelize,
  User,
  Company,
  Contact,
};

