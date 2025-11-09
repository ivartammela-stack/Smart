import React, { useState } from 'react';
import api from '../utils/api';
import type { ReportsData } from '../types/reports';

type View = 'dashboard' | 'companies' | 'contacts' | 'deals' | 'tasks-today' | 'admin-users';

interface User {
  id?: number;
  username?: string;
  email?: string;
  role?: string;
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
          {user?.role === 'admin' ? 'Administraator' : 'SmartFollow kasutaja'}
        </div>
        <div className="right-location">CRM versioon 1.6.3</div>
        <button 
          onClick={() => setShowPasswordModal(true)}
          className="sf-btn-text"
          style={{ marginTop: '8px', fontSize: '13px', color: 'var(--sf-primary)' }}
        >
          🔒 Muuda parooli
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

