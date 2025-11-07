import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import SearchBar from './SearchBar';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  onLogout: () => void;
  onNavigate: (view: 'dashboard' | 'companies' | 'contacts' | 'deals' | 'tasks-today' | 'admin-users') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout, onNavigate }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [todayTasksCount, setTodayTasksCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [reportsData, setReportsData] = useState<any>(null);

  useEffect(() => {
    // Fetch today's tasks
    const fetchTodayTasks = async () => {
      try {
        const tasks = await api.get('/tasks/today');
        setTodayTasksCount(tasks.length);
      } catch (error) {
        console.error('Failed to fetch today tasks:', error);
        setTodayTasksCount(0);
      } finally {
        setLoading(false);
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
  const dealsByStatusData = reportsData?.deals_by_status?.map((item: any) => ({
    name: item.status === 'new' ? 'Uus' : item.status === 'won' ? 'Võidetud' : item.status === 'lost' ? 'Kaotatud' : item.status,
    value: Number(item.count),
  })) || [];

  const tasksCompletionData = [
    { name: 'Tehtud', value: reportsData?.tasks?.last_7_days?.completed || 0 },
    { name: 'Pooleli', value: (reportsData?.tasks?.last_7_days?.total || 0) - (reportsData?.tasks?.last_7_days?.completed || 0) },
  ];

  const COLORS = ['#4CAF50', '#2196F3', '#FF9800', '#F44336'];

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>SmartFollow CRM</h1>
        <div className="user-info">
          <span>Tere, {user.username || 'Kasutaja'}!</span>
          <button onClick={onLogout} className="btn-secondary">
            Logi välja
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <h2>Dashboard</h2>
        <p>Tere tulemast SmartFollow CRM-i!</p>
        
        {/* Search Bar */}
        <div className="dashboard-search">
          <SearchBar />
        </div>
        
        <div className="dashboard-grid">
          <div 
            className="dashboard-card" 
            onClick={() => onNavigate('companies')}
          >
            <h3>🏢 Ettevõtted</h3>
            <p>Halda kliente ja nende andmeid</p>
          </div>

          <div 
            className="dashboard-card" 
            onClick={() => onNavigate('contacts')}
          >
            <h3>👤 Kontaktid</h3>
            <p>Kontaktisikud ettevõtetes</p>
          </div>

          <div 
            className="dashboard-card" 
            onClick={() => onNavigate('deals')}
          >
            <h3>💼 Tehingud</h3>
            <p>Müügivõimalused ja pakkumised</p>
          </div>

          <div 
            className="dashboard-card" 
            onClick={() => onNavigate('tasks-today')}
          >
            <h3>✅ Ülesanded</h3>
            <p>
              {loading 
                ? 'Laadimine...' 
                : `Täna tähtaeg: ${todayTasksCount} ülesannet`}
            </p>
          </div>

          {/* Admin card - only visible to admins */}
          {user.role === 'admin' && (
            <div 
              className="dashboard-card admin-card" 
              onClick={() => onNavigate('admin-users')}
            >
              <h3>⚙️ Admin</h3>
              <p>Kasutajate haldus</p>
            </div>
          )}
        </div>

        {/* KPI Charts Section */}
        {reportsData && (
          <div className="dashboard-charts">
            <h3>Ülevaade</h3>
            
            <div className="charts-grid">
              {/* Deals by Status */}
              <div className="chart-card">
                <h4>Tehingud staatuseti</h4>
                {dealsByStatusData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={dealsByStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry: any) => `${entry.name}: ${entry.value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {dealsByStatusData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="chart-empty">Tehinguid pole veel lisatud</p>
                )}
              </div>

              {/* Tasks Completion */}
              <div className="chart-card">
                <h4>Ülesannete täitmine (viimased 7 päeva)</h4>
                {reportsData.tasks.last_7_days.total > 0 ? (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={tasksCompletionData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#2196F3" />
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

            {/* Summary Stats */}
            <div className="stats-row">
              <div className="stat-card">
                <div className="stat-value">{reportsData.totals.companies}</div>
                <div className="stat-label">Ettevõtet</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{reportsData.totals.contacts}</div>
                <div className="stat-label">Kontakti</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{reportsData.totals.deals}</div>
                <div className="stat-label">Tehingut</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{reportsData.tasks.today.completed}/{reportsData.tasks.today.total}</div>
                <div className="stat-label">Täna tehtud</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

