/**
 * Account Switcher - Dropdown for SUPER_ADMIN to select active account
 */

import React from 'react';
import { useAccountContext } from '../context/AccountContext';

const AccountSwitcher: React.FC = () => {
  const { accounts, currentAccountId, setCurrentAccountId, loading } = useAccountContext();

  // Get user role
  const userRole = JSON.parse(localStorage.getItem('user') || '{}')?.role || 'USER';
  const isSuperAdmin = userRole === 'SUPER_ADMIN';

  // Only show for SUPER_ADMIN
  if (!isSuperAdmin) {
    return null;
  }

  if (loading) {
    return (
      <div style={{ marginBottom: 16 }}>
        <div style={{ 
          fontSize: 11, 
          textTransform: 'uppercase', 
          letterSpacing: '0.06em',
          color: '#94a3b8',
          marginBottom: 6 
        }}>
          Aktiivne konto
        </div>
        <div style={{ fontSize: 12, color: '#94a3b8' }}>
          Laen ettevõtteid...
        </div>
      </div>
    );
  }

  if (!accounts.length) {
    return (
      <div style={{ marginBottom: 16 }}>
        <div style={{ 
          fontSize: 11, 
          textTransform: 'uppercase', 
          letterSpacing: '0.06em',
          color: '#94a3b8',
          marginBottom: 6 
        }}>
          Aktiivne konto
        </div>
        <div style={{ fontSize: 12, color: '#94a3b8' }}>
          Ettevõtteid pole
        </div>
      </div>
    );
  }

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ 
        fontSize: 11, 
        textTransform: 'uppercase', 
        letterSpacing: '0.06em',
        color: '#94a3b8',
        marginBottom: 6 
      }}>
        Aktiivne konto
      </div>
      <select
        value={currentAccountId ?? ''}
        onChange={(e) => {
          const value = e.target.value;
          if (!value) {
            setCurrentAccountId(null);
          } else {
            setCurrentAccountId(Number(value));
          }
        }}
        style={{
          width: '100%',
          borderRadius: 9999,  // pill style
          padding: '8px 12px',
          border: '1px solid #e2e8f0',
          backgroundColor: '#ffffff',
          color: '#0f172a',
          fontSize: 13,
          fontWeight: 500,
          outline: 'none',
          cursor: 'pointer',
        }}
      >
        <option value="">-- Vali account --</option>
        {accounts.map((acc) => (
          <option key={acc.id} value={acc.id}>
            {acc.name} ({acc.billing_plan})
          </option>
        ))}
      </select>
    </div>
  );
};

export default AccountSwitcher;

