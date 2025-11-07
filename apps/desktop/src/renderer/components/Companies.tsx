import React, { useState, useEffect } from 'react';
import api from '../utils/api';

interface Company {
  id: number;
  name: string;
  registration_code: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
  created_by?: number;
  createdAt: string;
  updatedAt: string;
}

interface CompaniesProps {
  onBack: () => void;
}

const Companies: React.FC<CompaniesProps> = ({ onBack }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    registration_code: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const response = await api.get('/companies');
      // Backend returns: { success: true, count: N, data: [...] }
      const companiesList = response.data || [];
      setCompanies(companiesList);
      setError('');
    } catch (err) {
      console.error('Error fetching companies:', err);
      setError('Ettevõtete laadimine ebaõnnestus');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCompany) {
        // Update existing
        await api.put(`/companies/${editingCompany.id}`, formData);
      } else {
        // Create new
        await api.post('/companies', formData);
      }
      
      // Reset form and refresh list
      setFormData({
        name: '',
        registration_code: '',
        phone: '',
        email: '',
        address: '',
        notes: '',
      });
      setShowForm(false);
      setEditingCompany(null);
      fetchCompanies();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Salvestamine ebaõnnestus');
    }
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setFormData({
      name: company.name,
      registration_code: company.registration_code,
      phone: company.phone || '',
      email: company.email || '',
      address: company.address || '',
      notes: company.notes || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Kas oled kindel, et soovid selle ettevõtte kustutada?')) {
      return;
    }

    try {
      await api.delete(`/companies/${id}`);
      fetchCompanies();
    } catch (err) {
      setError('Kustutamine ebaõnnestus');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCompany(null);
    setFormData({
      name: '',
      registration_code: '',
      phone: '',
      email: '',
      address: '',
      notes: '',
    });
  };

  if (loading) {
    return <div className="loading-container">Laadimine...</div>;
  }

  return (
    <div className="companies-container">
      <div className="companies-layout">
        <div className="companies-header">
          <div className="companies-title-block">
            <button onClick={onBack} className="sf-ghost-button" style={{alignSelf: 'flex-start', marginBottom: '8px'}}>
              ← Tagasi
            </button>
            <h1 className="companies-title">🏢 Ettevõtted</h1>
            <p className="companies-subtitle">
              Halda ettevõtteid, nende kontaktandmeid ja suhteid.
            </p>
          </div>

          {!showForm && (
            <button 
              onClick={() => setShowForm(true)} 
              className="filter-chip"
              style={{background: 'var(--sf-primary)', borderColor: 'var(--sf-primary)', color: 'white'}}
            >
              + Lisa uus
            </button>
          )}
        </div>

        {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="form-container">
          <h2>{editingCompany ? 'Muuda ettevõtet' : 'Lisa uus ettevõte'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Nimi *</label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="registration_code">Registrikood *</label>
                <input
                  type="text"
                  id="registration_code"
                  value={formData.registration_code}
                  onChange={(e) => setFormData({ ...formData, registration_code: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Telefon</label>
                <input
                  type="text"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address">Aadress</label>
              <input
                type="text"
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label htmlFor="notes">Märkmed</label>
              <textarea
                id="notes"
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                {editingCompany ? 'Salvesta' : 'Lisa'}
              </button>
              <button type="button" onClick={handleCancel} className="btn-secondary">
                Tühista
              </button>
            </div>
          </form>
        </div>
      )}

        <div className="companies-card">
          <table className="companies-table">
            <thead>
              <tr>
                <th>Nimi</th>
                <th>Registrikood</th>
                <th>Telefon</th>
                <th>E-mail</th>
                <th className="companies-actions-cell">Tegevused</th>
              </tr>
            </thead>
            <tbody>
              {companies.length === 0 ? (
                <tr>
                  <td colSpan={5} className="empty-state">
                    Ühtegi ettevõtet ei leitud. Lisa esimene! 🏢
                  </td>
                </tr>
              ) : (
                companies.map((company) => (
                  <tr key={company.id}>
                    <td>
                      <div className="company-name">{company.name}</div>
                      {company.address && (
                        <div className="company-meta">{company.address}</div>
                      )}
                    </td>
                    <td><span className="company-code">{company.registration_code}</span></td>
                    <td><span className="company-meta">{company.phone || '—'}</span></td>
                    <td><span className="company-meta">{company.email || '—'}</span></td>
                    <td className="companies-actions-cell">
                      <button
                        onClick={() => handleEdit(company)}
                        className="companies-action-button"
                      >
                        Muuda
                      </button>
                      <button
                        onClick={() => handleDelete(company.id)}
                        className="companies-action-button"
                      >
                        Kustuta
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Companies;

