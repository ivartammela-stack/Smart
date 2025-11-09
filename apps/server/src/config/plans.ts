/**
 * SmartFollow CRM - Plan Configuration
 * 
 * Defines all available plans, their limits, and features
 */

export type PlanId = 'TRIAL' | 'STARTER' | 'PRO' | 'ENTERPRISE';

export interface PlanLimits {
  maxUsers: number | null; // null = unlimited
  maxCompanies: number | null;
  maxDeals: number | null;
}

export interface PlanFeatures {
  dashboard: boolean;
  companies: boolean;
  contacts: boolean;
  deals: boolean;
  tasks: boolean;
  adminUsers: boolean;
  reports: boolean;
  search: boolean;
  apiAccess: boolean;
}

export interface PlanConfig {
  id: PlanId;
  name: string;
  nameEE: string; // Estonian name
  pricePerMonth: number; // EUR per user
  description: string;
  descriptionEE: string;
  limits: PlanLimits;
  features: PlanFeatures;
  trialDays?: number; // Only for TRIAL
}

// Plan hierarchy (for comparisons)
export const PLAN_ORDER: PlanId[] = ['TRIAL', 'STARTER', 'PRO', 'ENTERPRISE'];

// Plan definitions
export const PLANS: Record<PlanId, PlanConfig> = {
  TRIAL: {
    id: 'TRIAL',
    name: 'Free Trial',
    nameEE: 'Tasuta Prooviversioon',
    pricePerMonth: 0,
    description: '14 days full access to all ENTERPRISE features',
    descriptionEE: '14 päeva täielik juurdepääs kõigile ENTERPRISE funktsioonidele',
    trialDays: 14,
    limits: {
      maxUsers: null, // Unlimited during trial
      maxCompanies: null,
      maxDeals: null,
    },
    features: {
      dashboard: true,
      companies: true,
      contacts: true,
      deals: true,
      tasks: true,
      adminUsers: true,
      reports: true,
      search: true,
      apiAccess: true,
    },
  },
  STARTER: {
    id: 'STARTER',
    name: 'Starter',
    nameEE: 'Starter',
    pricePerMonth: 9,
    description: 'Perfect for small teams getting started',
    descriptionEE: 'Ideaalne väikestele tiimidele alustamiseks',
    limits: {
      maxUsers: 3,
      maxCompanies: 100,
      maxDeals: 500,
    },
    features: {
      dashboard: true,
      companies: true,
      contacts: true,
      deals: true,
      tasks: true,
      adminUsers: false,
      reports: false,
      search: true,
      apiAccess: false,
    },
  },
  PRO: {
    id: 'PRO',
    name: 'Pro',
    nameEE: 'Pro',
    pricePerMonth: 29,
    description: 'For growing teams with advanced needs',
    descriptionEE: 'Kasvavatele tiimidele keerukamate vajadustega',
    limits: {
      maxUsers: 10,
      maxCompanies: 1000,
      maxDeals: 5000,
    },
    features: {
      dashboard: true,
      companies: true,
      contacts: true,
      deals: true,
      tasks: true,
      adminUsers: true,
      reports: true,
      search: true,
      apiAccess: false,
    },
  },
  ENTERPRISE: {
    id: 'ENTERPRISE',
    name: 'Enterprise',
    nameEE: 'Enterprise',
    pricePerMonth: 79,
    description: 'Unlimited everything with full API access',
    descriptionEE: 'Piiramatu kõigega ja täielik API juurdepääs',
    limits: {
      maxUsers: null,
      maxCompanies: null,
      maxDeals: null,
    },
    features: {
      dashboard: true,
      companies: true,
      contacts: true,
      deals: true,
      tasks: true,
      adminUsers: true,
      reports: true,
      search: true,
      apiAccess: true,
    },
  },
};

/**
 * Get plan configuration by ID
 */
export function getPlanConfig(planId: PlanId): PlanConfig {
  return PLANS[planId];
}

/**
 * Compare two plans
 * Returns: -1 if a < b, 0 if equal, 1 if a > b
 */
export function comparePlans(a: PlanId, b: PlanId): number {
  return PLAN_ORDER.indexOf(a) - PLAN_ORDER.indexOf(b);
}

/**
 * Check if plan A is at least plan B (A >= B)
 */
export function isPlanAtLeast(current: PlanId, required: PlanId): boolean {
  return comparePlans(current, required) >= 0;
}

/**
 * Get minimum plan required for a feature
 */
export function getMinPlanForFeature(featureKey: keyof PlanFeatures): PlanId {
  for (const planId of PLAN_ORDER) {
    if (PLANS[planId].features[featureKey]) {
      return planId;
    }
  }
  return 'ENTERPRISE'; // Fallback
}

/**
 * Get all plans suitable for displaying in UI
 * (excludes TRIAL for upgrade options)
 */
export function getPaidPlans(): PlanConfig[] {
  return [PLANS.STARTER, PLANS.PRO, PLANS.ENTERPRISE];
}
