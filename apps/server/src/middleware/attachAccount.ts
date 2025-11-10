/**
 * Middleware: Attach Account to Request
 * 
 * This middleware loads the user's account and attaches it to req.account
 * Must be used AFTER authMiddleware (which sets req.user)
 */

import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';
import { Account } from '../models/accountModel';

// Extend AuthRequest to include account
declare module './authMiddleware' {
  interface AuthRequest {
    account?: Account;
  }
}

/**
 * Middleware to attach account to request
 * Supports:
 * - COMPANY_ADMIN/USER: Uses req.user.account_id
 * - SUPER_ADMIN: Uses x-account-id header (account switcher)
 */
export async function attachAccount(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    let accountId: number | null = null;

    // Check for x-account-id header (SUPER_ADMIN account switcher)
    const headerAccountId = req.headers['x-account-id'];
    if (headerAccountId && req.user.role === 'SUPER_ADMIN') {
      const parsed = parseInt(String(headerAccountId), 10);
      if (!Number.isNaN(parsed)) {
        accountId = parsed;
      }
    }

    // Fallback to user's account_id (COMPANY_ADMIN/USER)
    if (accountId === null && req.user.account_id) {
      accountId = req.user.account_id;
    }

    // If no account context - return error
    if (accountId === null) {
      return res.status(400).json({
        success: false,
        code: 'ACCOUNT_REQUIRED',
        message: 'Account context required. Please select an account.',
      });
    }

    // Load account from database
    const account = await Account.findByPk(accountId);

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found',
      });
    }

    // Check if account is active
    if (!account.is_active) {
      return res.status(403).json({
        success: false,
        code: 'ACCOUNT_INACTIVE',
        message: 'This account is deactivated. Please contact support.',
      });
    }

    // Attach account to request
    req.account = account;

    next();
  } catch (error) {
    console.error('Error attaching account:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to load account information',
    });
  }
}

/**
 * Helper: Check trial/grace status
 */
export function getAccountStatus(account: Account): 'ACTIVE' | 'TRIAL' | 'GRACE' | 'LOCKED' {
  const now = new Date();

  // Locked accounts
  if (account.plan_locked) {
    return 'LOCKED';
  }

  // Paid plans are always active
  if (account.billing_plan !== 'TRIAL') {
    return 'ACTIVE';
  }

  // TRIAL plan - check dates
  if (account.trial_ends_at && now < account.trial_ends_at) {
    return 'TRIAL';
  }

  if (account.grace_ends_at && now < account.grace_ends_at) {
    return 'GRACE';
  }

  // Trial/grace expired but not locked yet
  return 'LOCKED';
}

