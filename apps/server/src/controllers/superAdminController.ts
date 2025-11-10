/**
 * Super Admin Controller
 * 
 * Endpoints for SUPER_ADMIN role to manage all accounts
 */

import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { Account } from '../models/accountModel';
import { User } from '../models/userModel';
import { resolveAccountStatus } from '../utils/accountStatus';
import sequelize from '../config/database';
import { Op } from 'sequelize';

interface SuperAdminCompanyItem {
  id: number;
  name: string;
  billing_plan: string;
  is_active: boolean;
  plan_locked: boolean;
  trial_ends_at: Date | null;
  grace_ends_at: Date | null;
  created_at: Date;
  users_count: number;
  owner_full_name: string | null;
  owner_email: string | null;
  status: 'TRIAL' | 'GRACE' | 'ACTIVE' | 'LOCKED';
}

interface SuperAdminCompaniesResponse {
  total_companies: number;
  total_users: number;
  avg_users_per_company: number;
  companies: SuperAdminCompanyItem[];
}

/**
 * GET /api/super-admin/companies
 * Get all accounts with statistics
 */
export const getCompanies = async (req: AuthRequest, res: Response) => {
  try {
    // Get all accounts with user count
    const accounts = await Account.findAll({
      attributes: [
        'id',
        'name',
        'billing_plan',
        'is_active',
        'plan_locked',
        'trial_ends_at',
        'grace_ends_at',
        'created_at',
      ],
      order: [['created_at', 'DESC']],
    });

    // Get user counts per account
    const userCounts = await User.findAll({
      attributes: [
        'account_id',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
      ],
      where: {
        account_id: { [Op.ne]: null },
      },
      group: ['account_id'],
      raw: true,
    }) as any[];

    const userCountMap = new Map<number, number>();
    userCounts.forEach((row: any) => {
      userCountMap.set(row.account_id, parseInt(row.count, 10) || 0);
    });

    // Get owners (first COMPANY_ADMIN or first user per account)
    const owners = await User.findAll({
      attributes: ['account_id', 'username', 'email', 'role'],
      where: {
        account_id: { [Op.ne]: null },
      },
      order: [
        ['account_id', 'ASC'],
        [sequelize.literal("CASE WHEN role = 'COMPANY_ADMIN' THEN 0 WHEN role = 'USER' THEN 1 ELSE 2 END"), 'ASC'],
        ['created_at', 'ASC'],
      ],
      raw: true,
    }) as any[];

    const ownerMap = new Map<number, { full_name: string; email: string }>();
    owners.forEach((user: any) => {
      if (!ownerMap.has(user.account_id)) {
        ownerMap.set(user.account_id, {
          full_name: user.username,
          email: user.email,
        });
      }
    });

    // Build companies array
    const companies: SuperAdminCompanyItem[] = accounts.map((account) => {
      const usersCount = userCountMap.get(account.id) || 0;
      const owner = ownerMap.get(account.id);
      const status = resolveAccountStatus(account);

      return {
        id: account.id,
        name: account.name,
        billing_plan: account.billing_plan,
        is_active: account.is_active,
        plan_locked: account.plan_locked,
        trial_ends_at: account.trial_ends_at ?? null,
        grace_ends_at: account.grace_ends_at ?? null,
        created_at: account.created_at,
        users_count: usersCount,
        owner_full_name: owner?.full_name || null,
        owner_email: owner?.email || null,
        status,
      };
    });

    // Calculate totals
    const totalCompanies = companies.length;
    const totalUsers = Array.from(userCountMap.values()).reduce((sum, count) => sum + count, 0);
    const avgUsersPerCompany = totalCompanies > 0 ? totalUsers / totalCompanies : 0;

    const response: SuperAdminCompaniesResponse = {
      total_companies: totalCompanies,
      total_users: totalUsers,
      avg_users_per_company: parseFloat(avgUsersPerCompany.toFixed(1)),
      companies,
    };

    res.json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error('Error fetching super admin companies:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch companies',
    });
  }
};

