import React, { useState, useEffect, useCallback } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import Companies from './Companies';
import Contacts from './Contacts';
import Deals from './Deals';
import TasksToday from './TasksToday';
import AdminUsers from './AdminUsers';
import BillingPage from './Settings/BillingPage';
import ErrorBoundary from './ErrorBoundary';
import RightSidebar from './RightSidebar';
import PlanBanner from './PlanBanner';
import UpdateNotification from './UpdateNotification';
import type { ReportsData } from '../types/reports';

type View = 'dashboard' | 'companies' | 'contacts' | 'deals' | 'tasks-today' | 'admin-users' | 'settings';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [reportsData, setReportsData] = useState<ReportsData | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const fetchReportsData = useCallback(async () => {
    try {
      const api = await import('../utils/api');
      const response = await api.default.get('/reports/summary');
      setReportsData(response.data);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchReportsData();
    }
  }, [isAuthenticated, fetchReportsData]);

  const handleLoginSuccess = () => {
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

  const user = isAuthenticated ? JSON.parse(localStorage.getItem('user') || '{}') : null;

  return (
      <ErrorBoundary>
          <div className="app">
            {/* Auto-update notification toast */}
            <UpdateNotification />
            
            <div className="app-inner">
              <div className="sf-layout">
            {/* Left sidebar */}
            <aside className="sf-sidebar">
              <div>
                <div className="sf-logo">
                  <div className="sf-logo-mark">
                    <img src="SmartFollow logo.png" alt="SF" />
                  </div>
                  <div className="sf-logo-text">SmartFollow CRM</div>
                </div>

                <nav className="sf-nav">
                  <button
                    className={'sf-nav-item ' + (currentView === 'dashboard' ? 'sf-nav-item-active' : '')}
                    onClick={() => setCurrentView('dashboard')}
                  >
                    <span className="sf-nav-item-icon">🏠</span>
                    <span>Dashboard</span>
                  </button>

                  <button
                    className={'sf-nav-item ' + (currentView === 'companies' ? 'sf-nav-item-active' : '')}
                    onClick={() => setCurrentView('companies')}
                  >
                    <span className="sf-nav-item-icon">🏢</span>
                    <span>Ettevõtted</span>
                  </button>

                  <button
                    className={'sf-nav-item ' + (currentView === 'contacts' ? 'sf-nav-item-active' : '')}
                    onClick={() => setCurrentView('contacts')}
                  >
                    <span className="sf-nav-item-icon">👤</span>
                    <span>Kontaktid</span>
                  </button>

                  <button
                    className={'sf-nav-item ' + (currentView === 'deals' ? 'sf-nav-item-active' : '')}
                    onClick={() => setCurrentView('deals')}
                  >
                    <span className="sf-nav-item-icon">💼</span>
                    <span>Tehingud</span>
                  </button>

                  <button
                    className={'sf-nav-item ' + (currentView === 'tasks-today' ? 'sf-nav-item-active' : '')}
                    onClick={() => setCurrentView('tasks-today')}
                  >
                    <span className="sf-nav-item-icon">✅</span>
                    <span>Ülesanded</span>
                  </button>

                  {user?.role === 'admin' && (
                    <button
                      className={'sf-nav-item ' + (currentView === 'admin-users' ? 'sf-nav-item-active' : '')}
                      onClick={() => setCurrentView('admin-users')}
                    >
                      <span className="sf-nav-item-icon">🛡️</span>
                      <span>Admin</span>
                    </button>
                  )}

                  <button
                    className={'sf-nav-item ' + (currentView === 'settings' ? 'sf-nav-item-active' : '')}
                    onClick={() => setCurrentView('settings')}
                  >
                    <span className="sf-nav-item-icon">⚙️</span>
                    <span>Seaded</span>
                  </button>
                </nav>
              </div>

                  <div className="sf-sidebar-footer">
                    <div>
                      <strong style={{color: 'var(--sf-primary)'}}>Versioon 1.6.5</strong> 🎉<br />
                      Kasutaja: {user?.username || 'Kasutaja'}
                    </div>
                
                <div className={`sf-plan-badge ${
                  user?.plan === 'PRO' ? 'plan-pro' : 
                  user?.plan === 'ENTERPRISE' ? 'plan-business' : 
                  user?.plan === 'STARTER' ? 'plan-starter' :
                  'plan-trial'
                }`}>
                  <span className="sf-plan-dot" />
                  <span>{user?.plan === 'TRIAL' ? 'Trial' : user?.plan || 'Trial'}</span>
                </div>

                <button className="sf-logout-btn" onClick={handleLogout}>
                  Logi välja
                </button>
              </div>
            </aside>

            {/* Main content */}
            <main className="sf-main">
              {currentView === 'dashboard' && (
                <Dashboard 
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
              {currentView === 'settings' && (
                <BillingPage />
              )}
            </main>

            {/* Right sidebar */}
            <aside className="sf-rightbar">
              <RightSidebar 
                user={user} 
                stats={reportsData}
                onNavigate={handleNavigate}
              />
            </aside>
          </div>
        </div>

        {/* Floating plan banner */}
        <PlanBanner />
      </div>
    </ErrorBoundary>
  );
};

export default App;