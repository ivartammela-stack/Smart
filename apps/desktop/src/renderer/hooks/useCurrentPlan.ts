// Hook to get current user's plan information
import { useMemo } from 'react';

export type PlanId = 'FREE' | 'STARTER' | 'PRO' | 'ENTERPRISE';

export interface PlanFrontendConfig {
  id: PlanId;
  label: string;
  badgeColor: 'gray' | 'blue' | 'purple' | 'yellow';
}

const PLAN_UI: Record<PlanId, PlanFrontendConfig> = {
  FREE: { id: 'FREE', label: 'Free', badgeColor: 'gray' },
  STARTER: { id: 'STARTER', label: 'Starter', badgeColor: 'blue' },
  PRO: { id: 'PRO', label: 'Pro', badgeColor: 'purple' },
  ENTERPRISE: { id: 'ENTERPRISE', label: 'Enterprise', badgeColor: 'yellow' }
};

export function useCurrentPlan() {
  // Get user from localStorage
  const user = useMemo(() => {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }, []);

  const planId = (user?.plan as PlanId) || 'FREE';
  const ui = useMemo(() => PLAN_UI[planId], [planId]);

  return {
    id: planId,
    label: ui.label,
    badgeColor: ui.badgeColor
  };
}

