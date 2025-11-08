import React from 'react';

interface CompaniesProps {
  onBack: () => void;
}

const Companies: React.FC<CompaniesProps> = ({ onBack }) => {
  return (
    <div className="sf-page">
      <div className="sf-header">
        <button onClick={onBack} className="sf-back-button">
          ← Tagasi
        </button>
        <h1>Ettevõtted</h1>
      </div>
      <div className="sf-content">
        <p>Ettevõtete haldus tuleb peagi...</p>
      </div>
    </div>
  );
};

export default Companies;

