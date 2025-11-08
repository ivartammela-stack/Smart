// This file is used to expose certain APIs to the renderer process in a secure manner.
// It allows communication between the main and renderer processes.

import { contextBridge, ipcRenderer } from 'electron';

// Expose a method to the renderer process
contextBridge.exposeInMainWorld('api', {
    // Example method to send a message to the main process
    sendMessage: (channel: string, data: any) => {
        ipcRenderer.send(channel, data);
    },
    // Example method to receive a message from the main process
    receiveMessage: (channel: string, func: (data: any) => void) => {
        ipcRenderer.on(channel, (event, data) => func(data));
    }
});

// Auto-updater API
contextBridge.exposeInMainWorld('updates', {
  onUpdateAvailable: (callback: (info: { version: string; releaseNotes?: string }) => void) => {
    ipcRenderer.on('updates/update-available', (_event, info) => callback(info));
  },
  onUpdateNotAvailable: (callback: () => void) => {
    ipcRenderer.on('updates/update-not-available', () => callback());
  },
  onUpdateDownloaded: (callback: (info: { version: string }) => void) => {
    ipcRenderer.on('updates/update-downloaded', (_event, info) => callback(info));
  },
  onDownloadProgress: (callback: (info: { percent: number; transferred: number; total: number }) => void) => {
    ipcRenderer.on('updates/download-progress', (_event, info) => callback(info));
  },
  onUpdateError: (callback: (error: string) => void) => {
    ipcRenderer.on('updates/update-error', (_event, error) => callback(error));
  },
  onChecking: (callback: () => void) => {
    ipcRenderer.on('updates/checking', () => callback());
  },
  checkNow: () => {
    ipcRenderer.send('updates/check-now');
  },
  installNow: () => {
    ipcRenderer.send('updates/install-now');
  },
});