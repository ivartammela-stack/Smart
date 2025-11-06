// apps/server/src/models/index.ts

import sequelize from '../config/database';

import User from './userModel';
import Company from './companyModel';
import Contact from './contactModel';
import Deal from './dealModel';

// Seosed: Company – Contacts
Company.hasMany(Contact, {
  foreignKey: 'company_id',
  as: 'contacts',
});

Contact.belongsTo(Company, {
  foreignKey: 'company_id',
  as: 'company',
});

// Seosed: Company – Deals
Company.hasMany(Deal, {
  foreignKey: 'company_id',
  as: 'deals',
});

Deal.belongsTo(Company, {
  foreignKey: 'company_id',
  as: 'company',
});

// Kui tahad mugavus-eksporti:
export {
  sequelize,
  User,
  Company,
  Contact,
  Deal,
};

