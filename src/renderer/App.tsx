import React, { useEffect, useState } from 'react'
import './App.css'

interface UpdateInfo {
  version: string
  releaseDate: string
  releaseName: string
  releaseNotes?: string
}

interface ProgressInfo {
  percent: number
  bytesPerSecond: number
  total: number
  transferred: number
}

const App: React.FC = () => {
  const [appVersion, setAppVersion] = useState<string>('1.0.0')
  const [updateAvailable, setUpdateAvailable] = useState<boolean>(false)
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null)
  const [downloading, setDownloading] = useState<boolean>(false)
  const [downloadProgress, setDownloadProgress] = useState<number>(0)
  const [downloadSpeed, setDownloadSpeed] = useState<string>('0 KB/s')
  const [updateReady, setUpdateReady] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [showReleaseNotes, setShowReleaseNotes] = useState<boolean>(false)

  useEffect(() => {
    // Get current app version
    const getVersion = async () => {
      try {
        const version = await window.electron.getAppVersion()
        setAppVersion(version)
      } catch (err) {
        console.error('Error getting app version:', err)
      }
    }

    getVersion()

    // Listen for update available event
    const handleUpdateAvailable = (info: UpdateInfo) => {
      console.log('Update available:', info)
      setUpdateAvailable(true)
      setUpdateInfo(info)
      setDownloading(true)
      setError(null)
    }

    // Listen for progress updates
    const handleProgressUpdate = (progress: ProgressInfo) => {
      console.log('Download progress:', progress)
      setDownloadProgress(Math.round(progress.percent))

      // Format speed
      const speedMB = progress.bytesPerSecond / (1024 * 1024)
      if (speedMB > 0) {
        setDownloadSpeed(`${speedMB.toFixed(2)} MB/s`)
      }
    }

    // Listen for update downloaded
    const handleUpdateDownloaded = () => {
      console.log('Update downloaded and ready to install')
      setDownloading(false)
      setUpdateReady(true)
      setDownloadProgress(100)
    }

    // Listen for errors
    const handleUpdateError = (errorInfo: { error: string }) => {
      console.error('Update error:', errorInfo)
      setError(errorInfo.error)
      setDownloading(false)
    }

    // Register listeners
    window.electron.onUpdateAvailable(handleUpdateAvailable)
    window.electron.onUpdateProgress(handleProgressUpdate)
    window.electron.onUpdateDownloaded(handleUpdateDownloaded)
    window.electron.onUpdateError(handleUpdateError)

    // Cleanup
    return () => {
      window.electron.removeUpdateAvailableListener(handleUpdateAvailable)
      window.electron.removeUpdateProgressListener(handleProgressUpdate)
      window.electron.removeUpdateDownloadedListener(handleUpdateDownloaded)
      window.electron.removeUpdateErrorListener(handleUpdateError)
    }
  }, [])

  const handleCheckUpdates = async () => {
    try {
      const result = await window.electron.checkForUpdates()
      if (!result.updateAvailable) {
        setError(null)
        alert('You are running the latest version!')
      }
    } catch (err) {
      console.error('Error checking for updates:', err)
      setError('Failed to check for updates')
    }
  }

  const handleInstallUpdate = async () => {
    try {
      await window.electron.installUpdate()
    } catch (err) {
      console.error('Error installing update:', err)
      setError('Failed to install update')
    }
  }

  const handleRemindLater = () => {
    setUpdateAvailable(false)
    setUpdateInfo(null)
    setDownloadProgress(0)
    setDownloading(false)
    setUpdateReady(false)
    setShowReleaseNotes(false)
  }

  return (
    <div className="app-container">
      {/* Update Banner */}
      {updateAvailable && (
        <div className={`update-banner ${updateReady ? 'ready' : 'downloading'}`}>
          <div className="update-content">
            <div className="update-header">
              {updateReady ? (
                <>
                  <h2>✅ Update Ready to Install</h2>
                  <p className="version-info">
                    Version {updateInfo?.version} is ready to be installed
                  </p>
                </>
              ) : downloading ? (
                <>
                  <h2>📥 Downloading Update</h2>
                  <p className="version-info">
                    Version {updateInfo?.version} is being downloaded
                  </p>
                </>
              ) : (
                <>
                  <h2>🆕 Update Available</h2>
                  <p className="version-info">
                    Version {updateInfo?.version} is available
                  </p>
                </>
              )}
            </div>

            {updateInfo && (
              <div className="release-info">
                <p className="release-name">
                  <strong>Release:</strong> {updateInfo.releaseName}
                </p>
                <p className="release-date">
                  <strong>Released:</strong>{' '}
                  {new Date(updateInfo.releaseDate).toLocaleDateString()}
                </p>
                {updateInfo.releaseNotes && (
                  <button
                    className="link-button"
                    onClick={() => setShowReleaseNotes(!showReleaseNotes)}
                  >
                    {showReleaseNotes ? '▼ Hide' : '▶ Show'} Release Notes
                  </button>
                )}
              </div>
            )}

            {showReleaseNotes && updateInfo?.releaseNotes && (
              <div className="release-notes">
                <pre>{updateInfo.releaseNotes}</pre>
              </div>
            )}

            {downloading && !updateReady && (
              <div className="progress-section">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${downloadProgress}%` }}
                  ></div>
                </div>
                <p className="progress-text">
                  {downloadProgress}% downloaded ({downloadSpeed})
                </p>
              </div>
            )}

            {error && (
              <div className="error-message">
                <p>❌ Error: {error}</p>
              </div>
            )}

            <div className="action-buttons">
              {updateReady && (
                <button className="btn btn-primary" onClick={handleInstallUpdate}>
                  🚀 Update Now
                </button>
              )}
              {!downloading && !updateReady && (
                <button className="btn btn-primary" onClick={handleInstallUpdate}>
                  🚀 Update Now
                </button>
              )}
              <button className="btn btn-secondary" onClick={handleRemindLater}>
                ⏱️ Remind Me Later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="main-content">
        <div className="content-card">
          <div className="logo">🎯</div>
          <h1 className="title">Hello World v1</h1>
          <p className="subtitle">TrustInn Desktop Application</p>

          <div className="version-info-main">
            <p>
              Current Version: <strong>v{appVersion}</strong>
            </p>
          </div>

          <div className="actions">
            <button className="btn btn-outline" onClick={handleCheckUpdates}>
              Check for Updates
            </button>
          </div>

          <div className="info-section">
            <h3>ℹ️ About This App</h3>
            <p>
              This is a production-ready Electron + React desktop application
              with automatic update support via GitHub Releases.
            </p>
            <p style={{ marginTop: '10px' }}>
              The app checks for updates on startup and displays a banner when
              a new version is available.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <p>© 2024 TrustInn. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default App
