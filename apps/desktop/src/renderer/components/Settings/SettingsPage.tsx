/**
 * Settings Page - Main wrapper with tabs
 * Tabs: Plaan (Billing) | Kasutajad (Users)
 */

import React, { useState } from 'react';
import BillingPage from './BillingPage';
import UsersPage from './UsersPage';
import { useAccountContext } from '../../context/AccountContext';

type SettingsTab = 'plan' | 'users';

const SettingsPage: React.FC = () => {
  // Get user role from localStorage
  const userRole = JSON.parse(localStorage.getItem('user') || '{}')?.role || 'USER';
  const isSuperAdmin = userRole === 'SUPER_ADMIN';
  
  // Get current account from context
  const { currentAccountId } = useAccountContext();
  
  // Can see Plan tab if:
  // - COMPANY_ADMIN (always has account context)
  // - SUPER_ADMIN with account selected
  const canSeePlanTab = userRole === 'COMPANY_ADMIN' || (isSuperAdmin && !!currentAccountId);
  
  // Default tab: 'users' for SUPER_ADMIN without account, 'plan' for others
  const defaultTab: SettingsTab = canSeePlanTab ? 'plan' : 'users';
  const [activeTab, setActiveTab] = useState<SettingsTab>(defaultTab);

  return (
    <div style={{ 
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'hidden',
      background: '#f5f7fa'
    }}>
      {/* Tabs Header */}
      <div style={{
        flexShrink: 0,
        background: '#fff',
        borderBottom: '2px solid #e5e7eb',
        padding: '0 24px',
      }}>
        <div style={{
          display: 'flex',
          gap: 8,
          maxWidth: 1200,
          margin: '0 auto',
        }}>
          {/* Show Plan tab only if user has account context */}
          {canSeePlanTab && (
            <button
              onClick={() => setActiveTab('plan')}
              style={{
                padding: '16px 24px',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === 'plan' ? '3px solid #3b82f6' : '3px solid transparent',
                color: activeTab === 'plan' ? '#3b82f6' : '#6b7280',
                fontSize: 16,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              📊 Plaan
            </button>
          )}
          
          <button
            onClick={() => setActiveTab('users')}
            style={{
              padding: '16px 24px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === 'users' ? '3px solid #3b82f6' : '3px solid transparent',
              color: activeTab === 'users' ? '#3b82f6' : '#6b7280',
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            👥 Kasutajad
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {activeTab === 'plan' && <BillingPage />}
        {activeTab === 'users' && <UsersPage />}
      </div>
    </div>
  );
};

export default SettingsPage;

