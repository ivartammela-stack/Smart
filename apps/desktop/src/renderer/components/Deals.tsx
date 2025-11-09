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
    
    // Check if there's a filter from Dashboard
    const savedFilter = localStorage.getItem('dealsFilter');
    if (savedFilter && (savedFilter === 'new' || savedFilter === 'won' || savedFilter === 'lost')) {
      setStatusFilter(savedFilter as DealStatus);
      localStorage.removeItem('dealsFilter'); // Clear after reading
    } else if (savedFilter === 'all') {
      setStatusFilter('all');
      localStorage.removeItem('dealsFilter');
    }
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


  const filteredDeals = deals.filter(d => {
    if (statusFilter === 'all') return true;
    return d.status === statusFilter;
  });

  if (loading) {
    return <div className="loading-container"><p>Tehingute laadimine...</p></div>;
  }

  return (
    <div className="deals-container">
      <div className="deals-layout">
        {/* Header */}
        <div className="deals-header">
          <div className="deals-title-block">
            <button onClick={onBack} className="sf-ghost-button" style={{alignSelf: 'flex-start', marginBottom: '8px'}}>
              ← Tagasi
            </button>
            <h1 className="deals-title">💼 Tehingud</h1>
            <p className="deals-subtitle">
              Halda müügitehinguid ja jälgi nende staatust (Uus, Võidetud, Kaotatud).
            </p>
          </div>

          <div className="deals-filters">
            <button
              className={statusFilter === 'all' ? 'filter-chip filter-chip-active' : 'filter-chip'}
              onClick={() => setStatusFilter('all')}
            >
              Kõik
            </button>
            <button
              className={statusFilter === 'new' ? 'filter-chip filter-chip-active' : 'filter-chip'}
              onClick={() => setStatusFilter('new')}
            >
              Uus
            </button>
            <button
              className={statusFilter === 'won' ? 'filter-chip filter-chip-active' : 'filter-chip'}
              onClick={() => setStatusFilter('won')}
            >
              Võidetud
            </button>
            <button
              className={statusFilter === 'lost' ? 'filter-chip filter-chip-active' : 'filter-chip'}
              onClick={() => setStatusFilter('lost')}
            >
              Kaotatud
            </button>
            <button 
              onClick={() => setShowModal(true)} 
              className="filter-chip"
              style={{background: 'var(--sf-primary)', borderColor: 'var(--sf-primary)', color: 'white'}}
            >
              + Lisa uus
            </button>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {/* Deals table */}
        <div className="deals-card">
          <table className="deals-table">
          <thead>
            <tr>
              <th>Tehing</th>
              <th>Ettevõte</th>
              <th className="align-right">Summa</th>
              <th>Staatus</th>
              <th className="deals-actions-cell">Tegevused</th>
            </tr>
          </thead>
          <tbody>
            {filteredDeals.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty-state">
                  {statusFilter === 'all' 
                    ? 'Tehinguid pole veel lisatud. Lisa esimene! 💼'
                    : `Staatusega "${statusFilter === 'new' ? 'Uus' : statusFilter === 'won' ? 'Võidetud' : 'Kaotatud'}" tehinguid ei leitud.`}
                </td>
              </tr>
            ) : (
              filteredDeals.map((deal) => (
                <tr 
                  key={deal.id}
                  onClick={(e) => {
                    if ((e.target as HTMLElement).closest('button')) return;
                    handleEdit(deal);
                  }}
                  style={{ cursor: 'pointer' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <td>
                    <div className="deal-title">{deal.title}</div>
                    {deal.notes && (
                      <div className="deal-notes">{deal.notes}</div>
                    )}
                  </td>
                  <td>
                    <div className="deals-pill">
                      <span className="deals-pill-dot" />
                      <span>{getCompanyName(deal.company_id)}</span>
                    </div>
                  </td>
                  <td className="align-right">
                    <div className="deal-value">
                      {deal.value.toLocaleString('et-EE', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })} €
                    </div>
                  </td>
                  <td>
                    <span className={`deals-status-pill deals-status-${deal.status}`}>
                      {deal.status === 'new' && '🔵 Uus'}
                      {deal.status === 'won' && '✅ Võidetud'}
                      {deal.status === 'lost' && '❌ Kaotatud'}
                    </span>
                  </td>
                  <td className="deals-actions-cell">
                    <button
                      className="deals-action-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(deal);
                      }}
                    >
                      Muuda
                    </button>
                    <button
                      className="deals-action-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(deal.id);
                      }}
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

