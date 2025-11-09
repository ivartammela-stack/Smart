// apps/server/src/services/dealService.ts

import Deal from '../models/dealModel';
import { DealCreationAttributes } from '../models/dealModel';

export interface DealPayload {
  company_id: number;
  title: string;
  value: number;
  status?: string;
  notes?: string | null;
  created_by?: number | null;
}

export const getAllDeals = async (accountId?: number): Promise<Deal[]> => {
  const where: any = {};
  if (accountId) where.account_id = accountId;
  
  return Deal.findAll({
    where,
    order: [['created_at', 'DESC']],
  });
};

export const getDealById = async (id: number, accountId?: number): Promise<Deal | null> => {
  const where: any = { id };
  if (accountId) where.account_id = accountId;
  
  return Deal.findOne({ where });
};

export const getDealsByCompany = async (companyId: number, accountId?: number): Promise<Deal[]> => {
  const where: any = { company_id: companyId };
  if (accountId) where.account_id = accountId;
  
  return Deal.findAll({
    where,
    order: [['created_at', 'DESC']],
  });
};

export const createDeal = async (payload: DealPayload, accountId?: number): Promise<Deal> => {
  const data: DealCreationAttributes = {
    company_id: payload.company_id,
    title: payload.title,
    value: payload.value,
    status: payload.status ?? 'new',
    notes: payload.notes ?? null,
    created_by: payload.created_by ?? null,
    account_id: accountId,
  };

  const deal = await Deal.create(data);
  return deal;
};

export const updateDeal = async (
  id: number,
  payload: Partial<DealPayload>,
  accountId?: number
): Promise<Deal | null> => {
  const where: any = { id };
  if (accountId) where.account_id = accountId;
  
  const deal = await Deal.findOne({ where });
  if (!deal) {
    return null;
  }

  await deal.update({
    company_id: payload.company_id ?? deal.company_id,
    title: payload.title ?? deal.title,
    value: payload.value ?? deal.value,
    status: payload.status ?? deal.status,
    notes: payload.notes ?? deal.notes,
  });

  return deal;
};

export const deleteDeal = async (id: number, accountId?: number): Promise<boolean> => {
  const where: any = { id };
  if (accountId) where.account_id = accountId;
  
  const deletedCount = await Deal.destroy({ where });

  return deletedCount > 0;
};

