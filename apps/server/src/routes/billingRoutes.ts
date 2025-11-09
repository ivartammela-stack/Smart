/**
 * Billing Routes
 * 
 * Endpoints for plan management and billing
 */

import { Router } from 'express';
import { AuthRequest, authenticateJWT } from '../middleware/authMiddleware';
import { attachAccount, getAccountStatus } from '../middleware/attachAccount';
import { PLANS, getPaidPlans, PlanId } from '../config/plans';
import { Account } from '../models/accountModel';

const router = Router();

// Apply auth middleware to all routes
router.use(authenticateJWT);
router.use(attachAccount);

/**
 * GET /api/billing/current
 * Get current plan and subscription status
 */
router.get('/current', async (req: AuthRequest, res) => {
  try {
    const account = req.account!;
    const status = getAccountStatus(account);
    const planConfig = PLANS[account.billing_plan as PlanId];

    res.json({
      success: true,
      data: {
        plan: account.billing_plan,
        planName: planConfig.nameEE,
        planLocked: account.plan_locked,
        status,
        trialEndsAt: account.trial_ends_at,
        graceEndsAt: account.grace_ends_at,
        limits: planConfig.limits,
        features: planConfig.features,
      },
    });
  } catch (error) {
    console.error('Error fetching current plan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch current plan',
    });
  }
});

/**
 * GET /api/billing/plans
 * Get all available plans (for pricing page)
 */
router.get('/plans', (req: AuthRequest, res) => {
  try {
    const paidPlans = getPaidPlans();

    res.json({
      success: true,
      data: paidPlans.map((plan) => ({
        id: plan.id,
        name: plan.name,
        nameEE: plan.nameEE,
        pricePerMonth: plan.pricePerMonth,
        description: plan.description,
        descriptionEE: plan.descriptionEE,
        limits: plan.limits,
        features: plan.features,
      })),
    });
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch plans',
    });
  }
});

/**
 * POST /api/billing/upgrade
 * Upgrade/change plan
 */
router.post('/upgrade', async (req: AuthRequest, res) => {
  try {
    const account = req.account!;
    const { planId } = req.body as { planId: PlanId };

    // Validate plan ID
    if (!planId || !PLANS[planId]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan ID',
      });
    }

    // Can't "upgrade" to TRIAL
    if (planId === 'TRIAL') {
      return res.status(400).json({
        success: false,
        message: 'Cannot switch to TRIAL plan',
      });
    }

    // Update account
    await account.update({
      billing_plan: planId,
      plan_locked: false,
      trial_ends_at: null,
      grace_ends_at: null,
    });

    const newPlanConfig = PLANS[planId];

    res.json({
      success: true,
      message: `Successfully upgraded to ${newPlanConfig.nameEE}`,
      data: {
        plan: planId,
        planName: newPlanConfig.nameEE,
        limits: newPlanConfig.limits,
        features: newPlanConfig.features,
      },
    });
  } catch (error) {
    console.error('Error upgrading plan:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upgrade plan',
    });
  }
});

/**
 * GET /api/billing/status
 * Get detailed account status (for admin/debugging)
 */
router.get('/status', async (req: AuthRequest, res) => {
  try {
    const account = req.account!;
    const status = getAccountStatus(account);
    const now = new Date();

    const trialDaysLeft = account.trial_ends_at 
      ? Math.ceil((account.trial_ends_at.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      : null;

    const graceDaysLeft = account.grace_ends_at
      ? Math.ceil((account.grace_ends_at.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      : null;

    res.json({
      success: true,
      data: {
        accountId: account.id,
        accountName: account.name,
        plan: account.billing_plan,
        status,
        locked: account.plan_locked,
        trialEndsAt: account.trial_ends_at,
        graceEndsAt: account.grace_ends_at,
        trialDaysLeft,
        graceDaysLeft,
      },
    });
  } catch (error) {
    console.error('Error fetching account status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch account status',
    });
  }
});

export default router;

