import React, { useState, useEffect } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import Companies from './Companies';
import Contacts from './Contacts';
import Deals from './Deals';
import TasksToday from './TasksToday';
import AdminUsers from './AdminUsers';

type View = 'dashboard' | 'companies' | 'contacts' | 'deals' | 'tasks-today' | 'admin-users';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<View>('dashboard');

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = (token: string) => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setCurrentView('dashboard');
  };

  const handleNavigate = (view: View) => {
    setCurrentView(view);
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <p>Laadimine...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="app">
        <Login onLoginSuccess={handleLoginSuccess} />
      </div>
    );
  }

  return (
    <div className="app">
      {currentView === 'dashboard' && (
        <Dashboard 
          onLogout={handleLogout} 
          onNavigate={handleNavigate}
        />
      )}
      {currentView === 'companies' && (
        <Companies onBack={() => setCurrentView('dashboard')} />
      )}
      {currentView === 'contacts' && (
        <Contacts onBack={() => setCurrentView('dashboard')} />
      )}
      {currentView === 'deals' && (
        <Deals onBack={() => setCurrentView('dashboard')} />
      )}
      {currentView === 'tasks-today' && (
        <TasksToday onBack={() => setCurrentView('dashboard')} />
      )}
      {currentView === 'admin-users' && (
        <AdminUsers onBack={() => setCurrentView('dashboard')} />
      )}
    </div>
  );
};

export default App;