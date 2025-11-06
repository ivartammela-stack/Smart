import React, { useState, useEffect } from 'react';
import api from '../utils/api';

interface DashboardProps {
  onLogout: () => void;
  onNavigate: (view: 'companies') => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout, onNavigate }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [todayTasksCount, setTodayTasksCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

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

    fetchTodayTasks();
  }, []);

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
        
        <div className="dashboard-grid">
          <div 
            className="dashboard-card" 
            onClick={() => onNavigate('companies')}
          >
            <h3>🏢 Ettevõtted</h3>
            <p>Halda kliente ja nende andmeid</p>
          </div>

          <div className="dashboard-card">
            <h3>👤 Kontaktid</h3>
            <p>Kontaktisikud ettevõtetes</p>
          </div>

          <div className="dashboard-card">
            <h3>💼 Tehingud</h3>
            <p>Müügivõimalused ja pakkumised</p>
          </div>

          <div className="dashboard-card">
            <h3>✅ Ülesanded</h3>
            <p>
              {loading 
                ? 'Laadimine...' 
                : `Täna tähtaeg: ${todayTasksCount} ülesannet`}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

