import React, { useEffect, useState } from 'react';

type UpdateState =
  | { state: 'idle' }
  | { state: 'checking' }
  | { state: 'available'; version: string }
  | { state: 'downloading'; percent: number }
  | { state: 'downloaded'; version: string }
  | { state: 'error'; message: string };

// Declare global window types
declare global {
  interface Window {
    updates?: {
      onUpdateAvailable: (cb: (info: { version: string; releaseNotes?: string }) => void) => void;
      onUpdateNotAvailable: (cb: () => void) => void;
      onUpdateDownloaded: (cb: (info: { version: string }) => void) => void;
      onDownloadProgress: (cb: (info: { percent: number; transferred: number; total: number }) => void) => void;
      onUpdateError: (cb: (error: string) => void) => void;
      onChecking: (cb: () => void) => void;
      checkNow: () => void;
      installNow: () => void;
    };
  }
}

const UpdateNotification: React.FC = () => {
  const [update, setUpdate] = useState<UpdateState>({ state: 'idle' });

  useEffect(() => {
    // Check if running in Electron
    if (!window.updates) {
      console.log('Auto-updater not available (probably running in dev mode)');
      return;
    }

    // Check for updates on mount
    window.updates.checkNow();

    window.updates.onChecking(() => {
      setUpdate({ state: 'checking' });
    });

    window.updates.onUpdateAvailable((info) => {
      setUpdate({ state: 'available', version: info.version });
    });

    window.updates.onDownloadProgress((info) => {
      setUpdate({ state: 'downloading', percent: info.percent });
    });

    window.updates.onUpdateDownloaded((info) => {
      setUpdate({ state: 'downloaded', version: info.version });
    });

    window.updates.onUpdateError((error) => {
      setUpdate({ state: 'error', message: error });
    });

    window.updates.onUpdateNotAvailable(() => {
      // Silently reset to idle
      setUpdate({ state: 'idle' });
    });
  }, []);

  const handleInstallNow = () => {
    if (window.updates) {
      window.updates.installNow();
    }
  };

  if (update.state === 'idle' || update.state === 'checking' || update.state === 'available') {
    return null;
  }

  const isDownloaded = update.state === 'downloaded';
  const isError = update.state === 'error';
  const isDownloading = update.state === 'downloading';
  
  const version = update.state === 'downloaded' ? update.version : undefined;
  const percent = update.state === 'downloading' ? update.percent : undefined;

  let title = '';
  let description = '';

  if (isDownloading) {
    title = '⬇️ Uuendus allalaadimisel';
    description = `Laaditud ${percent?.toFixed(0) ?? 0}%`;
  } else if (isDownloaded) {
    title = '🎉 Uuendus valmis!';
    description = `Versioon v${version} on alla laetud. Vajuta "Paigalda & taaskäivita" - rakendus sulgub ja käivitub automaatselt uuesti uue versiooniga.`;
  } else if (isError) {
    title = '⚠️ Uuendus ebaõnnestus';
    description = `Viga: ${update.message}`;
  }

  return (
    <div className="sf-update-notification">
      <div className="sf-update-header">
        <div className="sf-update-title">{title}</div>
      </div>
      
      <div className="sf-update-description">{description}</div>
      
      {isDownloaded && (
        <div className="sf-update-actions">
          <button
            className="sf-update-button sf-update-button-primary"
            onClick={handleInstallNow}
          >
            Paigalda & taaskäivita
          </button>
        </div>
      )}
    </div>
  );
};

export default UpdateNotification;

