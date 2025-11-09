/**
 * Billing Page - Plan management and subscription
 */

import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import type { PlanId } from '../../hooks/useCurrentPlan';

interface PlanConfig {
  id: PlanId;
  name: string;
  nameEE: string;
  pricePerMonth: number;
  descriptionEE: string;
  limits: {
    maxUsers: number | null;
    maxCompanies: number | null;
    maxDeals: number | null;
  };
  features: Record<string, boolean>;
}

interface CurrentPlan {
  plan: PlanId;
  planName: string;
  planLocked: boolean;
  status: 'ACTIVE' | 'TRIAL' | 'GRACE' | 'LOCKED';
  trialEndsAt?: string | null;
  graceEndsAt?: string | null;
}

const BillingPage: React.FC = () => {
  const [currentPlan, setCurrentPlan] = useState<CurrentPlan | null>(null);
  const [availablePlans, setAvailablePlans] = useState<PlanConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [currentRes, plansRes] = await Promise.all([
        api.get('/billing/current'),
        api.get('/billing/plans'),
      ]);

      setCurrentPlan(currentRes.data);
      setAvailablePlans(plansRes.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load billing information');
      console.error('Error loading billing data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async (planId: PlanId) => {
    if (!window.confirm(`Kas oled kindel, et soovid uuendada ${planId} paketile?`)) {
      return;
    }

    try {
      setUpgrading(true);
      await api.post('/billing/upgrade', { planId });
      
      // Reload data
      await loadData();
      
      alert('Pakett uuendatud edukalt!');
    } catch (err: any) {
      alert(err.message || 'Paketi uuendamine ebaõnnestus');
      console.error('Error upgrading plan:', err);
    } finally {
      setUpgrading(false);
    }
  };

  const getDaysLeft = (endDate?: string | null): number => {
    if (!endDate) return 0;
    const now = new Date();
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <h1>Laen paketi teavet...</h1>
      </div>
    );
  }

  if (error || !currentPlan) {
    return (
      <div style={{ padding: 24 }}>
        <h1>Viga</h1>
        <p>{error || 'Paketi teavet ei õnnestunud laadida'}</p>
        <button onClick={loadData}>Proovi uuesti</button>
      </div>
    );
  }

  const trialDaysLeft = getDaysLeft(currentPlan.trialEndsAt);
  const graceDaysLeft = getDaysLeft(currentPlan.graceEndsAt);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh',
      overflow: 'hidden' 
    }}>
      {/* Fixed Header */}
      <div style={{ 
        flexShrink: 0,
        padding: '24px 24px 0 24px',
        maxWidth: 1200,
        margin: '0 auto',
        width: '100%'
      }}>
        <h1 style={{ marginBottom: 8 }}>Arveldus ja paketid</h1>
        <p style={{ color: '#666', marginBottom: 24 }}>
          Halda oma SmartFollow CRM tellimust ja vali sobiv pakett
        </p>

        {/* Current Plan Status */}
        <div style={{ 
          marginBottom: 24, 
          padding: 24, 
          background: currentPlan.status === 'LOCKED' || currentPlan.status === 'GRACE' ? '#fee' : '#f0f9ff',
          borderRadius: 12,
          border: `2px solid ${currentPlan.status === 'LOCKED' || currentPlan.status === 'GRACE' ? '#dc2626' : '#3b82f6'}`
        }}>
          <h2 style={{ marginBottom: 8 }}>Praegune pakett: <strong>{currentPlan.planName}</strong></h2>
          
          {currentPlan.status === 'TRIAL' && (
            <p style={{ color: '#3b82f6', fontSize: 16 }}>
              🎉 Prooviversioon aktiivne • {trialDaysLeft} päeva jäänud
            </p>
          )}
          
          {currentPlan.status === 'GRACE' && (
            <p style={{ color: '#dc2626', fontSize: 16, fontWeight: 600 }}>
              ⚠️ Prooviversioon lõppenud! Vali pakett {graceDaysLeft} päeva jooksul või konto lukustatakse.
            </p>
          )}
          
          {currentPlan.status === 'LOCKED' && (
            <p style={{ color: '#dc2626', fontSize: 16, fontWeight: 600 }}>
              🔒 Konto on lukus. Vali pakett, et jätkata kasutamist.
            </p>
          )}
          
          {currentPlan.status === 'ACTIVE' && currentPlan.plan !== 'TRIAL' && (
            <p style={{ color: '#16a34a', fontSize: 16 }}>
              ✅ Aktiivne tellimus
            </p>
          )}
        </div>

        <h2 style={{ marginBottom: 16 }}>Saadaolevad paketid</h2>
      </div>

      {/* Scrollable Plans Area */}
      <div style={{ 
        flex: 1,
        overflowY: 'auto',
        padding: '0 24px 24px 24px',
        maxWidth: 1200,
        margin: '0 auto',
        width: '100%'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, paddingRight: 12 }}>
        {availablePlans.map((plan) => {
          const isCurrent = plan.id === currentPlan.plan;
          
          return (
            <div
              key={plan.id}
              style={{
                border: isCurrent ? '3px solid #3b82f6' : '1px solid #e5e7eb',
                borderRadius: 12,
                padding: 24,
                background: isCurrent ? '#f0f9ff' : '#fff',
                position: 'relative',
              }}
            >
              {isCurrent && (
                <div style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  background: '#3b82f6',
                  color: '#fff',
                  padding: '4px 12px',
                  borderRadius: 12,
                  fontSize: 12,
                  fontWeight: 600,
                }}>
                  Praegune
                </div>
              )}

              <h3 style={{ marginBottom: 8 }}>{plan.nameEE}</h3>
              
              <div style={{ marginBottom: 16 }}>
                <span style={{ fontSize: 32, fontWeight: 700 }}>{plan.pricePerMonth}€</span>
                <span style={{ color: '#666' }}>/kasutaja/kuu</span>
              </div>

              <p style={{ color: '#666', marginBottom: 16, minHeight: 40 }}>
                {plan.descriptionEE}
              </p>

              <div style={{ marginBottom: 16, paddingTop: 16, borderTop: '1px solid #e5e7eb' }}>
                <div style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>
                  <strong>Limiidid:</strong>
                </div>
                <div style={{ fontSize: 14 }}>
                  • Kasutajaid: {plan.limits.maxUsers ?? '∞'}<br />
                  • Ettevõtteid: {plan.limits.maxCompanies ?? '∞'}<br />
                  • Tehinguid: {plan.limits.maxDeals ?? '∞'}
                </div>
              </div>

              <button
                onClick={() => handleUpgrade(plan.id)}
                disabled={isCurrent || upgrading}
                style={{
                  width: '100%',
                  padding: '12px 24px',
                  background: isCurrent ? '#e5e7eb' : '#3b82f6',
                  color: isCurrent ? '#6b7280' : '#fff',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: isCurrent || upgrading ? 'not-allowed' : 'pointer',
                  opacity: upgrading ? 0.6 : 1,
                }}
              >
                {isCurrent ? 'Aktiivne' : upgrading ? 'Uuendamine...' : 'Vali see pakett'}
              </button>
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
};

export default BillingPage;

