// Plan configuration for SmartFollow CRM
export type PlanId = 'FREE' | 'STARTER' | 'PRO' | 'ENTERPRISE';

export interface PlanConfig {
  id: PlanId;
  label: string;
  maxUsers: number;
  maxCompanies: number;
  maxDeals: number;
  features: {
    dashboardAnalytics: boolean;
    dealsPipeline: boolean;
    tasksModule: boolean;
    adminUsersModule: boolean;
    globalSearch: boolean;
  };
}

export const PLANS: Record<PlanId, PlanConfig> = {
  FREE: {
    id: 'FREE',
    label: 'Free',
    maxUsers: 1,
    maxCompanies: 50,
    maxDeals: 50,
    features: {
      dashboardAnalytics: false,
      dealsPipeline: false,
      tasksModule: true,
      adminUsersModule: false,
      globalSearch: false
    }
  },
  STARTER: {
    id: 'STARTER',
    label: 'Starter',
    maxUsers: 3,
    maxCompanies: 500,
    maxDeals: 1000,
    features: {
      dashboardAnalytics: true,
      dealsPipeline: true,
      tasksModule: true,
      adminUsersModule: false,
      globalSearch: true
    }
  },
  PRO: {
    id: 'PRO',
    label: 'Pro',
    maxUsers: 10,
    maxCompanies: 5000,
    maxDeals: 10000,
    features: {
      dashboardAnalytics: true,
      dealsPipeline: true,
      tasksModule: true,
      adminUsersModule: true,
      globalSearch: true
    }
  },
  ENTERPRISE: {
    id: 'ENTERPRISE',
    label: 'Enterprise',
    maxUsers: 9999,
    maxCompanies: 999999,
    maxDeals: 999999,
    features: {
      dashboardAnalytics: true,
      dealsPipeline: true,
      tasksModule: true,
      adminUsersModule: true,
      globalSearch: true
    }
  }
};

