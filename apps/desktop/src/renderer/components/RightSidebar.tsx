import React, { useState } from 'react';
import api from '../utils/api';
import type { ReportsData } from '../types/reports';

type View = 'dashboard' | 'companies' | 'contacts' | 'deals' | 'tasks-today' | 'admin-users';

interface User {
  id?: number;
  username?: string;
  email?: string;
  role?: string;
  plan?: string;
}

interface RightSidebarProps {
  user: User;
  stats: ReportsData | null;
  onNavigate: (view: View) => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ user, stats, onNavigate }) => {
  const initials = user?.username?.[0]?.toUpperCase() || 'S';
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Plan badge helper
  const getPlanBadge = (plan: string) => {
    const planConfig: Record<string, { label: string; bg: string; color: string }> = {
      TRIAL: { label: 'Trial', bg: '#f1f5f9', color: '#475569' },
      STARTER: { label: 'Starter', bg: '#e0f2fe', color: '#0369a1' },
      PRO: { label: 'Pro', bg: '#ede9fe', color: '#7c3aed' },
      ENTERPRISE: { label: 'Enterprise', bg: '#fef3c7', color: '#b45309' },
    };

    const config = planConfig[plan] || planConfig.TRIAL;

    return (
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 14px',
          borderRadius: '16px',
          background: config.bg,
          color: config.color,
          fontSize: '12px',
          fontWeight: '600',
          cursor: 'default',
        }}
      >
        <span style={{ 
          display: 'inline-block', 
          width: '6px', 
          height: '6px', 
          borderRadius: '50%', 
          background: config.color 
        }} />
        {config.label}
      </div>
    );
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Uued paroolid ei ühti');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError('Parool peab olema vähemalt 6 tähemärki');
      return;
    }

    try {
      await api.put('/users/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      
      setPasswordSuccess('Parool edukalt muudetud!');
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setPasswordSuccess('');
      }, 2000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Parooli muutmine ebaõnnestus';
      setPasswordError(message);
    }
  };

  return (
    <>
      <div className="right-profile-card">
        <div className="right-avatar">{initials}</div>
        <div className="right-name">{user?.username || 'Kasutaja'}</div>
        <div className="right-role">
          {user?.role === 'SUPER_ADMIN' ? 'Super Admin' : user?.role === 'COMPANY_ADMIN' ? 'Ettevõtte Admin' : 'SmartFollow kasutaja'}
        </div>
        
        {/* Plan Badge */}
        <div style={{ marginTop: '12px' }}>
          {getPlanBadge(user?.plan || 'TRIAL')}
        </div>

        <div className="right-location" style={{ marginTop: '12px' }}>CRM versioon 1.6.5</div>
        
        {/* Change Password Button - New Style */}
        <button 
          onClick={() => setShowPasswordModal(true)}
          style={{ 
            marginTop: '12px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '20px',
            border: 'none',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            color: '#ffffff',
            fontSize: '13px',
            fontWeight: '500',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)',
            transition: 'all 0.2s',
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <span>Muuda parooli</span>
        </button>
      </div>

      <div>
        <div className="right-block-title">Fookuses olevad tehingud</div>
        <div 
          className="right-job-card primary"
          onClick={() => onNavigate('deals')}
        >
          <div className="right-job-title">Aktiivsed tehingud</div>
          <div className="right-job-meta">
            {stats?.totals?.deals || 0} aktiivset tehingut kokku.
          </div>
        </div>
        <div 
          className="right-job-card secondary"
          onClick={() => onNavigate('tasks-today')}
        >
          <div className="right-job-title">Täna tähtajaga ülesanded</div>
          <div className="right-job-meta">
            {stats?.tasks?.today?.total || 0} ülesannet · {stats?.tasks?.today?.completed || 0} valmis
          </div>
        </div>
      </div>

      <div className="reminders-card">
        <div className="right-block-title">Meeldetuletused</div>
        <div className="reminder-row">
          <span className="reminder-text">
            Kontrolli tänased ülesanded
          </span>
          <span className="reminder-time">Täna</span>
        </div>
        <div className="reminder-row">
          <span className="reminder-text">
            Vaata üle avatud tehingud
          </span>
          <span className="reminder-time">Sel nädalal</span>
        </div>
        <div className="reminder-row">
          <span className="reminder-text">
            Uuenda kontaktide andmeid
          </span>
          <span className="reminder-time">Järgmine kuu</span>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="sf-modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="sf-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sf-modal-header">
              <h2>Muuda parooli</h2>
              <button onClick={() => setShowPasswordModal(false)} className="sf-modal-close">×</button>
            </div>
            
            <form onSubmit={handlePasswordChange} className="sf-form">
              {passwordError && <div className="sf-error">{passwordError}</div>}
              {passwordSuccess && <div className="sf-success">{passwordSuccess}</div>}
              
              <div className="sf-form-group">
                <label>Praegune parool *</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                  required
                  autoComplete="current-password"
                />
              </div>

              <div className="sf-form-group">
                <label>Uus parool * (min 6 tähemärki)</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
              </div>

              <div className="sf-form-group">
                <label>Kinnita uus parool *</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
              </div>

              <div className="sf-form-actions">
                <button 
                  type="button" 
                  onClick={() => setShowPasswordModal(false)} 
                  className="sf-btn sf-btn-secondary"
                >
                  Tühista
                </button>
                <button type="submit" className="sf-btn sf-btn-primary">
                  Muuda parooli
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default RightSidebar;

