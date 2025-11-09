// apps/server/src/controllers/contactController.ts

import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import * as contactService from '../services/contactService';

export const getAllContacts = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const contacts = await contactService.getAllContacts(req.accountId);
    res.json(contacts);
  } catch (error) {
    next(error);
  }
};

export const getContactById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid contact id' });
    }
    const contact = await contactService.getContactById(id, req.accountId);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json(contact);
  } catch (error) {
    next(error);
  }
};

export const getContactsByCompany = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const companyId = Number(req.params.companyId);
    if (Number.isNaN(companyId)) {
      return res.status(400).json({ message: 'Invalid company id' });
    }
    const contacts = await contactService.getContactsByCompany(companyId, req.accountId);
    res.json(contacts);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { company_id, first_name, last_name, position, phone, email, notes } = req.body;
    if (!company_id || !first_name || !last_name) {
      return res.status(400).json({
        message: 'company_id, first_name and last_name are required',
      });
    }
    const contact = await contactService.createContact({
      company_id: Number(company_id),
      first_name,
      last_name,
      position,
      phone,
      email,
      notes,
    }, req.accountId);
    res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid contact id' });
    }
    const { company_id, first_name, last_name, position, phone, email, notes } = req.body;
    const contact = await contactService.updateContact(id, {
      company_id: company_id ? Number(company_id) : undefined,
      first_name,
      last_name,
      position,
      phone,
      email,
      notes,
    }, req.accountId);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid contact id' });
    }
    const success = await contactService.deleteContact(id, req.accountId);
    if (!success) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

