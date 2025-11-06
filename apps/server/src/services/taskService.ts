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

export const getAllTasks = async (): Promise<Task[]> => {
  return Task.findAll({
    order: [['due_date', 'ASC'], ['created_at', 'DESC']],
  });
};

export const getTaskById = async (id: number): Promise<Task | null> => {
  return Task.findByPk(id);
};

export const getTasksByCompany = async (companyId: number): Promise<Task[]> => {
  return Task.findAll({
    where: { company_id: companyId },
    order: [['due_date', 'ASC']],
  });
};

export const getTasksByDeal = async (dealId: number): Promise<Task[]> => {
  return Task.findAll({
    where: { deal_id: dealId },
    order: [['due_date', 'ASC']],
  });
};

// "Täna" vaade - tasks due today
export const getTodayTasks = async (): Promise<Task[]> => {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD

  return Task.findAll({
    where: {
      due_date: todayStr,
      completed: false,
    },
    order: [['created_at', 'ASC']],
  });
};

export const createTask = async (payload: TaskPayload): Promise<Task> => {
  const data: TaskCreationAttributes = {
    company_id: payload.company_id ?? null,
    deal_id: payload.deal_id ?? null,
    title: payload.title,
    description: payload.description ?? null,
    due_date: payload.due_date ? new Date(payload.due_date) : null,
    completed: payload.completed ?? false,
    assigned_to: payload.assigned_to ?? null,
  };

  const task = await Task.create(data);
  return task;
};

export const updateTask = async (
  id: number,
  payload: Partial<TaskPayload>
): Promise<Task | null> => {
  const task = await Task.findByPk(id);
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

export const deleteTask = async (id: number): Promise<boolean> => {
  const deletedCount = await Task.destroy({
    where: { id },
  });

  return deletedCount > 0;
};

