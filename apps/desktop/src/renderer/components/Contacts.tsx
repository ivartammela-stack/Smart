import React, { useState, useEffect } from 'react';
import api from '../utils/api';

interface Contact {
  id: number;
  company_id: number;
  first_name: string;
  last_name: string;
  position?: string;
  phone?: string;
  email?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface Company {
  id: number;
  name: string;
}

interface ContactsProps {
  onBack: () => void;
}

const Contacts: React.FC<ContactsProps> = ({ onBack }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  
  const [formData, setFormData] = useState({
    company_id: '',
    first_name: '',
    last_name: '',
    position: '',
    phone: '',
    email: '',
    notes: '',
  });

  useEffect(() => {
    fetchContacts();
    fetchCompanies();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/contacts');
      setContacts(response.data || []);
      setError('');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Viga kontaktide laadimisel';
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
      };
      
      if (editingContact) {
        await api.put(`/contacts/${editingContact.id}`, data);
      } else {
        await api.post('/contacts', data);
      }
      
      setShowModal(false);
      resetForm();
      fetchContacts();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Viga salvestamisel';
      setError(message);
    }
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setFormData({
      company_id: contact.company_id.toString(),
      first_name: contact.first_name,
      last_name: contact.last_name,
      position: contact.position || '',
      phone: contact.phone || '',
      email: contact.email || '',
      notes: contact.notes || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Kas oled kindel, et soovid kontakti kustutada?')) return;
    
    try {
      await api.delete(`/contacts/${id}`);
      fetchContacts();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Viga kustutamisel';
      setError(message);
    }
  };

  const resetForm = () => {
    setFormData({
      company_id: '',
      first_name: '',
      last_name: '',
      position: '',
      phone: '',
      email: '',
      notes: '',
    });
    setEditingContact(null);
  };

  const getCompanyName = (companyId: number): string => {
    const company = companies.find(c => c.id === companyId);
    return company ? company.name : 'Teadmata';
  };

  return (
    <div className="sf-page">
      <div className="sf-header">
        <button onClick={onBack} className="sf-back-button">← Tagasi</button>
        <h1>Kontaktid</h1>
        <p>Halda kontaktisikuid ettevõtetes</p>
      </div>

      <div className="sf-actions">
        <button onClick={() => setShowModal(true)} className="sf-btn sf-btn-primary">
          + Lisa uus kontakt
        </button>
      </div>

      {error && <div className="sf-error">{error}</div>}

      {loading ? (
        <div className="sf-loading">Laadimine...</div>
      ) : (
        <div className="sf-table-container">
          {contacts.length === 0 ? (
            <div className="sf-empty-state">
              <p>Kontakte pole veel lisatud.</p>
              <button onClick={() => setShowModal(true)} className="sf-btn sf-btn-primary">
                Lisa esimene kontakt
              </button>
            </div>
          ) : (
            <table className="sf-table">
              <thead>
                <tr>
                  <th>NIMI</th>
                  <th>ETTEVÕTE</th>
                  <th>AMET</th>
                  <th>TELEFON</th>
                  <th>E-MAIL</th>
                  <th>TEGEVUSED</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((contact) => (
                  <tr key={contact.id}>
                    <td>{contact.first_name} {contact.last_name}</td>
                    <td>{getCompanyName(contact.company_id)}</td>
                    <td>{contact.position || '-'}</td>
                    <td>{contact.phone || '-'}</td>
                    <td>{contact.email || '-'}</td>
                    <td className="sf-actions-cell">
                      <button onClick={() => handleEdit(contact)} className="sf-btn sf-btn-sm">
                        Muuda
                      </button>
                      <button onClick={() => handleDelete(contact.id)} className="sf-btn sf-btn-sm sf-btn-danger">
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
              <h2>{editingContact ? 'Muuda kontakti' : 'Lisa uus kontakt'}</h2>
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

              <div className="sf-form-row">
                <div className="sf-form-group">
                  <label>Eesnimi *</label>
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                    required
                  />
                </div>
                <div className="sf-form-group">
                  <label>Perekonnanimi *</label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="sf-form-group">
                <label>Amet</label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData({...formData, position: e.target.value})}
                />
              </div>

              <div className="sf-form-row">
                <div className="sf-form-group">
                  <label>Telefon</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div className="sf-form-group">
                  <label>E-mail</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
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
                  {editingContact ? 'Salvesta' : 'Lisa kontakt'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts;
