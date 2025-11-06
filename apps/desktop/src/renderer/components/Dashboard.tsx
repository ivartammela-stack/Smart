import React from 'react';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

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
          <div className="dashboard-card">
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
            <p>Täna tähtaeg: 0 ülesannet</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

