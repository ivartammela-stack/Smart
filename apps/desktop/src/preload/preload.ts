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
contextBridge.exposeInMainWorld('smartfollowUpdater', {
  // Listen for update status events from main process
  onStatus: (callback: (status: any) => void) => {
    const listener = (_event: Electron.IpcRendererEvent, data: any) => callback(data);
    ipcRenderer.on('update:status', listener);

    // Return cleanup function
    return () => {
      ipcRenderer.removeListener('update:status', listener);
    };
  },
  
  // Request immediate installation of downloaded update
  installNow: () => ipcRenderer.invoke('update:installNow'),
});