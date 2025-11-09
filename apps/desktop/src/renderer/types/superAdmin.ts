/**
 * Super Admin Types
 */

export type AccountStatus = 'TRIAL' | 'GRACE' | 'ACTIVE' | 'LOCKED';

export interface SuperAdminCompanyItem {
  id: number;
  name: string;
  billing_plan: string;
  is_active: boolean;
  plan_locked: boolean;
  trial_ends_at: string | null;
  grace_ends_at: string | null;
  created_at: string;
  users_count: number;
  owner_full_name: string | null;
  owner_email: string | null;
  status: AccountStatus;
}

export interface SuperAdminCompaniesResponse {
  total_companies: number;
  total_users: number;
  avg_users_per_company: number;
  companies: SuperAdminCompanyItem[];
}

export function formatStatusEE(status: AccountStatus): string {
  switch (status) {
    case 'TRIAL':
      return 'Prooviaeg';
    case 'GRACE':
      return 'Lisaaeg';
    case 'ACTIVE':
      return 'Aktiivne';
    case 'LOCKED':
      return 'Lukus';
  }
}

export function getStatusColor(status: AccountStatus): string {
  switch (status) {
    case 'TRIAL':
      return '#f59e0b'; // amber
    case 'GRACE':
      return '#f97316'; // orange
    case 'ACTIVE':
      return '#10b981'; // green
    case 'LOCKED':
      return '#6b7280'; // gray
  }
}

