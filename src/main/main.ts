import {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  protocol,
} from 'electron'
import { autoUpdater as updater } from 'electron-updater'
import path from 'path'
import isDev from 'electron-is-dev'

let mainWindow: BrowserWindow | null = null

// Handle Squirrel events for Windows installer
if (process.platform === 'win32' && !isDev) {
  // Squirrel will handle these events
  const squirrelEvent = process.argv[1]
  switch (squirrelEvent) {
    case '--squirrel-install':
    case '--squirrel-updated':
      // This is called when the app is installed or updated
      app.quit()
      break
    case '--squirrel-uninstall':
      // This is called when the app is uninstalled
      app.quit()
      break
  }
}

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
    icon: path.join(__dirname, '../assets/icon.png'),
  })

  // Load Next.js static output - use absolute path to avoid relative path issues
  const outPath = path.join(app.getAppPath(), 'out', 'index.html')
  const startURL = `file://${outPath}`
  
  mainWindow.loadURL(startURL)
  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // Handle any app menu
  createMenu()
}

const createMenu = () => {
  const isMac = process.platform === 'darwin'

  const template: any[] = [
    {
      label: 'File',
      submenu: [isMac ? { role: 'close' } : { role: 'quit' }],
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Check for Updates',
          click: () => {
            updater.checkForUpdates()
          },
        },
      ],
    },
  ]

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}

const initializeUpdater = () => {
  // Configure electron-updater
  updater.checkForUpdatesAndNotify()

  updater.on('update-available', (info) => {
    console.log('Update available:', info)
    if (mainWindow) {
      mainWindow.webContents.send('update-available', {
        version: info.version,
        releaseDate: info.releaseDate,
        releaseName: info.releaseName,
        releaseNotes: info.releaseNotes || '',
      })
    }
  })

  updater.on('update-not-available', () => {
    console.log('No update available')
  })

  updater.on('error', (error) => {
    console.error('Updater error:', error)
    if (mainWindow) {
      mainWindow.webContents.send('update-error', {
        error: error.message,
      })
    }
  })

  updater.on('download-progress', (progressObj) => {
    console.log('Download progress:', progressObj)
    if (mainWindow) {
      mainWindow.webContents.send('update-progress', {
        percent: progressObj.percent,
        bytesPerSecond: progressObj.bytesPerSecond,
        total: progressObj.total,
        transferred: progressObj.transferred,
      })
    }
  })

  updater.on('update-downloaded', () => {
    console.log('Update downloaded')
    if (mainWindow) {
      mainWindow.webContents.send('update-downloaded', {})
    }
  })

  // Check for updates on startup
  if (!isDev) {
    setTimeout(() => {
      updater.checkForUpdates()
    }, 3000)
  }
}

app.on('ready', () => {
  createWindow()
  initializeUpdater()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// IPC Handlers
ipcMain.handle('install-update', async () => {
  updater.quitAndInstall()
  return { success: true }
})

ipcMain.handle('check-for-updates', async () => {
  try {
    const result = await updater.checkForUpdates()
    return {
      updateAvailable: result ? result.updateInfo !== null : false,
      currentVersion: app.getVersion(),
    }
  } catch (error) {
    console.error('Error checking for updates:', error)
    return {
      updateAvailable: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
})

ipcMain.handle('get-app-version', async () => {
  return app.getVersion()
})

export {}
