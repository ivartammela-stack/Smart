// apps/server/src/services/contactService.ts

import Contact from '../models/contactModel';
import { ContactCreationAttributes } from '../models/contactModel';

export interface ContactPayload {
  company_id: number;
  first_name: string;
  last_name: string;
  position?: string | null;
  phone?: string | null;
  email?: string | null;
  notes?: string | null;
}

export const getAllContacts = async (accountId?: number): Promise<Contact[]> => {
  const where: any = {};
  if (accountId) where.account_id = accountId;
  
  return Contact.findAll({
    where,
    order: [['created_at', 'DESC']],
  });
};

export const getContactById = async (id: number, accountId?: number): Promise<Contact | null> => {
  const where: any = { id };
  if (accountId) where.account_id = accountId;
  
  return Contact.findOne({ where });
};

export const getContactsByCompany = async (companyId: number, accountId?: number): Promise<Contact[]> => {
  const where: any = { company_id: companyId };
  if (accountId) where.account_id = accountId;
  
  return Contact.findAll({
    where,
    order: [['created_at', 'DESC']],
  });
};

export const createContact = async (
  payload: ContactPayload,
  accountId?: number
): Promise<Contact> => {
  const data: ContactCreationAttributes = {
    company_id: payload.company_id,
    first_name: payload.first_name,
    last_name: payload.last_name,
    position: payload.position ?? null,
    phone: payload.phone ?? null,
    email: payload.email ?? null,
    notes: payload.notes ?? null,
    account_id: accountId,
  };
  const contact = await Contact.create(data);
  return contact;
};

export const updateContact = async (
  id: number,
  payload: Partial<ContactPayload>,
  accountId?: number
): Promise<Contact | null> => {
  const where: any = { id };
  if (accountId) where.account_id = accountId;
  
  const contact = await Contact.findOne({ where });
  if (!contact) {
    return null;
  }
  await contact.update({
    // lubame osalise uuenduse
    company_id: payload.company_id ?? contact.company_id,
    first_name: payload.first_name ?? contact.first_name,
    last_name: payload.last_name ?? contact.last_name,
    position: payload.position ?? contact.position,
    phone: payload.phone ?? contact.phone,
    email: payload.email ?? contact.email,
    notes: payload.notes ?? contact.notes,
  });
  return contact;
};

export const deleteContact = async (id: number, accountId?: number): Promise<boolean> => {
  const where: any = { id };
  if (accountId) where.account_id = accountId;
  
  const deletedCount = await Contact.destroy({ where });
  return deletedCount > 0;
};

