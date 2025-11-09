// apps/server/src/services/taskService.ts

import Task from '../models/taskModel';
import { TaskCreationAttributes } from '../models/taskModel';

export interface TaskPayload {
  company_id?: number | null;
  deal_id?: number | null;
  title: string;
  description?: string | null;
  due_date?: string | null;
  completed?: boolean;
  assigned_to?: number | null;
}

export const getAllTasks = async (accountId?: number): Promise<Task[]> => {
  const where: any = {};
  if (accountId) where.account_id = accountId;
  
  return Task.findAll({
    where,
    order: [['due_date', 'ASC'], ['created_at', 'DESC']],
  });
};

export const getTaskById = async (id: number, accountId?: number): Promise<Task | null> => {
  const where: any = { id };
  if (accountId) where.account_id = accountId;
  
  return Task.findOne({ where });
};

export const getTasksByCompany = async (companyId: number, accountId?: number): Promise<Task[]> => {
  const where: any = { company_id: companyId };
  if (accountId) where.account_id = accountId;
  
  return Task.findAll({
    where,
    order: [['due_date', 'ASC']],
  });
};

export const getTasksByDeal = async (dealId: number, accountId?: number): Promise<Task[]> => {
  const where: any = { deal_id: dealId };
  if (accountId) where.account_id = accountId;
  
  return Task.findAll({
    where,
    order: [['due_date', 'ASC']],
  });
};

// "Täna" vaade - tasks due today (both completed and pending)
export const getTodayTasks = async (accountId?: number): Promise<Task[]> => {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD

  const where: any = { due_date: todayStr };
  if (accountId) where.account_id = accountId;

  return Task.findAll({
    where,
    order: [['completed', 'ASC'], ['created_at', 'ASC']], // pending first, then completed
  });
};

export const createTask = async (payload: TaskPayload, accountId?: number): Promise<Task> => {
  const data: TaskCreationAttributes = {
    company_id: payload.company_id ?? null,
    deal_id: payload.deal_id ?? null,
    title: payload.title,
    description: payload.description ?? null,
    due_date: payload.due_date ? new Date(payload.due_date) : null,
    completed: payload.completed ?? false,
    assigned_to: payload.assigned_to ?? null,
    account_id: accountId,
  };

  const task = await Task.create(data);
  return task;
};

export const updateTask = async (
  id: number,
  payload: Partial<TaskPayload>,
  accountId?: number
): Promise<Task | null> => {
  const where: any = { id };
  if (accountId) where.account_id = accountId;
  
  const task = await Task.findOne({ where });
  if (!task) {
    return null;
  }

  await task.update({
    company_id: payload.company_id !== undefined ? payload.company_id : task.company_id,
    deal_id: payload.deal_id !== undefined ? payload.deal_id : task.deal_id,
    title: payload.title ?? task.title,
    description: payload.description !== undefined ? payload.description : task.description,
    due_date: payload.due_date !== undefined
      ? payload.due_date ? new Date(payload.due_date) : null
      : task.due_date,
    completed: payload.completed !== undefined ? payload.completed : task.completed,
    assigned_to: payload.assigned_to !== undefined ? payload.assigned_to : task.assigned_to,
  });

  return task;
};

export const deleteTask = async (id: number, accountId?: number): Promise<boolean> => {
  const where: any = { id };
  if (accountId) where.account_id = accountId;
  
  const deletedCount = await Task.destroy({ where });

  return deletedCount > 0;
};
