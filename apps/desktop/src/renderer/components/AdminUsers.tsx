import React, { useState, useEffect } from 'react';
import api from '../utils/api';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  plan?: string;
  created_at: string;
  updated_at: string;
}

interface AdminUsersProps {
  onBack: () => void;
}

const AdminUsers: React.FC<AdminUsersProps> = ({ onBack }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'user',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/users');
      setUsers(response.users || []);
      setError('');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Viga kasutajate laadimisel';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await api.post('/admin/users', formData);
      setShowModal(false);
      resetForm();
      fetchUsers();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Viga kasutaja loomisel';
      setError(message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Kas oled kindel, et soovid kasutaja kustutada?')) return;
    
    try {
      await api.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Viga kustutamisel';
      setError(message);
    }
  };

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      role: 'user',
    });
  };

  const getRoleBadgeClass = (role: string): string => {
    return role === 'admin' ? 'sf-badge-admin' : 'sf-badge-user';
  };

  return (
    <div className="sf-page">
      <div className="sf-header">
        <button onClick={onBack} className="sf-back-button">← Tagasi</button>
        <h1>Kasutajate haldus</h1>
        <p>Halda CRM kasutajaid ja õiguseid</p>
      </div>

      <div className="sf-actions">
        <button onClick={() => setShowModal(true)} className="sf-btn sf-btn-primary">
          + Lisa uus kasutaja
        </button>
      </div>

      {error && <div className="sf-error">{error}</div>}

      {loading ? (
        <div className="sf-loading">Laadimine...</div>
      ) : (
        <div className="sf-table-container">
          {users.length === 0 ? (
            <div className="sf-empty-state">
              <p>Kasutajaid pole veel lisatud.</p>
            </div>
          ) : (
            <table className="sf-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>KASUTAJANIMI</th>
                  <th>E-MAIL</th>
                  <th>ROLL</th>
                  <th>PLAAN</th>
                  <th>LOODUD</th>
                  <th>TEGEVUSED</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`sf-badge ${getRoleBadgeClass(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>{user.plan || 'FREE'}</td>
                    <td>{new Date(user.created_at).toLocaleDateString('et-EE')}</td>
                    <td className="sf-actions-cell">
                      <button 
                        onClick={() => handleDelete(user.id)} 
                        className="sf-btn sf-btn-sm sf-btn-danger"
                        disabled={user.id === 1} // Can't delete first admin
                      >
                        Kustuta
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {showModal && (
        <div className="sf-modal-overlay" onClick={() => { setShowModal(false); resetForm(); }}>
          <div className="sf-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sf-modal-header">
              <h2>Lisa uus kasutaja</h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="sf-modal-close">×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="sf-form">
              <div className="sf-form-group">
                <label>Kasutajanimi *</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  required
                />
              </div>

              <div className="sf-form-group">
                <label>E-mail *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>

              <div className="sf-form-group">
                <label>Roll *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  required
                >
                  <option value="user">Kasutaja</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="sf-info-box">
                ℹ️ Ajutine parool saadetakse kasutajale e-mailile.
              </div>

              <div className="sf-form-actions">
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="sf-btn sf-btn-secondary">
                  Tühista
                </button>
                <button type="submit" className="sf-btn sf-btn-primary">
                  Lisa kasutaja
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
