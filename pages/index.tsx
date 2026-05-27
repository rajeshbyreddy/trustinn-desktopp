'use client'

import React, { useEffect, useState } from 'react'
import Head from 'next/head'

export default function Home() {
  const [appVersion, setAppVersion] = useState<string>('1.0.0')
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [updateInfo, setUpdateInfo] = useState<any>(null)
  const [downloading, setDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [downloadSpeed, setDownloadSpeed] = useState('0 MB/s')
  const [updateReady, setUpdateReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showReleaseNotes, setShowReleaseNotes] = useState(false)

  useEffect(() => {
    // Get initial app version
    if (window.electron) {
      window.electron.getAppVersion().then(setAppVersion).catch(console.error)
    }

    // Listen for update events
    if (window.electron) {
      const removeUpdateAvailable = window.electron.onUpdateAvailable((info: any) => {
        setUpdateAvailable(true)
        setUpdateInfo(info)
        setError(null)
      })

      const removeUpdateProgress = window.electron.onUpdateProgress((info: any) => {
        setDownloading(true)
        setDownloadProgress(info.percent || 0)
        if (info.bytesPerSecond) {
          const mbps = (info.bytesPerSecond / 1024 / 1024).toFixed(2)
          setDownloadSpeed(`${mbps} MB/s`)
        }
      })

      const removeUpdateDownloaded = window.electron.onUpdateDownloaded(() => {
        setDownloading(false)
        setUpdateReady(true)
      })

      const removeUpdateError = window.electron.onUpdateError((error: any) => {
        setDownloading(false)
        setError(error.error || 'An error occurred during update')
      })

      return () => {
        removeUpdateAvailable()
        removeUpdateProgress()
        removeUpdateDownloaded()
        removeUpdateError()
      }
    }
  }, [])

  const handleCheckForUpdates = async () => {
    if (window.electron) {
      try {
        await window.electron.checkForUpdates()
        setError(null)
      } catch (err) {
        setError('Failed to check for updates')
      }
    }
  }

  const handleInstallUpdate = async () => {
    if (window.electron) {
      try {
        await window.electron.installUpdate()
      } catch (err) {
        setError('Failed to install update')
      }
    }
  }

  const handleRemindLater = () => {
    setUpdateAvailable(false)
    setUpdateInfo(null)
  }

  return (
    <>
      <Head>
        <title>TrustInn - Desktop App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="flex items-center justify-center min-h-screen">
        <div className="w-full max-w-2xl px-6">
          {/* Update Banner */}
          {updateAvailable && !updateReady && (
            <div className="mb-8 p-6 bg-white rounded-lg shadow-lg border-l-4 border-blue-500">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Update Available</h3>
                  <p className="text-gray-600">
                    Version {updateInfo?.version || 'new'} is available
                  </p>
                </div>
                <button
                  onClick={handleRemindLater}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Progress Bar */}
              {downloading && (
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Downloading...</span>
                    <span className="text-sm text-gray-600">{downloadSpeed}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${downloadProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{Math.round(downloadProgress)}% complete</p>
                </div>
              )}

              {/* Release Notes */}
              {updateInfo?.releaseNotes && (
                <div className="mb-4">
                  <button
                    onClick={() => setShowReleaseNotes(!showReleaseNotes)}
                    className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                  >
                    {showReleaseNotes ? '▼ Hide' : '▶ Show'} Release Notes
                  </button>
                  {showReleaseNotes && (
                    <div className="mt-3 p-3 bg-gray-100 rounded text-sm text-gray-700 max-h-48 overflow-y-auto">
                      <pre className="whitespace-pre-wrap font-sans">
                        {typeof updateInfo.releaseNotes === 'string'
                          ? updateInfo.releaseNotes
                          : JSON.stringify(updateInfo.releaseNotes, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                {!downloading && !updateReady && (
                  <>
                    <button
                      onClick={handleInstallUpdate}
                      className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded transition"
                    >
                      Update Now
                    </button>
                    <button
                      onClick={handleRemindLater}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded transition"
                    >
                      Remind Me Later
                    </button>
                  </>
                )}
                {updateReady && (
                  <button
                    onClick={handleInstallUpdate}
                    className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded transition"
                  >
                    Install and Restart
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="text-center">
            <h1 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
              Hello World v1
            </h1>

            <p className="text-xl text-blue-100 mb-2">TrustInn Desktop Application</p>
            <p className="text-lg text-blue-200 mb-8">Version {appVersion}</p>

            <button
              onClick={handleCheckForUpdates}
              disabled={downloading}
              className="px-8 py-3 bg-white hover:bg-blue-50 text-blue-600 font-bold rounded-lg shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed mb-12"
            >
              {downloading ? 'Checking for Updates...' : 'Check for Updates'}
            </button>

            {error && (
              <div className="p-4 bg-red-500 text-white rounded-lg mb-8">
                <p className="font-medium">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            {/* About Section */}
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">About This App</h2>
              <p className="text-blue-100 mb-4 leading-relaxed">
                This is a desktop application built with Electron and Next.js, featuring automatic updates
                powered by GitHub Releases.
              </p>
              <div className="grid grid-cols-2 gap-4 text-left text-sm">
                <div>
                  <p className="text-blue-200">Technology Stack:</p>
                  <ul className="text-blue-100 space-y-1">
                    <li>• Electron 27</li>
                    <li>• Next.js 14</li>
                    <li>• React 18</li>
                  </ul>
                </div>
                <div>
                  <p className="text-blue-200">Features:</p>
                  <ul className="text-blue-100 space-y-1">
                    <li>• Auto-Updates</li>
                    <li>• Tailwind CSS</li>
                    <li>• TypeScript</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
