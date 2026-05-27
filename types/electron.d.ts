interface ElectronAPI {
  onUpdateAvailable: (callback: (info: any) => void) => () => void
  onUpdateProgress: (callback: (info: any) => void) => () => void
  onUpdateDownloaded: (callback: () => void) => () => void
  onUpdateError: (callback: (error: any) => void) => () => void
  installUpdate: () => Promise<void>
  checkForUpdates: () => Promise<void>
  getAppVersion: () => Promise<string>
}

declare global {
  interface Window {
    electron?: ElectronAPI
  }
}

export {}
