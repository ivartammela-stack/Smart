/**
 * Middleware: Plan Guards
 * 
 * Middlewares to enforce plan limits and feature access
 */

import { Response, NextFunction } from 'express';
import { AuthRequest } from './authMiddleware';
import { PlanId, PlanFeatures, PLANS, comparePlans, getMinPlanForFeature } from '../config/plans';
import { getAccountStatus } from './attachAccount';
import { User, Company, Deal } from '../models';

/**
 * Require minimum plan level
 * Usage: router.post('/endpoint', requireMinPlan('PRO'), handler)
 */
export function requireMinPlan(minPlan: PlanId) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const account = req.account;

    if (!account) {
      return res.status(401).json({
        success: false,
        message: 'Account not found',
      });
    }

    // Check if account is locked
    if (account.plan_locked) {
      return res.status(402).json({
        success: false,
        code: 'PLAN_LOCKED',
        message: 'Your account is locked. Please upgrade your plan.',
      });
    }

    // Check plan level
    const currentPlan = account.billing_plan as PlanId;
    
    if (comparePlans(currentPlan, minPlan) < 0) {
      return res.status(403).json({
        success: false,
        code: 'INSUFFICIENT_PLAN',
        message: `This feature requires ${minPlan} plan or higher`,
        currentPlan,
        requiredPlan: minPlan,
      });
    }

    next();
  };
}

/**
 * Require specific feature
 * Usage: router.get('/reports', requireFeature('reports'), handler)
 */
export function requireFeature(feature: keyof PlanFeatures) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const account = req.account;

    if (!account) {
      return res.status(401).json({
        success: false,
        message: 'Account not found',
      });
    }

    // Check if account is locked
    if (account.plan_locked) {
      return res.status(402).json({
        success: false,
        code: 'PLAN_LOCKED',
        message: 'Your account is locked. Please upgrade your plan.',
      });
    }

    // Check if feature is available in current plan
    const currentPlan = account.billing_plan as PlanId;
    const planConfig = PLANS[currentPlan];

    if (!planConfig.features[feature]) {
      const minPlan = getMinPlanForFeature(feature);

      return res.status(403).json({
        success: false,
        code: 'FEATURE_NOT_AVAILABLE',
        message: `Feature '${feature}' is not available in your current plan`,
        feature,
        currentPlan,
        requiredPlan: minPlan,
      });
    }

    next();
  };
}

/**
 * Check entity limit before creation
 * Usage: router.post('/companies', checkLimit('companies'), handler)
 */
type LimitEntity = 'users' | 'companies' | 'deals';

export function checkLimit(entity: LimitEntity) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const account = req.account;

      if (!account) {
        return res.status(401).json({
          success: false,
          message: 'Account not found',
        });
      }

      // Get plan limits
      const currentPlan = account.billing_plan as PlanId;
      const planConfig = PLANS[currentPlan];
      
      let maxLimit: number | null = null;
      let currentCount = 0;

      // Get limit and count based on entity type
      switch (entity) {
        case 'users':
          maxLimit = planConfig.limits.maxUsers;
          currentCount = await User.count({ where: { account_id: account.id } });
          break;

        case 'companies':
          maxLimit = planConfig.limits.maxCompanies;
          currentCount = await Company.count({ where: { account_id: account.id } });
          break;

        case 'deals':
          maxLimit = planConfig.limits.maxDeals;
          currentCount = await Deal.count({ where: { account_id: account.id } });
          break;
      }

      // If limit is null, it's unlimited
      if (maxLimit === null) {
        return next();
      }

      // Check if limit is reached
      if (currentCount >= maxLimit) {
        return res.status(403).json({
          success: false,
          code: 'LIMIT_REACHED',
          message: `You have reached the maximum number of ${entity} for your plan (${maxLimit})`,
          entity,
          limit: maxLimit,
          current: currentCount,
        });
      }

      next();
    } catch (error) {
      console.error('Error checking limit:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to check limit',
      });
    }
  };
}

/**
 * Block requests if account is in GRACE or LOCKED state
 * Usage: router.post('/companies', requireActiveAccount(), handler)
 */
export function requireActiveAccount() {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const account = req.account;

    if (!account) {
      return res.status(401).json({
        success: false,
        message: 'Account not found',
      });
    }

    const status = getAccountStatus(account);

    // Allow ACTIVE and TRIAL
    if (status === 'ACTIVE' || status === 'TRIAL') {
      return next();
    }

    // Block GRACE and LOCKED
    if (status === 'GRACE') {
      return res.status(402).json({
        success: false,
        code: 'ACCOUNT_IN_GRACE_PERIOD',
        message: 'Your trial has ended. Please upgrade to continue using SmartFollow.',
        trial_ends_at: account.trial_ends_at,
        grace_ends_at: account.grace_ends_at,
      });
    }

    if (status === 'LOCKED') {
      return res.status(402).json({
        success: false,
        code: 'ACCOUNT_LOCKED',
        message: 'Your account is locked. Please upgrade your plan.',
        grace_ends_at: account.grace_ends_at,
      });
    }

    next();
  };
}

