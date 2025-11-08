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
  created_at: string;
  updated_at: string;
}

interface CompaniesProps {
  onBack: () => void;
}

const Companies: React.FC<CompaniesProps> = ({ onBack }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
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
      setCompanies(response.data || []);
      setError('');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Viga ettevõtete laadimisel';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingCompany) {
        await api.put(`/companies/${editingCompany.id}`, formData);
      } else {
        await api.post('/companies', formData);
      }
      
      setShowModal(false);
      resetForm();
      fetchCompanies();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Viga salvest';
      setError(message);
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
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Kas oled kindel, et soovid ettevõtte kustutada?')) return;
    
    try {
      await api.delete(`/companies/${id}`);
      fetchCompanies();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Viga kustutamisel';
      setError(message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      registration_code: '',
      phone: '',
      email: '',
      address: '',
      notes: '',
    });
    setEditingCompany(null);
  };

  const handleModalClose = () => {
    setShowModal(false);
    resetForm();
  };

  return (
    <div className="sf-page">
      <div className="sf-header">
        <button onClick={onBack} className="sf-back-button">
          ← Tagasi
        </button>
        <h1>Ettevõtted</h1>
        <p>Halda oma kliente ja partnereid</p>
      </div>

      <div className="sf-actions">
        <button 
          onClick={() => setShowModal(true)} 
          className="sf-btn sf-btn-primary"
        >
          + Lisa uus ettevõte
        </button>
      </div>

      {error && <div className="sf-error">{error}</div>}

      {loading ? (
        <div className="sf-loading">Laadimine...</div>
      ) : (
        <div className="sf-table-container">
          {companies.length === 0 ? (
            <div className="sf-empty-state">
              <p>Ettevõtteid pole veel lisatud.</p>
              <button onClick={() => setShowModal(true)} className="sf-btn sf-btn-primary">
                Lisa esimene ettevõte
              </button>
            </div>
          ) : (
            <table className="sf-table">
              <thead>
                <tr>
                  <th>NIMI</th>
                  <th>REG. KOOD</th>
                  <th>TELEFON</th>
                  <th>E-MAIL</th>
                  <th>AADRESS</th>
                  <th>TEGEVUSED</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company) => (
                  <tr key={company.id}>
                    <td>{company.name}</td>
                    <td>{company.registration_code}</td>
                    <td>{company.phone || '-'}</td>
                    <td>{company.email || '-'}</td>
                    <td>{company.address || '-'}</td>
                    <td className="sf-actions-cell">
                      <button 
                        onClick={() => handleEdit(company)} 
                        className="sf-btn sf-btn-sm"
                      >
                        Muuda
                      </button>
                      <button 
                        onClick={() => handleDelete(company.id)} 
                        className="sf-btn sf-btn-sm sf-btn-danger"
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
        <div className="sf-modal-overlay" onClick={handleModalClose}>
          <div className="sf-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sf-modal-header">
              <h2>{editingCompany ? 'Muuda ettevõtet' : 'Lisa uus ettevõte'}</h2>
              <button onClick={handleModalClose} className="sf-modal-close">×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="sf-form">
              <div className="sf-form-group">
                <label htmlFor="name">Ettevõtte nimi *</label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div className="sf-form-group">
                <label htmlFor="registration_code">Registrikood *</label>
                <input
                  id="registration_code"
                  type="text"
                  value={formData.registration_code}
                  onChange={(e) => setFormData({...formData, registration_code: e.target.value})}
                  required
                />
              </div>

              <div className="sf-form-group">
                <label htmlFor="phone">Telefon</label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>

              <div className="sf-form-group">
                <label htmlFor="email">E-mail</label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="sf-form-group">
                <label htmlFor="address">Aadress</label>
                <textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="sf-form-group">
                <label htmlFor="notes">Märkused</label>
                <textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={4}
                />
              </div>

              <div className="sf-form-actions">
                <button type="button" onClick={handleModalClose} className="sf-btn sf-btn-secondary">
                  Tühista
                </button>
                <button type="submit" className="sf-btn sf-btn-primary">
                  {editingCompany ? 'Salvesta' : 'Lisa ettevõte'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Companies;
