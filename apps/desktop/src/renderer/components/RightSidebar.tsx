import React from 'react';
import type { ReportsData } from '../types/reports';

type View = 'dashboard' | 'companies' | 'contacts' | 'deals' | 'tasks-today' | 'admin-users';

interface User {
  id?: number;
  username?: string;
  email?: string;
  role?: string;
}

interface RightSidebarProps {
  user: User;
  stats: ReportsData | null;
  onNavigate: (view: View) => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ user, stats, onNavigate }) => {
  const initials = user?.username?.[0]?.toUpperCase() || 'S';

  return (
    <>
      <div className="right-profile-card">
        <div className="right-avatar">{initials}</div>
        <div className="right-name">{user?.username || 'Kasutaja'}</div>
        <div className="right-role">
          {user?.role === 'admin' ? 'Administraator' : 'SmartFollow kasutaja'}
        </div>
        <div className="right-location">CRM versioon 1.6.0</div>
      </div>

      <div>
        <div className="right-block-title">Fookuses olevad tehingud</div>
        <div 
          className="right-job-card primary"
          onClick={() => onNavigate('deals')}
        >
          <div className="right-job-title">Aktiivsed tehingud</div>
          <div className="right-job-meta">
            {stats?.totals?.deals || 0} aktiivset tehingut kokku.
          </div>
        </div>
        <div 
          className="right-job-card secondary"
          onClick={() => onNavigate('tasks-today')}
        >
          <div className="right-job-title">Täna tähtajaga ülesanded</div>
          <div className="right-job-meta">
            {stats?.tasks?.today?.total || 0} ülesannet · {stats?.tasks?.today?.completed || 0} valmis
          </div>
        </div>
      </div>

      <div className="reminders-card">
        <div className="right-block-title">Meeldetuletused</div>
        <div className="reminder-row">
          <span className="reminder-text">
            Kontrolli tänased ülesanded
          </span>
          <span className="reminder-time">Täna</span>
        </div>
        <div className="reminder-row">
          <span className="reminder-text">
            Vaata üle avatud tehingud
          </span>
          <span className="reminder-time">Sel nädalal</span>
        </div>
        <div className="reminder-row">
          <span className="reminder-text">
            Uuenda kontaktide andmeid
          </span>
          <span className="reminder-time">Järgmine kuu</span>
        </div>
      </div>
    </>
  );
};

export default RightSidebar;

