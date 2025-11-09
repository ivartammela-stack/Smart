/**
 * Super Admin - Companies Overview
 * 
 * Shows all accounts with statistics
 * Only accessible by SUPER_ADMIN role
 */

import React, { useEffect, useState } from 'react';
import {
  SuperAdminCompaniesResponse,
  SuperAdminCompanyItem,
  formatStatusEE,
  getStatusColor,
} from '../types/superAdmin';

interface SuperAdminCompaniesProps {
  onBack: () => void;
}

const SuperAdminCompanies: React.FC<SuperAdminCompaniesProps> = ({ onBack }) => {
  const [data, setData] = useState<SuperAdminCompaniesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('http://localhost:3000/api/super-admin/companies', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Ligipääs keelatud. Ainult SUPER_ADMIN saab seda lehte vaadata.');
        }
        throw new Error('Ettevõtete laadimine ebaõnnestus');
      }

      const result = await response.json();
      if (result.success && result.data) {
        setData(result.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err: any) {
      console.error('Error fetching companies:', err);
      setError(err.message || 'Tundmatu viga');
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = data?.companies.filter((company) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleOpenCompany = (companyId: number) => {
    console.log('Open company:', companyId);
    // TODO: Implement account switcher in v1.8.0
  };

  if (loading) {
    return (
      <div style={{ padding: 32 }}>
        <div className="loading-spinner">Laen ettevõtteid...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 32 }}>
        <button
          onClick={onBack}
          style={{
            padding: '8px 16px',
            marginBottom: 16,
            backgroundColor: '#6366f1',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
          }}
        >
          ← Tagasi
        </button>
        <div style={{ color: '#ef4444', padding: 16, backgroundColor: '#fee2e2', borderRadius: 8 }}>
          <strong>Viga:</strong> {error}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ padding: 32 }}>
        <div>Andmed puuduvad</div>
      </div>
    );
  }

  return (
    <div style={{ padding: 32, height: '100vh', overflow: 'auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <button
          onClick={onBack}
          style={{
            padding: '8px 16px',
            marginBottom: 16,
            backgroundColor: '#6366f1',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
          }}
        >
          ← Tagasi
        </button>
        <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>Ettevõtted</h1>
        <p style={{ color: '#64748b' }}>Kõigi accountide ülevaade ja statistika</p>
      </div>

      {/* Summary Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
          marginBottom: 32,
        }}
      >
        <div
          style={{
            backgroundColor: '#f8fafc',
            padding: 24,
            borderRadius: 12,
            border: '1px solid #e2e8f0',
          }}
        >
          <div style={{ fontSize: 14, color: '#64748b', marginBottom: 8 }}>Ettevõtteid kokku</div>
          <div style={{ fontSize: 36, fontWeight: 700, color: '#1e293b' }}>
            {data.total_companies}
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#f8fafc',
            padding: 24,
            borderRadius: 12,
            border: '1px solid #e2e8f0',
          }}
        >
          <div style={{ fontSize: 14, color: '#64748b', marginBottom: 8 }}>Kasutajaid kokku</div>
          <div style={{ fontSize: 36, fontWeight: 700, color: '#1e293b' }}>
            {data.total_users}
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#f8fafc',
            padding: 24,
            borderRadius: 12,
            border: '1px solid #e2e8f0',
          }}
        >
          <div style={{ fontSize: 14, color: '#64748b', marginBottom: 8 }}>
            Keskmine kasutajaid / ettevõte
          </div>
          <div style={{ fontSize: 36, fontWeight: 700, color: '#1e293b' }}>
            {data.avg_users_per_company.toFixed(1)}
          </div>
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Otsi ettevõtte nime järgi..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            maxWidth: 400,
            padding: '10px 16px',
            fontSize: 14,
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            outline: 'none',
          }}
        />
      </div>

      {/* Table */}
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: 12,
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748b' }}>
                Ettevõte
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748b' }}>
                Omanik
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748b' }}>
                Plaan
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 12, fontWeight: 600, color: '#64748b' }}>
                Kasutajaid
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 12, fontWeight: 600, color: '#64748b' }}>
                Staatus
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: '#64748b' }}>
                Loodud
              </th>
              <th style={{ padding: '12px 16px', textAlign: 'center', fontSize: 12, fontWeight: 600, color: '#64748b' }}>
                Tegevused
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredCompanies.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: 32, textAlign: 'center', color: '#94a3b8' }}>
                  {searchTerm ? 'Otsingu tulemusi ei leitud' : 'Ettevõtteid ei leitud'}
                </td>
              </tr>
            ) : (
              filteredCompanies.map((company, index) => (
                <tr
                  key={company.id}
                  style={{
                    borderBottom: index < filteredCompanies.length - 1 ? '1px solid #f1f5f9' : 'none',
                  }}
                >
                  <td style={{ padding: '12px 16px', fontSize: 14, fontWeight: 500 }}>
                    {company.name}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 14, color: '#64748b' }}>
                    {company.owner_full_name ? (
                      <div>
                        <div style={{ fontWeight: 500, color: '#1e293b' }}>{company.owner_full_name}</div>
                        <div style={{ fontSize: 12 }}>{company.owner_email}</div>
                      </div>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 14 }}>
                    <span
                      style={{
                        padding: '4px 12px',
                        backgroundColor: '#f1f5f9',
                        borderRadius: 12,
                        fontSize: 12,
                        fontWeight: 500,
                      }}
                    >
                      {company.billing_plan}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 14, textAlign: 'center', fontWeight: 600 }}>
                    {company.users_count}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '4px 12px',
                        backgroundColor: `${getStatusColor(company.status)}20`,
                        color: getStatusColor(company.status),
                        borderRadius: 12,
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: '50%',
                          backgroundColor: getStatusColor(company.status),
                        }}
                      />
                      {formatStatusEE(company.status)}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: 14, color: '#64748b' }}>
                    {new Date(company.created_at).toLocaleDateString('et-EE')}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <button
                      onClick={() => handleOpenCompany(company.id)}
                      style={{
                        padding: '6px 12px',
                        fontSize: 12,
                        backgroundColor: '#6366f1',
                        color: 'white',
                        border: 'none',
                        borderRadius: 6,
                        cursor: 'pointer',
                      }}
                    >
                      Ava
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SuperAdminCompanies;

