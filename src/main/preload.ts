import { contextBridge, ipcRenderer } from 'electron'

export interface UpdateInfo {
  version: string
  releaseDate: string
  releaseName: string
  releaseNotes?: string
}

export interface ProgressInfo {
  percent: number
  bytesPerSecond: number
  total: number
  transferred: number
}

// Expose safe APIs to the renderer process
contextBridge.exposeInMainWorld('electron', {
  // Update related
  onUpdateAvailable: (callback: (info: UpdateInfo) => void) => {
    ipcRenderer.on('update-available', (_, data) => callback(data))
  },

  onUpdateProgress: (callback: (progress: ProgressInfo) => void) => {
    ipcRenderer.on('update-progress', (_, data) => callback(data))
  },

  onUpdateDownloaded: (callback: () => void) => {
    ipcRenderer.on('update-downloaded', () => callback())
  },

  onUpdateError: (callback: (error: { error: string }) => void) => {
    ipcRenderer.on('update-error', (_, data) => callback(data))
  },

  installUpdate: () => ipcRenderer.invoke('install-update'),
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),

  // Remove listeners
  removeUpdateAvailableListener: (callback: any) => {
    ipcRenderer.removeListener('update-available', callback)
  },

  removeUpdateProgressListener: (callback: any) => {
    ipcRenderer.removeListener('update-progress', callback)
  },

  removeUpdateDownloadedListener: (callback: any) => {
    ipcRenderer.removeListener('update-downloaded', callback)
  },

  removeUpdateErrorListener: (callback: any) => {
    ipcRenderer.removeListener('update-error', callback)
  },
})

// Type declaration for TypeScript
declare global {
  interface Window {
    electron: {
      onUpdateAvailable: (callback: (info: UpdateInfo) => void) => void
      onUpdateProgress: (callback: (progress: ProgressInfo) => void) => void
      onUpdateDownloaded: (callback: () => void) => void
      onUpdateError: (callback: (error: { error: string }) => void) => void
      installUpdate: () => Promise<{ success: boolean }>
      checkForUpdates: () => Promise<{
        updateAvailable: boolean
        currentVersion: string
        error?: string
      }>
      getAppVersion: () => Promise<string>
      removeUpdateAvailableListener: (callback: any) => void
      removeUpdateProgressListener: (callback: any) => void
      removeUpdateDownloadedListener: (callback: any) => void
      removeUpdateErrorListener: (callback: any) => void
    }
  }
}

export {}
