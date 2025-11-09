import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import SearchBar from './SearchBar';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { ReportsData } from '../types/reports';

interface DashboardProps {
  onNavigate: (view: 'dashboard' | 'companies' | 'contacts' | 'deals' | 'tasks-today' | 'admin-users') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [reportsData, setReportsData] = useState<ReportsData | null>(null);

  const handleSearchResultClick = (result: any) => {
    const type = result.type.toLowerCase();
    
    switch (type) {
      case 'company':
        onNavigate('companies');
        break;
      case 'contact':
        onNavigate('contacts');
        break;
      case 'deal':
        onNavigate('deals');
        break;
      case 'task':
        onNavigate('tasks-today');
        break;
      default:
        console.warn('Unknown search result type:', result.type);
    }
  };

  useEffect(() => {
    // Fetch today's tasks
    const fetchTodayTasks = async () => {
      try {
        await api.get('/tasks/today');
      } catch (error) {
        console.error('Failed to fetch today tasks:', error);
      }
    };

    // Fetch reports data
    const fetchReports = async () => {
      try {
        const response = await api.get('/reports/summary');
        setReportsData(response.data);
      } catch (error) {
        console.error('Failed to fetch reports:', error);
      }
    };

    fetchTodayTasks();
    fetchReports();
  }, []);

  // Prepare chart data
  const dealsByStatusData = reportsData?.deals_by_status?.map((item) => ({
    name: item.status === 'new' ? 'Uus' : item.status === 'won' ? 'Võidetud' : item.status === 'lost' ? 'Kaotatud' : item.status,
    value: Number(item.count),
  })) || [];

  const tasksCompletionData = [
    { name: 'Tehtud', value: reportsData?.tasks?.last_7_days?.completed || 0 },
    { name: 'Pooleli', value: (reportsData?.tasks?.last_7_days?.total || 0) - (reportsData?.tasks?.last_7_days?.completed || 0) },
  ];

  const COLORS = ['#4ADE80', '#60A5FA', '#F59E0B', '#EF4444']; // SmartFollow brand colors

  // Custom label renderer to prevent overlap
  interface PieLabelProps {
    name: string;
    value: number;
    cx: number;
    cy: number;
    midAngle: number;
    outerRadius: number;
  }

  // Recharts event handler types
  interface PieChartDataPoint {
    name: string;
    value: number;
  }

  interface LegendPayload {
    value: string;
    color?: string;
  }

  const renderCustomLabel = ({ name, value, cx, cy, midAngle, outerRadius }: PieLabelProps) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 20;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return (
      <text
        x={x}
        y={y}
        fill="var(--sf-text-main)"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        style={{ fontSize: 12, fontWeight: 500 }}
      >
        {`${name}: ${value}`}
      </text>
    );
  };

  // Navigate to Deals with filter
  const handleDealStatusClick = (statusName: string) => {
    let status = 'all';
    if (statusName === 'Uus') status = 'new';
    if (statusName === 'Võidetud') status = 'won';
    if (statusName === 'Kaotatud') status = 'lost';
    
    localStorage.setItem('dealsFilter', status);
    onNavigate('deals');
  };

  // Navigate to Tasks with filter
  const handleTasksClick = (filterType: string) => {
    if (filterType === 'completed') {
      localStorage.setItem('tasksFilter', 'completed');
    } else if (filterType === 'pending') {
      localStorage.setItem('tasksFilter', 'pending');
    } else {
      localStorage.setItem('tasksFilter', 'all');
    }
    onNavigate('tasks-today');
  };

  return (
    <div className="dashboard-shell">
      {/* Header */}
      <header className="dashboard-header">
        <div className="dashboard-title-block">
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">
            Kokkuvõte ettevõtetest, kontaktidest, tehingutest ja ülesannetest.
          </p>
        </div>
        <div className="dashboard-header-right">
          <SearchBar onResultClick={handleSearchResultClick} />
        </div>
      </header>

      {/* KPI cards - 3 cards in row */}
      {reportsData && (
        <div className="dashboard-kpi-row">
          <div 
            className="kpi-card"
            onClick={() => onNavigate('companies')}
            style={{cursor: 'pointer'}}
          >
            <div className="kpi-header">
              <span>Ettevõtted</span>
              <span>Aktiivsed</span>
            </div>
            <div className="kpi-value-large">{reportsData.totals.companies}</div>
            <div className="kpi-trend">Kliendid CRM-is</div>
          </div>

          <div 
            className="kpi-card"
            onClick={() => {
              localStorage.setItem('dealsFilter', 'all');
              onNavigate('deals');
            }}
            style={{cursor: 'pointer'}}
          >
            <div className="kpi-header">
              <span>Tehingud</span>
              <span>Kõik</span>
            </div>
            <div className="kpi-value-large">{reportsData.totals.deals}</div>
            <div className="kpi-trend">Kõik staatused</div>
          </div>

          <div 
            className="kpi-card"
            onClick={() => {
              localStorage.setItem('tasksFilter', 'all');
              onNavigate('tasks-today');
            }}
            style={{cursor: 'pointer'}}
          >
            <div className="kpi-header">
              <span>Tänased ülesanded</span>
              <span>{reportsData.tasks.today.completed}/{reportsData.tasks.today.total}</span>
            </div>
            <div className="kpi-value-large">{reportsData.tasks.today.total}</div>
            <div className="kpi-trend">Tähtaeg täna</div>
          </div>
        </div>
      )}


      {/* Charts grid (2 columns) */}
      {reportsData && (
        <div className="dashboard-main-grid">
          {/* Deals by Status */}
          <div className="sf-card">
            <div className="sf-card-title">Tehingud staatuseti</div>
            <div className="chart-wrapper">
              {dealsByStatusData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dealsByStatusData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        labelLine={true}
                        label={renderCustomLabel}
                        onClick={(data: PieChartDataPoint) => handleDealStatusClick(data.name)}
                        style={{ cursor: 'pointer' }}
                      >
                        {dealsByStatusData.map((entry: PieChartDataPoint, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend 
                        onClick={(data: LegendPayload) => handleDealStatusClick(data.value)}
                        wrapperStyle={{ cursor: 'pointer' }}
                      />
                    </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="chart-empty">Tehinguid pole veel lisatud</p>
              )}
            </div>
          </div>

          {/* Tasks Completion */}
          <div className="sf-card">
            <div className="sf-card-title">Ülesannete täitmine (7 päeva)</div>
            <div className="chart-wrapper">
              {reportsData.tasks.last_7_days.total > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={tasksCompletionData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend 
                      onClick={(data: LegendPayload) => {
                        if (data.value === 'Tehtud') handleTasksClick('completed');
                        if (data.value === 'Pooleli') handleTasksClick('pending');
                      }}
                      wrapperStyle={{ cursor: 'pointer' }}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="#7b61ff"
                      onClick={(data: PieChartDataPoint) => {
                        if (data.name === 'Tehtud') handleTasksClick('completed');
                        if (data.name === 'Pooleli') handleTasksClick('pending');
                      }}
                      style={{ cursor: 'pointer' }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="chart-empty">Ülesandeid pole veel lisatud</p>
              )}
              <p className="chart-stat">
                Täitmise määr: <strong>{reportsData.tasks.last_7_days.completion_rate}%</strong>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

