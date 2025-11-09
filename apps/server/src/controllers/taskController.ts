// apps/server/src/controllers/taskController.ts

import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import * as taskService from '../services/taskService';

export const getAllTasks = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tasks = await taskService.getAllTasks(req.accountId);
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid task id' });
    }

    const task = await taskService.getTaskById(id, req.accountId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const getTasksByCompany = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const companyId = Number(req.params.companyId);
    if (Number.isNaN(companyId)) {
      return res.status(400).json({ message: 'Invalid company id' });
    }

    const tasks = await taskService.getTasksByCompany(companyId, req.accountId);
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

export const getTasksByDeal = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const dealId = Number(req.params.dealId);
    if (Number.isNaN(dealId)) {
      return res.status(400).json({ message: 'Invalid deal id' });
    }

    const tasks = await taskService.getTasksByDeal(dealId, req.accountId);
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

// "Täna" vaade
export const getTodayTasks = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const tasks = await taskService.getTodayTasks(req.accountId);
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const {
      company_id,
      deal_id,
      title,
      description,
      due_date,
      completed,
      assigned_to,
    } = req.body;

    if (!title) {
      return res.status(400).json({
        message: 'title is required',
      });
    }

    const task = await taskService.createTask({
      company_id: company_id ? Number(company_id) : null,
      deal_id: deal_id ? Number(deal_id) : null,
      title,
      description,
      due_date,
      completed,
      assigned_to: assigned_to ? Number(assigned_to) : null,
    }, req.accountId);

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid task id' });
    }

    const {
      company_id,
      deal_id,
      title,
      description,
      due_date,
      completed,
      assigned_to,
    } = req.body;

    const task = await taskService.updateTask(id, {
      company_id: company_id !== undefined ? (company_id ? Number(company_id) : null) : undefined,
      deal_id: deal_id !== undefined ? (deal_id ? Number(deal_id) : null) : undefined,
      title,
      description,
      due_date,
      completed,
      assigned_to: assigned_to !== undefined ? (assigned_to ? Number(assigned_to) : null) : undefined,
    }, req.accountId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid task id' });
    }

    const success = await taskService.deleteTask(id, req.accountId);
    if (!success) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

