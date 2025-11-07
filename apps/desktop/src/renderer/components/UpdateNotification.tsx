import React, { useEffect, useState } from 'react';

type UpdateStatus =
  | { type: 'idle' }
  | { type: 'checking' }
  | { type: 'available'; version?: string }
  | { type: 'downloading'; percent?: number; transferred?: number; total?: number }
  | { type: 'downloaded'; version?: string }
  | { type: 'error'; message: string }
  | { type: 'not-available' };

// Declare global window types
declare global {
  interface Window {
    smartfollowUpdater?: {
      onStatus: (callback: (status: UpdateStatus) => void) => () => void;
      installNow: () => Promise<void>;
    };
  }
}

const UpdateNotification: React.FC = () => {
  const [status, setStatus] = useState<UpdateStatus>({ type: 'idle' });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if running in Electron
    if (!window.smartfollowUpdater) {
      console.log('Auto-updater not available (probably running in dev mode)');
      return;
    }

    const unsubscribe = window.smartfollowUpdater.onStatus((newStatus) => {
      setStatus(newStatus);
      
      // Show notification for all states except idle and not-available
      if (newStatus.type !== 'not-available' && newStatus.type !== 'idle') {
        setVisible(true);
      }
    });

    return () => {
      unsubscribe?.();
    };
  }, []);

  const handleInstallNow = async () => {
    if (window.smartfollowUpdater) {
      await window.smartfollowUpdater.installNow();
    }
  };

  const handleClose = () => {
    setVisible(false);
  };

  if (!visible) return null;

  let title = '';
  let description = '';
  let showInstallButton = false;
  let showCloseButton = true;

  switch (status.type) {
    case 'checking':
      title = '🔍 Uuenduste kontroll...';
      description = 'Kontrollin, kas on saadaval uusi versioone.';
      showCloseButton = false;
      break;
    
    case 'available':
      title = '✨ Uus versioon saadaval';
      description = `Laen uuendust alla... (v${status.version ?? ''})`;
      showCloseButton = false;
      break;
    
    case 'downloading':
      title = '⬇️ Uuendus allalaadimisel';
      const percent = status.percent?.toFixed(0) ?? 0;
      const transferred = status.transferred ? (status.transferred / 1024 / 1024).toFixed(1) : 0;
      const total = status.total ? (status.total / 1024 / 1024).toFixed(1) : 0;
      description = `Laaditud ${percent}% (${transferred} MB / ${total} MB)`;
      showCloseButton = false;
      break;
    
    case 'downloaded':
      title = '🎉 Uuendus valmis paigaldamiseks!';
      description = `Versioon v${status.version ?? ''} on valmis. Vajuta "Paigalda & taaskäivita" - rakendus sulgub ja käivitub automaatselt uuesti uue versiooniga.`;
      showInstallButton = true;
      break;
    
    case 'error':
      title = '⚠️ Uuendus ebaõnnestus';
      description = `Viga: ${status.message}`;
      break;
    
    default:
      return null;
  }

  return (
    <div className="sf-update-notification">
      <div className="sf-update-header">
        <div className="sf-update-title">{title}</div>
        {showCloseButton && (
          <button
            className="sf-update-close"
            onClick={handleClose}
            aria-label="Sulge"
          >
            ✕
          </button>
        )}
      </div>
      
      <div className="sf-update-description">{description}</div>
      
      <div className="sf-update-actions">
        {showInstallButton && (
          <button
            className="sf-update-button sf-update-button-primary"
            onClick={handleInstallNow}
          >
            Paigalda & taaskäivita
          </button>
        )}
        
        {showCloseButton && !showInstallButton && (
          <button
            className="sf-update-button sf-update-button-secondary"
            onClick={handleClose}
          >
            Sulge
          </button>
        )}
      </div>
    </div>
  );
};

export default UpdateNotification;

