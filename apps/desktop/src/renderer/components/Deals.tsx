import React from 'react';

interface DealsProps {
  onBack: () => void;
}

const Deals: React.FC<DealsProps> = ({ onBack }) => {
  return (
    <div className="sf-page">
      <div className="sf-header">
        <button onClick={onBack} className="sf-back-button">
          ← Tagasi
        </button>
        <h1>Tehingud</h1>
      </div>
      <div className="sf-content">
        <p>Tehingute haldus tuleb peagi...</p>
      </div>
    </div>
  );
};

export default Deals;

