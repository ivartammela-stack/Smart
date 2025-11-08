import React from 'react';

interface AdminUsersProps {
  onBack: () => void;
}

const AdminUsers: React.FC<AdminUsersProps> = ({ onBack }) => {
  return (
    <div className="sf-page">
      <div className="sf-header">
        <button onClick={onBack} className="sf-back-button">
          ← Tagasi
        </button>
        <h1>Kasutajad</h1>
      </div>
      <div className="sf-content">
        <p>Kasutajate haldus tuleb peagi...</p>
      </div>
    </div>
  );
};

export default AdminUsers;

