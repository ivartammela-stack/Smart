import React from 'react';

interface ContactsProps {
  onBack: () => void;
}

const Contacts: React.FC<ContactsProps> = ({ onBack }) => {
  return (
    <div className="sf-page">
      <div className="sf-header">
        <button onClick={onBack} className="sf-back-button">
          ← Tagasi
        </button>
        <h1>Kontaktid</h1>
      </div>
      <div className="sf-content">
        <p>Kontaktide haldus tuleb peagi...</p>
      </div>
    </div>
  );
};

export default Contacts;

