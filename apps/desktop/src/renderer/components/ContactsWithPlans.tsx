// Example: Contacts view with Plan-based features
import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { useCurrentPlan } from '../hooks/useCurrentPlan';
import { PlanGuard } from './PlanGuard';

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

interface ContactsWithPlansProps {
  onBack: () => void;
}

const ContactsWithPlans: React.FC<ContactsWithPlansProps> = ({ onBack }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const { id: planId, label: planLabel } = useCurrentPlan();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/contacts');
      setContacts(response.data || []);
    } catch (err) {
      console.error('Error fetching contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-container"><p>Laadimine...</p></div>;
  }

  return (
    <div className="contacts-layout">
      <header className="contacts-header">
        <div className="contacts-title-block">
          <h1>Kontaktid</h1>
          <p className="contacts-subtitle">
            Praegune plaan: <strong>{planLabel}</strong> ({planId})
          </p>
        </div>

        {/* Advanced filters - STARTER+ only */}
        <PlanGuard minPlan="STARTER">
          <div className="contacts-filters">
            <input
              type="text"
              placeholder="Otsi kontakte..."
              className="filter-input"
            />
            <select className="filter-select">
              <option>Kõik ettevõtted</option>
            </select>
          </div>
        </PlanGuard>
      </header>

      {/* Main contacts table - available for all plans */}
      <div className="contacts-card">
        <table className="contacts-table">
          <thead>
            <tr>
              <th>Nimi</th>
              <th>E-mail</th>
              <th>Telefon</th>
              <th>Ettevõte</th>
              <th>Tegevused</th>
            </tr>
          </thead>
          <tbody>
            {contacts.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty-state">
                  Kontakte ei leitud
                </td>
              </tr>
            ) : (
              contacts.map((contact) => (
                <tr key={contact.id}>
                  <td>
                    <strong>{contact.first_name} {contact.last_name}</strong>
                    {contact.position && (
                      <div className="contact-position">{contact.position}</div>
                    )}
                  </td>
                  <td>{contact.email || '-'}</td>
                  <td>{contact.phone || '-'}</td>
                  <td>{contact.company_id}</td>
                  <td>
                    <button className="contacts-action-button">Muuda</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Statistics - PRO+ only */}
      <PlanGuard minPlan="PRO">
        <section className="contacts-stats">
          <div className="stat-card">
            <div className="stat-label">Total Contacts</div>
            <div className="stat-value">{contacts.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Active This Month</div>
            <div className="stat-value">
              {Math.floor(contacts.length * 0.7)}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">New Leads</div>
            <div className="stat-value">
              {Math.floor(contacts.length * 0.15)}
            </div>
          </div>
        </section>
      </PlanGuard>

      {/* Upgrade banner for FREE users */}
      {planId === 'FREE' && (
        <div className="upgrade-banner">
          <p>
            🚀 Rohkem filtreid, segmentatsioon ja statistika on saadaval alates{' '}
            <strong>Starter</strong> paketist.
          </p>
          <button className="btn-upgrade">Vaata pakette</button>
        </div>
      )}
    </div>
  );
};

export default ContactsWithPlans;

