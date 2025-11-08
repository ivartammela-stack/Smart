// Middleware to check if user's plan includes a specific feature
import { Request, Response, NextFunction } from 'express';
import { PLANS } from '../config/plans';
import { UserPlan } from '../models/userModel';

type FeatureKey = keyof (typeof PLANS)['FREE']['features'];

export function requireFeature(featureKey: FeatureKey) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as { plan?: UserPlan } | undefined;

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const planId = (user.plan || 'FREE') as UserPlan;
    const plan = PLANS[planId];

    if (!plan.features[featureKey]) {
      return res.status(403).json({
        message: 'Your current plan does not include this feature.',
        feature: featureKey,
        plan: planId
      });
    }

    next();
  };
}

