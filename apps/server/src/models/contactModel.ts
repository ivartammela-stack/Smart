import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface ContactAttributes {
  id: number;
  company_id: number;
  first_name: string;
  last_name: string;
  position?: string | null;
  phone?: string | null;
  email?: string | null;
  notes?: string | null;
  account_id?: number;
  created_at?: Date;
  updated_at?: Date;
}

export type ContactCreationAttributes = Optional<
  ContactAttributes,
  | 'id'
  | 'position'
  | 'phone'
  | 'email'
  | 'notes'
  | 'created_at'
  | 'updated_at'
>;

export class Contact
  extends Model<ContactAttributes, ContactCreationAttributes>
  implements ContactAttributes
{
  public id!: number;
  public company_id!: number;
  public first_name!: string;
  public last_name!: string;
  public position!: string | null;
  public phone!: string | null;
  public email!: string | null;
  public notes!: string | null;
  public account_id?: number;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

// Initialize Contact model
Contact.init(
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
        model: 'companies', // tabeli nimi DB-s
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    position: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    account_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'accounts',
        key: 'id',
      },
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
    tableName: 'contacts',
    modelName: 'Contact',
    underscored: true, // et vältida createdAt/updatedAt probleemi
    timestamps: true,
  }
);

export default Contact;

