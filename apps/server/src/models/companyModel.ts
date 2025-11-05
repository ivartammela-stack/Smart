import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

interface CompanyAttributes {
  id: number;
  name: string;
  registration_code: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  created_by?: number;
}

interface CompanyCreationAttributes extends Optional<CompanyAttributes, 'id'> {}

export class Company extends Model<CompanyAttributes, CompanyCreationAttributes>
  implements CompanyAttributes {
  public id!: number;
  public name!: string;
  public registration_code!: string;
  public phone?: string;
  public email?: string;
  public address?: string;
  public notes?: string;
  public created_by?: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Company.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    registration_code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    address: DataTypes.STRING,
    notes: DataTypes.TEXT,
    created_by: DataTypes.INTEGER,
  },
  {
    sequelize,
    tableName: 'companies',
    timestamps: true,
    underscored: true, // Use snake_case for all fields
  }
);

export default Company;

