import React, { useState, useEffect } from 'react';
import api from '../utils/api';

interface Deal {
  id: number;
  company_id: number;
  title: string;
  value: number;
  status: string;
  notes?: string;
  created_by?: number;
  created_at: string;
  updated_at: string;
}

interface Company {
  id: number;
  name: string;
}

interface DealsProps {
  onBack: () => void;
}

const STATUS_LABELS: Record<string, string> = {
  'new': 'Uus',
  'offer': 'Pakkumine',
  'won': 'Võidetud',
  'lost': 'Kaotatud',
};

const Deals: React.FC<DealsProps> = ({ onBack }) => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  
  const [formData, setFormData] = useState({
    company_id: '',
    title: '',
    value: '',
    status: 'new',
    notes: '',
  });

  useEffect(() => {
    fetchDeals();
    fetchCompanies();
  }, []);

  const fetchDeals = async () => {
    try {
      setLoading(true);
      const response = await api.get('/deals');
      setDeals(response.data || []);
      setError('');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Viga tehingute laadimisel';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await api.get('/companies');
      setCompanies(response.data || []);
    } catch (err) {
      console.error('Viga ettevõtete laadimisel:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const data = {
        ...formData,
        company_id: parseInt(formData.company_id),
        value: parseFloat(formData.value) || 0,
      };
      
      if (editingDeal) {
        await api.put(`/deals/${editingDeal.id}`, data);
      } else {
        await api.post('/deals', data);
      }
      
      setShowModal(false);
      resetForm();
      fetchDeals();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Viga salvestamisel';
      setError(message);
    }
  };

  const handleEdit = (deal: Deal) => {
    setEditingDeal(deal);
    setFormData({
      company_id: deal.company_id.toString(),
      title: deal.title,
      value: deal.value.toString(),
      status: deal.status,
      notes: deal.notes || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Kas oled kindel, et soovid tehingu kustutada?')) return;
    
    try {
      await api.delete(`/deals/${id}`);
      fetchDeals();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Viga kustutamisel';
      setError(message);
    }
  };

  const resetForm = () => {
    setFormData({
      company_id: '',
      title: '',
      value: '',
      status: 'new',
      notes: '',
    });
    setEditingDeal(null);
  };

  const getCompanyName = (companyId: number): string => {
    const company = companies.find(c => c.id === companyId);
    return company ? company.name : 'Teadmata';
  };

  const getStatusClass = (status: string): string => {
    const classes: Record<string, string> = {
      'new': 'sf-status-new',
      'offer': 'sf-status-offer',
      'won': 'sf-status-won',
      'lost': 'sf-status-lost',
    };
    return classes[status] || '';
  };

  return (
    <div className="sf-page">
      <div className="sf-header">
        <button onClick={onBack} className="sf-back-button">← Tagasi</button>
        <h1>Tehingud</h1>
        <p>Halda müügivõimalusi ja tehinguid</p>
      </div>

      <div className="sf-actions">
        <button onClick={() => setShowModal(true)} className="sf-btn sf-btn-primary">
          + Lisa uus tehing
        </button>
      </div>

      {error && <div className="sf-error">{error}</div>}

      {loading ? (
        <div className="sf-loading">Laadimine...</div>
      ) : (
        <div className="sf-table-container">
          {deals.length === 0 ? (
            <div className="sf-empty-state">
              <p>Tehinguid pole veel lisatud.</p>
              <button onClick={() => setShowModal(true)} className="sf-btn sf-btn-primary">
                Lisa esimene tehing
              </button>
            </div>
          ) : (
            <table className="sf-table">
              <thead>
                <tr>
                  <th>PEALKIRI</th>
                  <th>ETTEVÕTE</th>
                  <th>VÄÄRTUS</th>
                  <th>STAATUS</th>
                  <th>TEGEVUSED</th>
                </tr>
              </thead>
              <tbody>
                {deals.map((deal) => (
                  <tr key={deal.id}>
                    <td>{deal.title}</td>
                    <td>{getCompanyName(deal.company_id)}</td>
                    <td>{deal.value.toFixed(2)} €</td>
                    <td>
                      <span className={`sf-status-badge ${getStatusClass(deal.status)}`}>
                        {STATUS_LABELS[deal.status] || deal.status}
                      </span>
                    </td>
                    <td className="sf-actions-cell">
                      <button onClick={() => handleEdit(deal)} className="sf-btn sf-btn-sm">
                        Muuda
                      </button>
                      <button onClick={() => handleDelete(deal.id)} className="sf-btn sf-btn-sm sf-btn-danger">
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
              <h2>{editingDeal ? 'Muuda tehingut' : 'Lisa uus tehing'}</h2>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="sf-modal-close">×</button>
            </div>
            
            <form onSubmit={handleSubmit} className="sf-form">
              <div className="sf-form-group">
                <label>Ettevõte *</label>
                <select
                  value={formData.company_id}
                  onChange={(e) => setFormData({...formData, company_id: e.target.value})}
                  required
                >
                  <option value="">Vali ettevõte...</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>{company.name}</option>
                  ))}
                </select>
              </div>

              <div className="sf-form-group">
                <label>Tehingu pealkiri *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>

              <div className="sf-form-row">
                <div className="sf-form-group">
                  <label>Väärtus (€) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.value}
                    onChange={(e) => setFormData({...formData, value: e.target.value})}
                    required
                  />
                </div>
                <div className="sf-form-group">
                  <label>Staatus *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    required
                  >
                    <option value="new">Uus</option>
                    <option value="offer">Pakkumine</option>
                    <option value="won">Võidetud</option>
                    <option value="lost">Kaotatud</option>
                  </select>
                </div>
              </div>

              <div className="sf-form-group">
                <label>Märkused</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={4}
                />
              </div>

              <div className="sf-form-actions">
                <button type="button" onClick={() => { setShowModal(false); resetForm(); }} className="sf-btn sf-btn-secondary">
                  Tühista
                </button>
                <button type="submit" className="sf-btn sf-btn-primary">
                  {editingDeal ? 'Salvesta' : 'Lisa tehing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Deals;
