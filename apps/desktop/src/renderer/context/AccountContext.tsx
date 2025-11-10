/**
 * Account Context - Global account switcher for SUPER_ADMIN
 * 
 * Manages current account selection and provides account list
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '../utils/api';

export interface Account {
  id: number;
  name: string;
  billing_plan: string;
  is_active: boolean;
}

interface AccountContextValue {
  accounts: Account[];
  currentAccountId: number | null;
  currentAccount: Account | null;
  setCurrentAccountId: (id: number | null) => void;
  loading: boolean;
}

const AccountContext = createContext<AccountContextValue | undefined>(undefined);

const STORAGE_KEY = 'sf_current_account_id';

export const AccountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [currentAccountId, setCurrentAccountIdState] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Load initial value from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = parseInt(raw, 10);
      if (!Number.isNaN(parsed)) {
        setCurrentAccountIdState(parsed);
      }
    }
  }, []);

  // Load accounts from backend
  useEffect(() => {
    let cancelled = false;

    const loadAccounts = async () => {
      try {
        setLoading(true);
        
        // Use same endpoint as "Ettevõtted (SA)" page
        const result = await api.get('/super-admin/companies');
        
        if (cancelled) return;

        const list: Account[] = result.success && result.data?.companies 
          ? result.data.companies.map((c: any) => ({
              id: c.id,
              name: c.name,
              billing_plan: c.billing_plan,
              is_active: c.is_active,
            }))
          : [];

        setAccounts(list);

        // Auto-select first account if current is invalid
        if (list.length > 0) {
          const exists = list.some(a => a.id === currentAccountId);
          if (!exists) {
            const firstId = list[0].id;
            setCurrentAccountIdState(firstId);
            if (typeof window !== 'undefined') {
              window.localStorage.setItem(STORAGE_KEY, String(firstId));
            }
          }
        } else {
          setCurrentAccountIdState(null);
          if (typeof window !== 'undefined') {
            window.localStorage.removeItem(STORAGE_KEY);
          }
        }
      } catch (err) {
        console.error('Failed to load accounts for switcher:', err);
        // For non-SUPER_ADMIN users, this endpoint will fail - that's OK
        if (!cancelled) {
          setAccounts([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadAccounts();

    return () => {
      cancelled = true;
    };
  }, []);

  const setCurrentAccountId = (id: number | null) => {
    setCurrentAccountIdState(id);
    if (typeof window !== 'undefined') {
      if (id === null) {
        window.localStorage.removeItem(STORAGE_KEY);
      } else {
        window.localStorage.setItem(STORAGE_KEY, String(id));
      }
    }
  };

  const currentAccount =
    currentAccountId != null ? accounts.find(a => a.id === currentAccountId) ?? null : null;

  return (
    <AccountContext.Provider
      value={{ accounts, currentAccountId, currentAccount, setCurrentAccountId, loading }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export const useAccountContext = () => {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error('useAccountContext must be used within AccountProvider');
  return ctx;
};

export default AccountContext;

