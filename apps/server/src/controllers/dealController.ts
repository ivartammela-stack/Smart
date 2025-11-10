// apps/server/src/controllers/dealController.ts

import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import * as dealService from '../services/dealService';

export const getAllDeals = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const deals = await dealService.getAllDeals(req.accountId);
    res.json(deals);
  } catch (error) {
    next(error);
  }
};

export const getDealById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid deal id' });
    }

    const deal = await dealService.getDealById(id, req.accountId);
    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    res.json(deal);
  } catch (error) {
    next(error);
  }
};

export const getDealsByCompany = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const companyId = Number(req.params.companyId);
    if (Number.isNaN(companyId)) {
      return res.status(400).json({ message: 'Invalid company id' });
    }

    const deals = await dealService.getDealsByCompany(companyId, req.accountId);
    res.json(deals);
  } catch (error) {
    next(error);
  }
};

export const createDeal = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const {
      company_id,
      title,
      value,
      status,
      notes,
    } = req.body;

    if (!company_id || !title || value === undefined) {
      return res.status(400).json({
        message: 'company_id, title and value are required',
      });
    }

    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) {
      return res.status(400).json({ message: 'value must be a number' });
    }

    const deal = await dealService.createDeal({
      company_id: Number(company_id),
      title,
      value: numericValue,
      status,
      notes,
    }, req.accountId);

    res.status(201).json(deal);
  } catch (error) {
    next(error);
  }
};

export const updateDeal = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid deal id' });
    }

    const {
      company_id,
      title,
      value,
      status,
      notes,
    } = req.body;

    const numericValue =
      value !== undefined && value !== null ? Number(value) : undefined;
    if (value !== undefined && Number.isNaN(Number(value))) {
      return res.status(400).json({ message: 'value must be a number' });
    }

    const deal = await dealService.updateDeal(id, {
      company_id: company_id ? Number(company_id) : undefined,
      title,
      value: numericValue,
      status,
      notes,
    }, req.accountId);

    if (!deal) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    res.json(deal);
  } catch (error) {
    next(error);
  }
};

export const deleteDeal = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid deal id' });
    }

    const success = await dealService.deleteDeal(id, req.accountId);
    if (!success) {
      return res.status(404).json({ message: 'Deal not found' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

