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
  
  // Form state
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
      const contactsList = response.data || response || [];
      setContacts(contactsList);
      setError('');
    } catch (err) {
      console.error('Error fetching contacts:', err);
      setError('Kontaktide laadimine ebaõnnestus');
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
      };

      if (editingContact) {
        await api.put(`/contacts/${editingContact.id}`, payload);
      } else {
        await api.post('/contacts', payload);
      }
      
      // Reset form and refresh list
      setFormData({
        company_id: '',
        first_name: '',
        last_name: '',
        position: '',
        phone: '',
        email: '',
        notes: '',
      });
      setShowModal(false);
      setEditingContact(null);
      fetchContacts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Salvestamine ebaõnnestus');
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
    if (window.confirm('Oled kindel, et soovid selle kontakti kustutada?')) {
      try {
        await api.delete(`/contacts/${id}`);
        fetchContacts();
      } catch (err) {
        setError('Kustutamine ebaõnnestus');
        console.error(err);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingContact(null);
    setFormData({
      company_id: '',
      first_name: '',
      last_name: '',
      position: '',
      phone: '',
      email: '',
      notes: '',
    });
    setError('');
  };

  const getCompanyName = (companyId: number) => {
    const company = companies.find(c => c.id === companyId);
    return company ? company.name : `ID: ${companyId}`;
  };

  if (loading) {
    return <div className="loading-container"><p>Kontaktide laadimine...</p></div>;
  }

  return (
    <div className="contacts-container">
      <header className="page-header">
        <button onClick={onBack} className="btn-back">← Tagasi Dashboardile</button>
        <h1>👤 Kontaktid</h1>
      </header>

      {error && <div className="error-message">{error}</div>}

      <div className="page-actions">
        <button 
          onClick={() => setShowModal(true)} 
          className="btn-primary"
        >
          + Lisa uus kontakt
        </button>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nimi</th>
              <th>Ettevõte</th>
              <th>Positsioon</th>
              <th>Telefon</th>
              <th>E-mail</th>
              <th>Tegevused</th>
            </tr>
          </thead>
          <tbody>
            {contacts.length === 0 ? (
              <tr>
                <td colSpan={6} className="empty-state">
                  Kontakte ei leitud. Lisa esimene!
                </td>
              </tr>
            ) : (
              contacts.map((contact) => (
                <tr key={contact.id}>
                  <td><strong>{contact.first_name} {contact.last_name}</strong></td>
                  <td>{getCompanyName(contact.company_id)}</td>
                  <td>{contact.position || '-'}</td>
                  <td>{contact.phone || '-'}</td>
                  <td>{contact.email || '-'}</td>
                  <td className="actions-cell">
                    <button
                      className="btn-icon btn-edit"
                      onClick={() => handleEdit(contact)}
                      title="Muuda"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-icon btn-delete"
                      onClick={() => handleDelete(contact.id)}
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
            <h2>{editingContact ? 'Muuda kontakti' : 'Lisa uus kontakt'}</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="first_name">Eesnimi *</label>
                  <input
                    type="text"
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    required
                    autoFocus
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="last_name">Perekonnanimi *</label>
                  <input
                    type="text"
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    required
                  />
                </div>
              </div>

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
                <label htmlFor="position">Ametikoht</label>
                <input
                  type="text"
                  id="position"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  placeholder="nt Müügijuht"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Telefon</label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+372 5xxx xxxx"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">E-mail</label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="nimi@ettevõte.ee"
                  />
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
                  {editingContact ? 'Salvesta muudatused' : 'Lisa kontakt'}
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

export default Contacts;

