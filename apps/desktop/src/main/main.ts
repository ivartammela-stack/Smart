// src/main/main.ts

import { app, BrowserWindow, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import * as path from 'path';

// Configure logging
log.transports.file.level = 'info';
autoUpdater.logger = log;

let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, '../preload/preload.js'),
    },
  });

  // Production / local build – laeme public/index.html
  // __dirname = dist/main, seega ../../public = apps/desktop/public
  mainWindow.loadFile(path.join(__dirname, '../../public/index.html'));

  // Dev-tools (optional):
  mainWindow.webContents.openDevTools();

  // Setup auto-updater after window is created
  setupAutoUpdater();
}

function setupAutoUpdater() {
  // Disable auto-download in dev mode
  if (!app.isPackaged) {
    log.info('Dev mode - auto-update disabled');
    return;
  }

  // Auto-download updates
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;

  // Auto-updater events
  autoUpdater.on('checking-for-update', () => {
    log.info('Checking for updates...');
    mainWindow?.webContents.send('update:status', {
      type: 'checking',
    });
  });

  autoUpdater.on('update-available', (info) => {
    log.info('Update available:', info.version);
    mainWindow?.webContents.send('update:status', {
      type: 'available',
      version: info.version,
    });
  });

  autoUpdater.on('update-not-available', (info) => {
    log.info('Update not available:', info.version);
    mainWindow?.webContents.send('update:status', {
      type: 'not-available',
    });
  });

  autoUpdater.on('download-progress', (progressObj) => {
    const message = `Download speed: ${progressObj.bytesPerSecond} - Downloaded ${progressObj.percent}%`;
    log.info(message);
    mainWindow?.webContents.send('update:status', {
      type: 'downloading',
      percent: progressObj.percent,
      transferred: progressObj.transferred,
      total: progressObj.total,
    });
  });

  autoUpdater.on('update-downloaded', (info) => {
    log.info('Update downloaded:', info.version);
    mainWindow?.webContents.send('update:status', {
      type: 'downloaded',
      version: info.version,
    });
  });

  autoUpdater.on('error', (err) => {
    log.error('Update error:', err);
    mainWindow?.webContents.send('update:status', {
      type: 'error',
      message: err == null ? 'unknown error' : (err.message || String(err)),
    });
  });

  // Check for updates after app starts (5 second delay)
  setTimeout(() => {
    log.info('Starting update check...');
    autoUpdater.checkForUpdatesAndNotify();
  }, 5000);

  // Check for updates every 6 hours
  setInterval(() => {
    autoUpdater.checkForUpdatesAndNotify();
  }, 6 * 60 * 60 * 1000);
}

// IPC handler: Install update now
ipcMain.handle('update:installNow', async () => {
  log.info('User requested immediate update installation');
  autoUpdater.quitAndInstall(false, true);
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});