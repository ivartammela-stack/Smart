/**
 * PlanBanner - Shows current plan and trial status
 * Displays in bottom-right corner as floating widget
 */

import React, { useState, useEffect } from 'react';
import api from '../utils/api';

type PlanId = 'TRIAL' | 'STARTER' | 'PRO' | 'ENTERPRISE';

const PlanBanner: React.FC = () => {
  const [planData, setPlanData] = useState<any>(null);

  useEffect(() => {
    // Try to load from backend
    loadPlanData();
  }, []);

  const loadPlanData = async () => {
    try {
      const response = await api.get('/billing/current');
      setPlanData(response.data);
    } catch (error) {
      // Fallback to localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      setPlanData({
        plan: user.plan || 'TRIAL',
        status: 'TRIAL',
      });
    }
  };

  if (!planData) return null;

  const planId = planData.plan as PlanId;
  const isTrial = planId === 'TRIAL';
  
  const planLabels: Record<PlanId, string> = {
    TRIAL: 'Trial',
    STARTER: 'Starter',
    PRO: 'Pro',
    ENTERPRISE: 'Enterprise',
  };

  const planClass = 
    planId === 'PRO' ? 'plan-pro' :
    planId === 'ENTERPRISE' ? 'plan-business' :
    planId === 'STARTER' ? 'plan-starter' :
    'plan-trial';

  // Calculate days left for trial
  const getDaysLeft = (endDate?: string | null): number => {
    if (!endDate) return 0;
    const now = new Date();
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  const trialDaysLeft = getDaysLeft(planData.trialEndsAt);
  
  const subtitle = isTrial 
    ? `Prooviversioon • ${trialDaysLeft} päeva jäänud`
    : 'Aktiivne tellimus';

  return (
    <div className={`plan-banner ${planClass}`}>
      <div className="plan-banner-pill">{planLabels[planId]}</div>
      <div className="plan-banner-text">
        <div className="plan-banner-title">Sinu pakett</div>
        <div className="plan-banner-subtitle">{subtitle}</div>
      </div>
    </div>
  );
};

export default PlanBanner;
