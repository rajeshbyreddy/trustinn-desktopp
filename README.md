# Electron + React Desktop App - TrustInn

A production-ready Electron + React desktop application with automatic update support via GitHub Releases.

## Features

- ⚡ Fast development with Vite + React
- 🚀 Electron for cross-platform desktop support
- 🔄 Automatic updates via GitHub Releases
- 🎨 Modern UI with React components
- 🔐 Secure IPC communication with context isolation
- 📦 Automated builds with electron-builder
- 🔧 GitHub Actions CI/CD pipeline

## Project Structure

```
trustinn/
├── src/
│   ├── main/
│   │   ├── main.ts          # Electron main process
│   │   └── preload.ts       # Preload script for secure IPC
│   └── renderer/
│       ├── App.tsx          # Main React component
│       ├── App.css          # Component styles
│       ├── main.tsx         # React entry point
│       └── index.html       # HTML template
├── .github/
│   └── workflows/
│       └── release.yml      # GitHub Actions workflow
├── package.json             # Project dependencies and build config
├── tsconfig.json            # TypeScript config
├── vite.config.ts           # Vite config
└── README.md                # This file
```

## Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** 9+ (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))
- **GitHub account** with a repository

## Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/rajeshbyreddy/trustinn-desktopp.git
cd trustinn
```

### 2. Create Development Branch

```bash
git checkout -b test
git push origin test
```

### 3. Install Dependencies

```bash
npm install
```

## Development

### Running the App in Development Mode

```bash
npm run dev
```

This will:
- Start Vite dev server (http://localhost:5173)
- Launch Electron with hot-reload
- Open DevTools for debugging

The app will show "Hello World v1" content.

### Building for Production

```bash
npm run build
```

This will:
- Build React app with Vite
- Package with electron-builder
- Create installers for your OS

## Release & Update Testing

### Step-by-Step: Testing Auto Updates

#### Step 1: Create Initial Release (v1.0.0)

1. **Edit content** (already shows "Hello World v1")
2. **Ensure you're on `main` branch**:
   ```bash
   git checkout main
   ```

3. **Create and push tag**:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

4. **Wait for GitHub Actions** - Check Actions tab in GitHub
5. **Install the app** - Download from GitHub Releases

#### Step 2: Test Update Detection

1. **Open the installed app**
   - Should show "Hello World v1"
   - Check for Updates button works

#### Step 3: Create Updated Version (v1.0.1)

1. **Modify content** in `src/renderer/App.tsx`:
   ```typescript
   <h1 className="title">Hello World v2</h1>
   ```

2. **Update package.json version**:
   ```json
   "version": "1.0.1"
   ```

3. **Commit and tag**:
   ```bash
   git add .
   git commit -m "chore: bump version to 1.0.1"
   git tag v1.0.1
   git push origin main
   git push origin v1.0.1
   ```

#### Step 4: GitHub Actions Builds Release

- Check Actions tab - wait for build to complete
- Release tab - new v1.0.1 release should appear with installers

#### Step 5: Test Auto Update

1. **Open installed v1.0.0 app**
2. **App automatically checks for updates** (on startup)
3. **Update banner appears** showing:
   - Version number
   - Download progress
   - Release date
4. **Click "Update Now"** button
5. **App downloads and installs update**
6. **After restart, shows "Hello World v2"** ✅

## GitHub Actions Workflow

The `.github/workflows/release.yml` file automatically:

1. **Triggers on version tags** (`v*` pattern)
2. **Builds on multiple OS** (Windows, macOS)
3. **Creates GitHub Release** automatically
4. **Uploads installers**:
   - `.exe` for Windows
   - `.dmg` for macOS
5. **Updates are discoverable** by electron-updater

## IPC Events & API

The app uses secure IPC communication via the preload script:

### Available Methods

```typescript
// Get current version
await window.electron.getAppVersion()
// Returns: "1.0.0"

// Check for updates
await window.electron.checkForUpdates()
// Returns: { updateAvailable: boolean, currentVersion: string }

// Install downloaded update
await window.electron.installUpdate()

// Listen for update available
window.electron.onUpdateAvailable((info) => {
  console.log(info.version, info.releaseDate)
})

// Listen for download progress
window.electron.onUpdateProgress((progress) => {
  console.log(progress.percent) // 0-100
})

// Listen for update ready
window.electron.onUpdateDownloaded(() => {
  console.log('Ready to install')
})

// Listen for errors
window.electron.onUpdateError((error) => {
  console.error(error.error)
})
```

## Configuration

### electron-builder (in package.json)

The app is configured to:
- **App ID**: `com.trustinn.app`
- **Product Name**: `TrustInn`
- **GitHub Provider**: Publishes to GitHub Releases
- **Windows Target**: NSIS installer
- **macOS Target**: DMG installer

### Auto-Updater Settings

- Checks for updates automatically on startup (3 second delay)
- Uses GitHub Releases as provider
- Downloads full releases, not deltas
- Shows download progress in UI

## Troubleshooting

### "Cannot find module 'electron-is-dev'"

```bash
npm install electron-is-dev
```

### "GITHUB_TOKEN not found"

GitHub Actions automatically provides this token. No manual setup needed.

### App doesn't show update banner

1. Ensure you're running the installed version (not dev mode)
2. Check that new version tag is pushed: `git push origin v1.0.1`
3. Wait for GitHub Actions to complete
4. Manually check: Help → Check for Updates

### electron-builder errors on macOS

For code signing, either:
- Skip signing: Add `--publish never` to build script
- Or provide signing certificate in GitHub secrets

For local dev, signing is disabled in build config.

### Development mode vs Production

- **Development**: `npm run dev` - Loads from Vite dev server, auto-reload enabled
- **Production**: Built installers - Loads from bundle, checks for updates

## Scripts Reference

```bash
npm run dev                 # Start dev server and Electron
npm run dev:vite          # Start only Vite dev server
npm run dev:electron      # Start only Electron (after dev:vite)
npm run build             # Build React + package Electron
npm run build:vite        # Build React only
npm run build:electron    # Package Electron only
npm run release           # Full release build (used by CI/CD)
npm run pack              # Create installer without publishing
npm run dist              # Alias for build:electron
```

## Code Signing (Production)

**TODO**: For production release:

1. Obtain Windows code signing certificate
2. Add to GitHub secrets as `WINDOWS_CERT_FILE` and `WINDOWS_CERT_PASSWORD`
3. Update `package.json` build config
4. Obtain macOS Developer ID
5. Configure in build environment

For local development, signing is disabled.

## Updating the UI

To test updates with different content:

1. Edit `src/renderer/App.tsx` - Change the greeting text
2. Update version in `package.json`
3. Create git tag: `git tag v1.0.X`
4. Push: `git push origin main && git push origin v1.0.X`
5. GitHub Actions builds automatically
6. Installed app detects new version and prompts update

## Branch Strategy

- **test**: Development branch - no releases
- **main**: Production branch - tags here trigger releases

## License

MIT

## Support

For issues, please create a GitHub issue in the repository.

---

**Happy coding! 🚀**
