// Component to guard features based on plan
import React from 'react';
import { useCurrentPlan, PlanId } from '../hooks/useCurrentPlan';

interface PlanGuardProps {
  minPlan: PlanId;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const planOrder: PlanId[] = ['TRIAL', 'STARTER', 'PRO', 'ENTERPRISE'];

function isPlanAtLeast(current: PlanId, required: PlanId) {
  return planOrder.indexOf(current) >= planOrder.indexOf(required);
}

export const PlanGuard: React.FC<PlanGuardProps> = ({ minPlan, children, fallback }) => {
  const { id: currentPlan } = useCurrentPlan();

  if (isPlanAtLeast(currentPlan, minPlan)) {
    return <>{children}</>;
  }

  if (fallback) return <>{fallback}</>;

  return (
    <div className="plan-guard-locked">
      <div className="plan-guard-message">
        <span className="plan-guard-icon">🔒</span>
        <div>
          <p className="plan-guard-title">See funktsioon on saadaval alates paketist <strong>{minPlan}</strong></p>
          <p className="plan-guard-subtitle">Upgrade oma plaani, et saada juurdepääs sellele funktsioonile.</p>
        </div>
      </div>
      <button className="plan-guard-upgrade-btn">
        Vaata pakette / Upgrade
      </button>
    </div>
  );
};

