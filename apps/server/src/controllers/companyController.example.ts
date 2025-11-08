// Example: Company controller with plan limit checks
import { Request, Response } from 'express';
import { Company } from '../models/companyModel';
import { checkPlanLimit } from '../utils/planLimits';
import { UserPlan } from '../models/userModel';

// Example: Create company with plan limit check
export async function createCompany(req: Request, res: Response) {
  const user = req.user as { id: number; account_id?: number; plan?: UserPlan } | undefined;

  if (!user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const planId = (user.plan || 'FREE') as UserPlan;

  // Check current company count
  const currentCount = await Company.count({
    where: { owner_id: user.account_id ?? user.id }
  });

  // Check plan limit
  const limit = checkPlanLimit(planId, 'companies', currentCount);

  if (!limit.ok) {
    return res.status(403).json({
      message: 'Company limit reached for your plan.',
      plan: planId,
      maxCompanies: limit.max,
      currentCompanies: limit.current
    });
  }

  // Create company
  try {
    const company = await Company.create({
      owner_id: user.account_id ?? user.id,
      name: req.body.name,
      registry_code: req.body.registry_code,
      address: req.body.address,
      phone: req.body.phone,
      email: req.body.email,
      website: req.body.website
    });

    return res.status(201).json(company);
  } catch (error) {
    console.error('Error creating company:', error);
    return res.status(500).json({ message: 'Failed to create company' });
  }
}

// Same pattern can be applied to:
// - deals controller (maxDeals limit)
// - users controller (maxUsers limit)

