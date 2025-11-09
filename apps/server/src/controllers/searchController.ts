import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { Company, Contact, Deal, Task } from '../models';
import { Op } from 'sequelize';

export const globalSearch = async (req: AuthRequest, res: Response) => {
  try {
    const query = req.query.q as string;

    if (!query || query.trim().length < 2) {
      return res.json({
        success: true,
        results: [],
      });
    }

    const searchTerm = `%${query}%`;

    // Account filter
    const accountFilter: any = {};
    if (req.accountId) {
      accountFilter.account_id = req.accountId;
    }

    // Search companies
    const companies: any[] = await Company.findAll({
      where: {
        ...accountFilter,
        [Op.or]: [
          { name: { [Op.iLike]: searchTerm } },
          { registration_code: { [Op.iLike]: searchTerm } },
        ],
      } as any,
      limit: 5,
    });

    // Search contacts
    const contacts: any[] = await Contact.findAll({
      where: {
        ...accountFilter,
        [Op.or]: [
          { first_name: { [Op.iLike]: searchTerm } },
          { last_name: { [Op.iLike]: searchTerm } },
          { email: { [Op.iLike]: searchTerm } },
          { phone: { [Op.iLike]: searchTerm } },
        ],
      } as any,
      include: [{ model: Company, as: 'company', attributes: ['name'] }],
      limit: 5,
    });

    // Search deals
    const deals = await Deal.findAll({
      where: {
        ...accountFilter,
        title: { [Op.iLike]: searchTerm },
      },
      include: [{ model: Company, as: 'company', attributes: ['name'] }],
      limit: 5,
    });

    // Search tasks
    const tasks = await Task.findAll({
      where: {
        ...accountFilter,
        title: { [Op.iLike]: searchTerm },
      },
      limit: 5,
    });

    // Format results
    const results: any[] = [];

    companies.forEach((c) => {
      results.push({
        type: 'company',
        id: c.id,
        title: c.name,
        subtitle: c.registration_code || undefined,
      });
    });

    contacts.forEach((c: any) => {
      results.push({
        type: 'contact',
        id: c.id,
        title: `${c.first_name} ${c.last_name}`,
        subtitle: c.company?.name || c.email || undefined,
      });
    });

    deals.forEach((d: any) => {
      results.push({
        type: 'deal',
        id: d.id,
        title: d.title,
        subtitle: d.company?.name || `${d.value} €` || undefined,
      });
    });

    tasks.forEach((t) => {
      results.push({
        type: 'task',
        id: t.id,
        title: t.title,
        subtitle: t.due_date || undefined,
      });
    });

    res.json({
      success: true,
      results,
    });
  } catch (error: any) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Search failed',
    });
  }
};

