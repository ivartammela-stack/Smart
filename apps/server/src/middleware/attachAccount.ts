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
 * Requires: req.user with account_id
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

    // Check if user has account_id
    if (!req.user.account_id) {
      return res.status(403).json({
        success: false,
        message: 'User has no associated account',
      });
    }

    // Load account from database
    const account = await Account.findByPk(req.user.account_id);

    if (!account) {
      return res.status(404).json({
        success: false,
        message: 'Account not found',
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

