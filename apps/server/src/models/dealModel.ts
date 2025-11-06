// apps/server/src/models/dealModel.ts

import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface DealAttributes {
  id: number;
  company_id: number;
  title: string;
  value: number;  // DB uses 'value', not 'amount'
  status: string; // DB uses VARCHAR, not ENUM
  notes?: string | null;
  created_by?: number | null;
  created_at?: Date;
  updated_at?: Date;
}

export type DealCreationAttributes = Optional<
  DealAttributes,
  | 'id'
  | 'status'
  | 'notes'
  | 'created_by'
  | 'created_at'
  | 'updated_at'
>;

export class Deal
  extends Model<DealAttributes, DealCreationAttributes>
  implements DealAttributes
{
  public id!: number;
  public company_id!: number;
  public title!: string;
  public value!: number;
  public status!: string;
  public notes!: string | null;
  public created_by!: number | null;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

// Initialize Deal model
Deal.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'companies',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    value: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: 'new',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.INTEGER,
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
    tableName: 'deals',
    modelName: 'Deal',
    underscored: true,
    timestamps: true,
  }
);

export default Deal;

