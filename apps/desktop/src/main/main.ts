// src/main/main.ts

import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';

let mainWindow: BrowserWindow | null = null;

// --- LOGI SEADISTUS ---
log.transports.file.level = 'info';
autoUpdater.logger = log;

// --- AKNA LOOMINE ---
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 640,
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // Production / local build – lae public/index.html
  // __dirname = dist/main, seega ../../public = apps/desktop/public
  mainWindow.loadFile(path.join(__dirname, '../../public/index.html'));

  // Dev-tools (optional - võid production builds-is välja kommenteerida):
  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // PRODIS: kontrolli uuendusi pärast akna loomist
  if (app.isPackaged) {
    log.info('Auto-update: checking for updates (on createWindow)...');
    autoUpdater.checkForUpdatesAndNotify();
  } else {
    log.info('Auto-update: dev mode – skipping update check');
  }
}

// --- APP ELUTSÜKKEL ---
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // macOS: hoia app taustal
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// --- AUTOUPDATER SÜNDMUSED ---

autoUpdater.on('checking-for-update', () => {
  log.info('Auto-update: checking for update...');
  BrowserWindow.getAllWindows().forEach((win) => {
    win.webContents.send('updates/checking', null);
  });
});

autoUpdater.on('update-available', (info) => {
  log.info('Auto-update: update available', info);
  const payload = {
    version: info.version,
    releaseNotes: info.releaseNotes ?? '',
  };
  BrowserWindow.getAllWindows().forEach((win) => {
    win.webContents.send('updates/update-available', payload);
  });
});

autoUpdater.on('update-not-available', (info) => {
  log.info('Auto-update: no update available', info);
  BrowserWindow.getAllWindows().forEach((win) => {
    win.webContents.send('updates/update-not-available', null);
  });
});

autoUpdater.on('download-progress', (progressObj) => {
  log.info(`Auto-update: download progress ${progressObj.percent}%`);
  BrowserWindow.getAllWindows().forEach((win) => {
    win.webContents.send('updates/download-progress', {
      percent: progressObj.percent,
      transferred: progressObj.transferred,
      total: progressObj.total,
    });
  });
});

autoUpdater.on('update-downloaded', (info) => {
  log.info('Auto-update: update downloaded', info);
  const payload = {
    version: info.version,
  };
  BrowserWindow.getAllWindows().forEach((win) => {
    win.webContents.send('updates/update-downloaded', payload);
  });
});

autoUpdater.on('error', (err) => {
  log.error('Auto-update error', err);
  BrowserWindow.getAllWindows().forEach((win) => {
    win.webContents.send(
      'updates/update-error',
      err == null ? 'unknown error' : String(err),
    );
  });
});

// --- IPC RENDERERILT ---
// renderer → "kontrolli nüüd uuendusi"
ipcMain.on('updates/check-now', () => {
  if (!app.isPackaged) {
    log.info('Auto-update: check-now ignored in dev mode');
    return;
  }
  log.info('Auto-update: manual checkForUpdatesAndNotify()');
  autoUpdater.checkForUpdatesAndNotify();
});

// renderer → "paigalda nüüd"
ipcMain.on('updates/install-now', () => {
  log.info('Auto-update: user requested installNow');
  autoUpdater.quitAndInstall();
});