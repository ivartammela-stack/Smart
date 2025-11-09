/**
 * Helper utility for multi-tenant account filtering
 */

import { AuthRequest } from '../middleware/authMiddleware';

/**
 * Get the WHERE clause for filtering by account
 * Returns account_id filter or empty object for system admin viewing all
 */
export const getAccountFilter = (req: AuthRequest): { account_id?: number } | object => {
  // If accountId is set (either from user or admin override), use it
  if (req.accountId) {
    return { account_id: req.accountId };
  }
  
  // System admin without specific account selection sees all
  if (req.user?.role === 'system_admin' && !req.accountId) {
    return {}; // No filter - see all accounts
  }
  
  // Regular users must have account_id
  return req.user?.account_id ? { account_id: req.user.account_id } : {};
};

/**
 * Set account_id on new records
 */
export const setAccountId = (req: AuthRequest): number | undefined => {
  return req.accountId || req.user?.account_id;
};

