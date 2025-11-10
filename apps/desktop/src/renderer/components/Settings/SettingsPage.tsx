/**
 * Settings Page - Main wrapper with tabs
 * Tabs: Plaan (Billing) | Kasutajad (Users)
 */

import React, { useState } from 'react';
import BillingPage from './BillingPage';
import UsersPage from './UsersPage';

type SettingsTab = 'plan' | 'users';

const SettingsPage: React.FC = () => {
  // Get user role from localStorage
  const userRole = JSON.parse(localStorage.getItem('user') || '{}')?.role || 'USER';
  const isSuperAdmin = userRole === 'SUPER_ADMIN';
  
  // SUPER_ADMIN starts with 'users' tab (no account context for billing)
  // Others start with 'plan' tab
  const [activeTab, setActiveTab] = useState<SettingsTab>(isSuperAdmin ? 'users' : 'plan');

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
          {/* Hide Plan tab for SUPER_ADMIN (no account context) */}
          {!isSuperAdmin && (
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

