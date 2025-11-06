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

export const getAllDeals = async (): Promise<Deal[]> => {
  return Deal.findAll({
    order: [['created_at', 'DESC']],
  });
};

export const getDealById = async (id: number): Promise<Deal | null> => {
  return Deal.findByPk(id);
};

export const getDealsByCompany = async (companyId: number): Promise<Deal[]> => {
  return Deal.findAll({
    where: { company_id: companyId },
    order: [['created_at', 'DESC']],
  });
};

export const createDeal = async (payload: DealPayload): Promise<Deal> => {
  const data: DealCreationAttributes = {
    company_id: payload.company_id,
    title: payload.title,
    value: payload.value,
    status: payload.status ?? 'new',
    notes: payload.notes ?? null,
    created_by: payload.created_by ?? null,
  };

  const deal = await Deal.create(data);
  return deal;
};

export const updateDeal = async (
  id: number,
  payload: Partial<DealPayload>
): Promise<Deal | null> => {
  const deal = await Deal.findByPk(id);
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

export const deleteDeal = async (id: number): Promise<boolean> => {
  const deletedCount = await Deal.destroy({
    where: { id },
  });

  return deletedCount > 0;
};

