import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { Company, Contact, Deal, Task } from '../models';
import { Op } from 'sequelize';

export const getSummary = async (req: AuthRequest, res: Response) => {
  try {
    // Account filter
    const accountFilter: any = {};
    if (req.accountId) {
      accountFilter.account_id = req.accountId;
    }

    // Deals by status
    const dealsByStatus = await Deal.findAll({
      attributes: [
        'status',
        [Deal.sequelize!.fn('COUNT', Deal.sequelize!.col('id')), 'count'],
        [Deal.sequelize!.fn('SUM', Deal.sequelize!.col('value')), 'total_value'],
      ],
      where: accountFilter,
      group: ['status'],
    });

    // Tasks completion - last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const totalTasks = await Task.count({
      where: {
        ...accountFilter,
        created_at: {
          [Op.gte]: sevenDaysAgo,
        },
      },
    });

    const completedTasks = await Task.count({
      where: {
        ...accountFilter,
        completed: true,
        created_at: {
          [Op.gte]: sevenDaysAgo,
        },
      },
    });

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Today's tasks
    const today = new Date().toISOString().split('T')[0];
    const todayTasksTotal = await Task.count({
      where: { ...accountFilter, due_date: today },
    });

    const todayTasksCompleted = await Task.count({
      where: { ...accountFilter, due_date: today, completed: true },
    });

    // Total counts
    const totalCompanies = await Company.count({ where: accountFilter });
    const totalContacts = await Contact.count({ where: accountFilter });
    const totalDeals = await Deal.count({ where: accountFilter });

    res.json({
      success: true,
      data: {
        deals_by_status: dealsByStatus,
        tasks: {
          last_7_days: {
            total: totalTasks,
            completed: completedTasks,
            completion_rate: completionRate,
          },
          today: {
            total: todayTasksTotal,
            completed: todayTasksCompleted,
          },
        },
        totals: {
          companies: totalCompanies,
          contacts: totalContacts,
          deals: totalDeals,
        },
      },
    });
  } catch (error: any) {
    console.error('Error fetching summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch summary',
    });
  }
};

