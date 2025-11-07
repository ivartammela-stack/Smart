import { Request, Response } from 'express';
import { Company, Contact, Deal, Task } from '../models';
import { Op } from 'sequelize';

export const getSummary = async (req: Request, res: Response) => {
  try {
    // Deals by status
    const dealsByStatus = await Deal.findAll({
      attributes: [
        'status',
        [Deal.sequelize!.fn('COUNT', Deal.sequelize!.col('id')), 'count'],
        [Deal.sequelize!.fn('SUM', Deal.sequelize!.col('value')), 'total_value'],
      ],
      group: ['status'],
    });

    // Tasks completion - last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const totalTasks = await Task.count({
      where: {
        created_at: {
          [Op.gte]: sevenDaysAgo,
        },
      },
    });

    const completedTasks = await Task.count({
      where: {
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
      where: { due_date: today },
    });

    const todayTasksCompleted = await Task.count({
      where: { due_date: today, completed: true },
    });

    // Total counts
    const totalCompanies = await Company.count();
    const totalContacts = await Contact.count();
    const totalDeals = await Deal.count();

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

