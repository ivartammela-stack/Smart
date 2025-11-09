import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface AccountAttributes {
  id: number;
  name: string;
  is_active: boolean;
  billing_plan: 'TRIAL' | 'STARTER' | 'PRO' | 'ENTERPRISE';
  plan_locked: boolean;
  trial_ends_at?: Date | null;
  grace_ends_at?: Date | null;
  created_at?: Date;
  updated_at?: Date;
}

export type AccountCreationAttributes = Optional<AccountAttributes, 'id' | 'is_active' | 'billing_plan' | 'plan_locked' | 'trial_ends_at' | 'grace_ends_at' | 'created_at' | 'updated_at'>;

export class Account extends Model<AccountAttributes, AccountCreationAttributes>
  implements AccountAttributes {
  public id!: number;
  public name!: string;
  public is_active!: boolean;
  public billing_plan!: 'TRIAL' | 'STARTER' | 'PRO' | 'ENTERPRISE';
  public plan_locked!: boolean;
  public trial_ends_at?: Date | null;
  public grace_ends_at?: Date | null;
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
      defaultValue: 'TRIAL',
    },
    plan_locked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    trial_ends_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    grace_ends_at: {
      type: DataTypes.DATE,
      allowNull: true,
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

