import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export type UserPlan = 'FREE' | 'STARTER' | 'PRO' | 'ENTERPRISE';

export class User extends Model {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public role!: string;
  public plan!: UserPlan;
  public account_id!: number;
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
      type: DataTypes.STRING,
      defaultValue: 'user',
    },
    plan: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'FREE',
    },
    account_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Temporarily nullable for migration
      references: {
        model: 'accounts',
        key: 'id',
      },
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