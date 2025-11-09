/**
 * Account Status Helper
 * 
 * Determines account subscription status based on dates and flags
 */

import { Account } from '../models/accountModel';

export type AccountStatus = 'TRIAL' | 'GRACE' | 'ACTIVE' | 'LOCKED';

/**
 * Resolve account status
 */
export function resolveAccountStatus(account: Account): AccountStatus {
  const now = new Date();

  // Check trial period
  if (account.trial_ends_at && now <= account.trial_ends_at) {
    return 'TRIAL';
  }

  // Check grace period
  if (account.grace_ends_at && now <= account.grace_ends_at) {
    return 'GRACE';
  }

  // Check if locked
  if (account.plan_locked) {
    return 'LOCKED';
  }

  // Check if active
  if (account.is_active) {
    return 'ACTIVE';
  }

  // Default to locked
  return 'LOCKED';
}

/**
 * Format status for display (Estonian)
 */
export function formatStatusEE(status: AccountStatus): string {
  switch (status) {
    case 'TRIAL':
      return 'Prooviaeg';
    case 'GRACE':
      return 'Lisaaeg';
    case 'ACTIVE':
      return 'Aktiivne';
    case 'LOCKED':
      return 'Lukus';
  }
}

