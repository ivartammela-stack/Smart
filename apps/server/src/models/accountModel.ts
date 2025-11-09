import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface AccountAttributes {
  id: number;
  name: string;
  is_active: boolean;
  billing_plan: 'FREE' | 'STARTER' | 'PRO' | 'ENTERPRISE';
  created_at?: Date;
  updated_at?: Date;
}

export type AccountCreationAttributes = Optional<AccountAttributes, 'id' | 'is_active' | 'billing_plan' | 'created_at' | 'updated_at'>;

export class Account extends Model<AccountAttributes, AccountCreationAttributes>
  implements AccountAttributes {
  public id!: number;
  public name!: string;
  public is_active!: boolean;
  public billing_plan!: 'FREE' | 'STARTER' | 'PRO' | 'ENTERPRISE';
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

Account.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    billing_plan: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'FREE',
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'accounts',
    timestamps: true,
    underscored: true,
  }
);

export default Account;

