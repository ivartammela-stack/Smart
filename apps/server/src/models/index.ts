// apps/server/src/models/index.ts

import sequelize from '../config/database';

import User from './userModel';
import Company from './companyModel';
import Contact from './contactModel';
import Deal from './dealModel';
import Task from './taskModel';

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

// Seosed: Company – Tasks
Company.hasMany(Task, {
  foreignKey: 'company_id',
  as: 'tasks',
});

Task.belongsTo(Company, {
  foreignKey: 'company_id',
  as: 'company',
});

// Seosed: Deal – Tasks
Deal.hasMany(Task, {
  foreignKey: 'deal_id',
  as: 'tasks',
});

Task.belongsTo(Deal, {
  foreignKey: 'deal_id',
  as: 'deal',
});

// Seosed: User – Tasks (assigned_to)
User.hasMany(Task, {
  foreignKey: 'assigned_to',
  as: 'assigned_tasks',
});

Task.belongsTo(User, {
  foreignKey: 'assigned_to',
  as: 'assignee',
});

// Kui tahad mugavus-eksporti:
export {
  sequelize,
  User,
  Company,
  Contact,
  Deal,
  Task,
};

