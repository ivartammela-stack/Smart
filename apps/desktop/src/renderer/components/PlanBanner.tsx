import React from 'react';

type PlanId = 'starter' | 'pro' | 'business';

interface UserPlan {
  id: PlanId;
  name: string;
  billingPeriod: 'monthly' | 'yearly';
  renewsAt?: string;
}

interface PlanBannerProps {
  plan: UserPlan;
}

const PlanBanner: React.FC<PlanBannerProps> = ({ plan }) => {
  const renewText = plan.renewsAt
    ? `Uueneb ${new Date(plan.renewsAt).toLocaleDateString('et-EE')}`
    : plan.billingPeriod === 'yearly'
    ? 'Aastapakett aktiivne'
    : 'Kuupõhine pakett aktiivne';

  const planClass =
    plan.id === 'pro'
      ? 'plan-pro'
      : plan.id === 'business'
      ? 'plan-business'
      : 'plan-starter';

  return (
    <div className={`plan-banner ${planClass}`}>
      <div className="plan-banner-pill">{plan.name}</div>
      <div className="plan-banner-text">
        <div className="plan-banner-title">Sinu pakett</div>
        <div className="plan-banner-subtitle">{renewText}</div>
      </div>
    </div>
  );
};

export default PlanBanner;

