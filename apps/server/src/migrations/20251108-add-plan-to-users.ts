// Migration: Add plan column to users table
import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.addColumn('users', 'plan', {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'FREE'
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.removeColumn('users', 'plan');
  }
};

