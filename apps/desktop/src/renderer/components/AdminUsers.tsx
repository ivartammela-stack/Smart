import React, { useState, useEffect } from 'react';
import api from '../utils/api';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  plan: string;
  created_at: string;
  updated_at: string;
}

interface AdminUsersProps {
  onBack: () => void;
}

type Plan = 'FREE' | 'STARTER' | 'PRO' | 'ENTERPRISE';

const PLAN_OPTIONS: { value: Plan; label: string }[] = [
  { value: 'FREE', label: 'Tasuta' },
  { value: 'STARTER', label: 'Starter' },
  { value: 'PRO', label: 'Pro' },
  { value: 'ENTERPRISE', label: 'Enterprise' },
];

const AdminUsers: React.FC<AdminUsersProps> = ({ onBack }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', email: '', role: 'user' });
  const [temporaryPassword, setTemporaryPassword] = useState('');
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [userToResetPassword, setUserToResetPassword] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await api.get('/admin/users');
      setUsers(data.users || []);
      setError('');
    } catch (err) {
      setError('Kasutajate laadimine ebaõnnestus');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setTemporaryPassword('');

    try {
      const data = await api.post('/admin/users', newUser);
      
      if (data.success && data.temporaryPassword) {
        setTemporaryPassword(data.temporaryPassword);
        // Reset form
        setNewUser({ username: '', email: '', role: 'user' });
        // Refresh users list
        fetchUsers();
      }
    } catch (err) {
      setError('Kasutaja loomine ebaõnnestus');
      console.error(err);
    }
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setTemporaryPassword('');
    setNewUser({ username: '', email: '', role: 'user' });
    setError('');
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      await api.delete(`/admin/users/${userToDelete.id}`);
      setUserToDelete(null);
      fetchUsers(); // Refresh list
    } catch (err) {
      setError('Kasutaja kustutamine ebaõnnestus');
      console.error(err);
    }
  };

  const handleResetPassword = async () => {
    if (!userToResetPassword) return;

    try {
      const data = await api.put(`/admin/users/${userToResetPassword.id}/reset-password`, {});
      if (data.success && data.temporaryPassword) {
        setTemporaryPassword(data.temporaryPassword);
      }
    } catch (err) {
      setError('Parooli lähtestamine ebaõnnestus');
      console.error(err);
    }
  };

  const handleChangePlan = async (userId: number, plan: Plan) => {
    try {
      await api.put(`/admin/users/${userId}/plan`, { plan });
      fetchUsers(); // Refresh list
    } catch (err) {
      setError('Paketi uuendamine ebaõnnestus');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="loading-container"><p>Kasutajate laadimine...</p></div>;
  }

  return (
    <div className="admin-users-container">
      <header className="page-header">
        <button onClick={onBack} className="btn-back">← Tagasi Dashboardile</button>
        <h1>⚙️ Kasutajate haldus</h1>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="admin-actions">
        <button 
          onClick={() => setShowCreateModal(true)} 
          className="btn-primary"
        >
          + Lisa uus kasutaja
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Kasutajanimi</th>
              <th>E-mail</th>
              <th>Roll</th>
              <th>Pakett</th>
              <th>Loodud</th>
              <th>Toimingud</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={7} className="empty-state">
                  Kasutajaid ei leitud.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge role-${user.role}`}>
                      {user.role === 'admin' ? '👑 Admin' : '👤 Kasutaja'}
                    </span>
                  </td>
                  <td>
                    <select
                      value={user.plan || 'FREE'}
                      onChange={(e) => handleChangePlan(user.id, e.target.value as Plan)}
                      style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        background: '#ffffff',
                        fontSize: '13px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        color: user.plan === 'PRO' ? '#7c3aed' : user.plan === 'ENTERPRISE' ? '#b45309' : user.plan === 'STARTER' ? '#0369a1' : '#475569',
                      }}
                    >
                      {PLAN_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>{new Date(user.created_at).toLocaleString('et-EE')}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button
                        onClick={() => setUserToResetPassword(user)}
                        className="btn-icon"
                        title="Lähtesta parool"
                        style={{ 
                          background: '#f0f0f0', 
                          border: 'none', 
                          borderRadius: '6px', 
                          padding: '8px 12px',
                          cursor: 'pointer',
                          fontSize: '18px'
                        }}
                      >
                        🔑
                      </button>
                      <button
                        onClick={() => setUserToDelete(user)}
                        className="btn-icon btn-icon-danger"
                        title="Kustuta kasutaja"
                        style={{ 
                          background: '#fee', 
                          border: 'none', 
                          borderRadius: '6px', 
                          padding: '8px 12px',
                          cursor: 'pointer',
                          fontSize: '18px',
                          color: '#dc3545'
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="modal-overlay" onClick={() => setUserToDelete(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>⚠️ Kustuta kasutaja</h2>
            <p>
              Kas oled kindel, et soovid kustutada kasutaja <strong>{userToDelete.username}</strong> ({userToDelete.email})?
            </p>
            <p className="warning-text">
              Seda toimingut ei saa tagasi võtta!
            </p>
            <div className="form-actions">
              <button onClick={handleDeleteUser} className="btn-danger">
                🗑️ Jah, kustuta
              </button>
              <button onClick={() => setUserToDelete(null)} className="btn-secondary">
                Tühista
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Password Modal */}
      {userToResetPassword && (
        <div className="modal-overlay" onClick={() => { setUserToResetPassword(null); setTemporaryPassword(''); }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>🔑 Lähtesta parool</h2>
            
            {temporaryPassword ? (
              <div className="temp-password-display">
                <div className="success-message">
                  ✅ Parool lähtest edukalt kasutajale: <strong>{userToResetPassword.username}</strong>
                </div>
                <div className="temp-password-box">
                  <p><strong>Uus ajutine parool:</strong></p>
                  <div className="password-value">{temporaryPassword}</div>
                  <p className="warning-text">
                    ⚠️ Kopeeri see parool ja anna kasutajale. Seda ei kuvata uuesti!
                  </p>
                  <button 
                    onClick={() => navigator.clipboard.writeText(temporaryPassword)}
                    className="btn-secondary"
                  >
                    📋 Kopeeri parool
                  </button>
                </div>
                <button 
                  onClick={() => { setUserToResetPassword(null); setTemporaryPassword(''); }} 
                  className="btn-primary"
                >
                  Sulge
                </button>
              </div>
            ) : (
              <>
                <p>
                  Kas oled kindel, et soovid lähtestada parooli kasutajale <strong>{userToResetPassword.username}</strong> ({userToResetPassword.email})?
                </p>
                <p className="info-text">
                  Genereeritakse uus ajutine parool, mille saad kasutajale edastada.
                </p>
                <div className="form-actions">
                  <button onClick={handleResetPassword} className="btn-primary">
                    🔑 Lähtesta parool
                  </button>
                  <button onClick={() => setUserToResetPassword(null)} className="btn-secondary">
                    Tühista
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Lisa uus kasutaja</h2>
            
            {temporaryPassword ? (
              <div className="temp-password-display">
                <div className="success-message">
                  ✅ Kasutaja loodud edukalt!
                </div>
                <div className="temp-password-box">
                  <p><strong>Ajutine parool:</strong></p>
                  <div className="password-value">{temporaryPassword}</div>
                  <p className="warning-text">
                    ⚠️ Kopeeri see parool ja anna kasutajale. Seda ei kuvata uuesti!
                  </p>
                  <button 
                    onClick={() => navigator.clipboard.writeText(temporaryPassword)}
                    className="btn-secondary"
                  >
                    📋 Kopeeri parool
                  </button>
                </div>
                <button onClick={handleCloseModal} className="btn-primary">
                  Sulge
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateUser}>
                <div className="form-group">
                  <label htmlFor="username">Kasutajanimi *</label>
                  <input
                    type="text"
                    id="username"
                    value={newUser.username}
                    onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                    required
                    autoFocus
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">E-mail *</label>
                  <input
                    type="email"
                    id="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="role">Roll</label>
                  <select
                    id="role"
                    value={newUser.role}
                    onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  >
                    <option value="user">Tavakasutaja</option>
                    <option value="admin">Administraator</option>
                  </select>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary">
                    Loo kasutaja
                  </button>
                  <button 
                    type="button" 
                    onClick={handleCloseModal} 
                    className="btn-secondary"
                  >
                    Tühista
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;


