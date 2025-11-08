// Report data types
export interface DealByStatus {
  status: string;
  count: number;
  total_value: number;
}

export interface TasksStats {
  last_7_days: {
    total: number;
    completed: number;
    completion_rate: number;
  };
  today: {
    total: number;
    completed: number;
  };
}

export interface EntityTotals {
  companies: number;
  contacts: number;
  deals: number;
}

export interface ReportsData {
  deals_by_status: DealByStatus[];
  tasks: TasksStats;
  totals: EntityTotals;
}

