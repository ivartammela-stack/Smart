// Utility to check plan limits
import { PLANS } from '../config/plans';
import { UserPlan } from '../models/userModel';

interface LimitInfo {
  ok: boolean;
  max: number;
  current: number;
}

export function checkPlanLimit(
  planId: UserPlan,
  type: 'users' | 'companies' | 'deals',
  currentCount: number
): LimitInfo {
  const plan = PLANS[planId];
  let max = 0;

  switch (type) {
    case 'users':
      max = plan.maxUsers;
      break;
    case 'companies':
      max = plan.maxCompanies;
      break;
    case 'deals':
      max = plan.maxDeals;
      break;
  }

  return {
    ok: currentCount < max,
    max,
    current: currentCount
  };
}

