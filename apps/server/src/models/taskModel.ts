import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface TaskAttributes {
  id: number;
  company_id: number | null;
  deal_id: number | null;
  title: string;
  description: string | null;
  due_date: Date | null;
  completed: boolean;
  assigned_to: number | null;
  created_at?: Date;
  updated_at?: Date;
}

export type TaskCreationAttributes = Optional<
  TaskAttributes,
  | 'id'
  | 'company_id'
  | 'deal_id'
  | 'description'
  | 'due_date'
  | 'completed'
  | 'assigned_to'
  | 'created_at'
  | 'updated_at'
>;

export class Task
  extends Model<TaskAttributes, TaskCreationAttributes>
  implements TaskAttributes
{
  public id!: number;
  public company_id!: number | null;
  public deal_id!: number | null;
  public title!: string;
  public description!: string | null;
  public due_date!: Date | null;
  public completed!: boolean;
  public assigned_to!: number | null;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

// Initialize Task model
Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    company_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'companies',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    deal_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'deals',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    due_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    assigned_to: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
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
    tableName: 'tasks',
    modelName: 'Task',
    underscored: true,
    timestamps: true,
  }
);

export default Task;

