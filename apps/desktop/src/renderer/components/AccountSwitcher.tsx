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
      <div style={{ fontSize: 12, color: '#94a3b8', padding: '4px 8px' }}>
        Laen ettevõtteid...
      </div>
    );
  }

  if (!accounts.length) {
    return (
      <div style={{ fontSize: 12, color: '#94a3b8', padding: '4px 8px' }}>
        Ettevõtteid pole
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ fontSize: 12, color: '#94a3b8' }}>Aktiivne konto:</span>
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
          padding: '6px 12px',
          borderRadius: 6,
          border: '1px solid #cbd5e1',
          backgroundColor: '#fff',
          fontSize: 13,
          fontWeight: 500,
          cursor: 'pointer',
          minWidth: 180,
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

