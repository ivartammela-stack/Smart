import React, { useState, useEffect } from 'react';
import api from '../utils/api';

type DealStatus = 'new' | 'won' | 'lost';

interface Deal {
  id: number;
  company_id: number;
  title: string;
  value: number;
  status: DealStatus;
  notes?: string;
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

const Deals: React.FC<DealsProps> = ({ onBack }) => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | DealStatus>('all');
  
  // Form state
  const [formData, setFormData] = useState({
    company_id: '',
    title: '',
    value: '',
    status: 'new' as DealStatus,
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
      const dealsList = response.data || response || [];
      setDeals(dealsList);
      setError('');
    } catch (err) {
      console.error('Error fetching deals:', err);
      setError('Tehingute laadimine ebaõnnestus');
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await api.get('/companies');
      const companiesList = response.data || [];
      setCompanies(companiesList);
    } catch (err) {
      console.error('❌ Error fetching companies:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const payload = {
        ...formData,
        company_id: parseInt(formData.company_id),
        value: parseFloat(formData.value),
      };

      if (editingDeal) {
        await api.put(`/deals/${editingDeal.id}`, payload);
      } else {
        await api.post('/deals', payload);
      }
      
      // Reset form and refresh list
      setFormData({
        company_id: '',
        title: '',
        value: '',
        status: 'new',
        notes: '',
      });
      setShowModal(false);
      setEditingDeal(null);
      fetchDeals();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Salvestamine ebaõnnestus');
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
    if (window.confirm('Oled kindel, et soovid selle tehingu kustutada?')) {
      try {
        await api.delete(`/deals/${id}`);
        fetchDeals();
      } catch (err) {
        setError('Kustutamine ebaõnnestus');
        console.error(err);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingDeal(null);
    setFormData({
      company_id: '',
      title: '',
      value: '',
      status: 'new',
      notes: '',
    });
    setError('');
  };

  const getCompanyName = (companyId: number) => {
    const company = companies.find(c => c.id === companyId);
    return company ? company.name : `ID: ${companyId}`;
  };

  const getStatusClass = (status: DealStatus) => {
    switch (status) {
      case 'new':
        return 'deal-status deal-status-new';
      case 'won':
        return 'deal-status deal-status-won';
      case 'lost':
        return 'deal-status deal-status-lost';
      default:
        return 'deal-status';
    }
  };

  const getStatusLabel = (status: DealStatus) => {
    switch (status) {
      case 'new':
        return '🔵 Uus';
      case 'won':
        return '✅ Võidetud';
      case 'lost':
        return '❌ Kaotatud';
    }
  };

  const filteredDeals = deals.filter(d => {
    if (statusFilter === 'all') return true;
    return d.status === statusFilter;
  });

  if (loading) {
    return <div className="loading-container"><p>Tehingute laadimine...</p></div>;
  }

  return (
    <div className="deals-container">
      <header className="page-header">
        <button onClick={onBack} className="btn-back">← Tagasi Dashboardile</button>
        <h1>💼 Tehingud</h1>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="page-actions">
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as any)}
          className="status-filter"
        >
          <option value="all">Kõik staatused</option>
          <option value="new">Uus</option>
          <option value="won">Võidetud</option>
          <option value="lost">Kaotatud</option>
        </select>

        <button 
          onClick={() => setShowModal(true)} 
          className="btn-primary"
        >
          + Lisa uus tehing
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Tehing</th>
              <th>Ettevõte</th>
              <th className="align-right">Summa (EUR)</th>
              <th>Staatus</th>
              <th>Tegevused</th>
            </tr>
          </thead>
          <tbody>
            {filteredDeals.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty-state">
                  Tehinguid ei leitud. Lisa esimene!
                </td>
              </tr>
            ) : (
              filteredDeals.map((deal) => (
                <tr key={deal.id}>
                  <td><strong>{deal.title}</strong></td>
                  <td>{getCompanyName(deal.company_id)}</td>
                  <td className="align-right">
                    {deal.value.toLocaleString('et-EE', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </td>
                  <td>
                    <span className={getStatusClass(deal.status)}>
                      {getStatusLabel(deal.status)}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button
                      className="btn-icon btn-edit"
                      onClick={() => handleEdit(deal)}
                      title="Muuda"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-icon btn-delete"
                      onClick={() => handleDelete(deal.id)}
                      title="Kustuta"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingDeal ? 'Muuda tehingut' : 'Lisa uus tehing'}</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="company_id">Ettevõte *</label>
                <select
                  id="company_id"
                  value={formData.company_id}
                  onChange={(e) => setFormData({ ...formData, company_id: e.target.value })}
                  required
                >
                  <option value="">Vali ettevõte...</option>
                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="title">Tehingu nimi *</label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  autoFocus
                  placeholder="nt Müügikokkulepe 2025"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="value">Summa (EUR) *</label>
                  <input
                    type="number"
                    id="value"
                    step="0.01"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    required
                    placeholder="1500.00"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="status">Staatus *</label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as DealStatus })}
                  >
                    <option value="new">Uus</option>
                    <option value="won">Võidetud</option>
                    <option value="lost">Kaotatud</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="notes">Märkmed</label>
                <textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  placeholder="Lisainfo..."
                ></textarea>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {editingDeal ? 'Salvesta muudatused' : 'Lisa tehing'}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleCloseModal}
                >
                  Tühista
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

