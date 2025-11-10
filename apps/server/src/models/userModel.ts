import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export type UserPlan = 'TRIAL' | 'STARTER' | 'PRO' | 'ENTERPRISE';
export type UserRole = 'SUPER_ADMIN' | 'COMPANY_ADMIN' | 'USER';

export class User extends Model {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public role!: UserRole;
  public plan!: UserPlan;
  public account_id!: number | null; // SUPER_ADMIN can have null
  public is_active!: boolean;
  public last_login_at!: Date | null;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'USER',
    },
    plan: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'TRIAL',
    },
    account_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // SUPER_ADMIN can have null account_id
      references: {
        model: 'accounts',
        key: 'id',
      },
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    last_login_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default User;