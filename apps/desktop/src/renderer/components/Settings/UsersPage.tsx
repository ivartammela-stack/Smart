/**
 * Users Page - Manage account users
 * For COMPANY_ADMIN: manage users in their account
 * For SUPER_ADMIN: manage users in selected account
 */

import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

interface User {
  id: number;
  username: string;
  email: string;
  role: 'SUPER_ADMIN' | 'COMPANY_ADMIN' | 'USER';
  plan: string;
  created_at: string;
}

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'USER' as 'USER' | 'COMPANY_ADMIN',
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/settings/users');
      setUsers(response.data || []);
      setError('');
    } catch (err: any) {
      console.error('Error loading users:', err);
      setError(err.message || 'Kasutajate laadimine ebaõnnestus');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post('/settings/users', formData);
      
      // Reset form
      setFormData({
        username: '',
        email: '',
        password: '',
        role: 'USER',
      });
      
      setShowCreateModal(false);
      await loadUsers(); // Reload list
      
      alert('Kasutaja loodud edukalt!');
    } catch (err: any) {
      alert(err.message || 'Kasutaja loomine ebaõnnestus');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('Kas oled kindel, et soovid selle kasutaja kustutada?')) {
      return;
    }

    try {
      await api.delete(`/settings/users/${userId}`);
      await loadUsers();
      alert('Kasutaja kustutatud!');
    } catch (err: any) {
      alert(err.message || 'Kustutamine ebaõnnestus');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <h2>Laen kasutajaid...</h2>
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        flexShrink: 0,
        padding: 24,
        maxWidth: 1200,
        margin: '0 auto',
        width: '100%',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h1 style={{ marginBottom: 8 }}>Kasutajad</h1>
            <p style={{ color: '#666' }}>
              Halda oma ettevõtte kasutajaid ja õigusi
            </p>
          </div>
          
          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              padding: '12px 24px',
              background: '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: 16,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            + Lisa kasutaja
          </button>
        </div>

        {error && (
          <div style={{ 
            padding: 12, 
            background: '#fee', 
            color: '#dc2626', 
            borderRadius: 8,
            marginBottom: 16 
          }}>
            {error}
          </div>
        )}
      </div>

      {/* Scrollable Table */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '0 24px 24px 24px',
        maxWidth: 1200,
        margin: '0 auto',
        width: '100%',
      }}>
        <div style={{
          background: '#fff',
          borderRadius: 12,
          border: '1px solid #e5e7eb',
          overflow: 'hidden',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f9fafb' }}>
              <tr>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 14 }}>Nimi</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 14 }}>E-post</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 14 }}>Roll</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 14 }}>Pakett</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 14 }}>Loodud</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: '#6b7280', fontSize: 14 }}>Tegevused</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: 32, textAlign: 'center', color: '#9ca3af' }}>
                    Kasutajaid ei leitud. Lisa esimene!
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} style={{ borderTop: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '12px 16px' }}>{user.username}</td>
                    <td style={{ padding: '12px 16px', color: '#6b7280' }}>{user.email}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: 12,
                        fontSize: 12,
                        fontWeight: 600,
                        background: user.role === 'COMPANY_ADMIN' ? '#ede9fe' : '#f1f5f9',
                        color: user.role === 'COMPANY_ADMIN' ? '#7c3aed' : '#64748b',
                      }}>
                        {user.role === 'COMPANY_ADMIN' ? 'Admin' : user.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Kasutaja'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', fontSize: 14, color: '#6b7280' }}>{user.plan}</td>
                    <td style={{ padding: '12px 16px', fontSize: 14, color: '#9ca3af' }}>
                      {new Date(user.created_at).toLocaleDateString('et-EE')}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      {user.role !== 'SUPER_ADMIN' && (
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          style={{
                            padding: '6px 12px',
                            background: '#fee',
                            color: '#dc2626',
                            border: '1px solid #fca5a5',
                            borderRadius: 6,
                            fontSize: 13,
                            cursor: 'pointer',
                          }}
                        >
                          Kustuta
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 16,
            padding: 32,
            maxWidth: 500,
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}>
            <h2 style={{ marginBottom: 24 }}>Lisa uus kasutaja</h2>
            
            <form onSubmit={handleCreateUser}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                  Nimi *
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: 8,
                    fontSize: 14,
                  }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                  E-post *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: 8,
                    fontSize: 14,
                  }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                  Parool *
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: 8,
                    fontSize: 14,
                  }}
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', marginBottom: 8, fontWeight: 600 }}>
                  Roll
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'USER' | 'COMPANY_ADMIN' })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '2px solid #e5e7eb',
                    borderRadius: 8,
                    fontSize: 14,
                  }}
                >
                  <option value="USER">Kasutaja</option>
                  <option value="COMPANY_ADMIN">Ettevõtte Admin</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setFormData({ username: '', email: '', password: '', role: 'USER' });
                  }}
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    background: '#f3f4f6',
                    color: '#374151',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Tühista
                </button>
                
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '12px 24px',
                    background: '#3b82f6',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
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

export default UsersPage;

