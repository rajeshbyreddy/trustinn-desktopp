# Development Guide

This document provides detailed instructions for developing the TrustInn desktop application.

## Environment Setup

### Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- npm 9+ (comes with Node.js)
- Git
- For macOS: Xcode Command Line Tools (`xcode-select --install`)
- For Windows: Visual Studio Build Tools (optional, for native dependencies)

### Initial Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/rajeshbyreddy/trustinn-desktopp.git
   cd trustinn
   ```

2. **Create and switch to test branch**:
   ```bash
   git checkout -b test origin/test
   # or if it doesn't exist:
   git checkout -b test
   git push origin test
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Verify setup**:
   ```bash
   npm run dev
   ```
   The app should launch with the React dev server.

## Development Workflow

### Running in Development Mode

```bash
npm run dev
```

This command:
- Starts Vite development server on `http://localhost:5173`
- Launches Electron with hot-reload capabilities
- Opens DevTools for debugging
- Watches for file changes

**Changes are automatically reflected in the app!**

### Making Code Changes

#### React Component Changes

1. Edit files in `src/renderer/` (App.tsx, App.css, etc.)
2. Save the file
3. The app automatically reloads with your changes

#### Electron Main Process Changes

1. Edit `src/main/main.ts` or `src/main/preload.ts`
2. Save the file
3. Electron automatically restarts with your changes

#### Testing IPC Communication

The app includes debugging for IPC messages. Open DevTools (F12) to see:
- Update events
- Download progress
- Version checks
- Errors

### Building for Testing

#### Local Build (No Release)

```bash
npm run build
```

This creates:
- `dist/` - Built React app
- `out/` - Electron packages for your OS

#### Testing on test Branch

1. Push to test branch:
   ```bash
   git add .
   git commit -m "feat: my changes"
   git push origin test
   ```

2. GitHub Actions will build on all platforms
3. Download artifacts from Actions tab
4. Extract and test locally

#### Package without Publishing

```bash
npm run pack
```

Creates unsigned packages in the `out/` directory.

## Testing Auto-Updates

### Full Update Cycle Test

#### Phase 1: Create v1.0.0 Release

1. **Ensure you're on main branch**:
   ```bash
   git checkout main
   git pull origin main
   ```

2. **App currently shows**: "Hello World v1"
3. **Version in package.json**: 1.0.0

4. **Create release tag**:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

5. **Wait for GitHub Actions**:
   - Go to repository → Actions tab
   - Wait for "Release" workflow to complete
   - Should take 5-10 minutes

6. **Check Releases**:
   - Go to repository → Releases
   - Should see v1.0.0 with installers
   - For macOS: `.dmg` file
   - For Windows: `.exe` file

7. **Install the app**:
   - Download appropriate installer
   - Install to Applications (macOS) or Program Files (Windows)
   - Run the app
   - Should show "Hello World v1"

#### Phase 2: Install & Test Update Check

1. **Open installed app**
   - Shows "Hello World v1"
   - Version: v1.0.0

2. **Click "Check for Updates"**
   - Should say "You are running the latest version!"
   - (No update available yet)

#### Phase 3: Create v1.0.1 Update

1. **Switch to main branch and pull latest**:
   ```bash
   git checkout main
   git pull origin main
   ```

2. **Update the greeting** in `src/renderer/App.tsx`:
   ```typescript
   // Change this line:
   <h1 className="title">Hello World v1</h1>
   
   // To this:
   <h1 className="title">Hello World v2</h1>
   ```

3. **Update version** in `package.json`:
   ```json
   "version": "1.0.1"
   ```

4. **Commit and tag**:
   ```bash
   git add package.json src/renderer/App.tsx
   git commit -m "chore: update to v1.0.1 with v2 content"
   git tag v1.0.1
   git push origin main
   git push origin v1.0.1
   ```

5. **Wait for GitHub Actions**:
   - Check Actions tab again
   - Build should complete in 5-10 minutes

6. **Verify Release**:
   - Go to Releases
   - Should see v1.0.1 with new installers

#### Phase 4: Test Auto-Update in Installed App

1. **Open the installed v1.0.0 app**
   - Still shows "Hello World v1"

2. **Wait for update detection** (happens on startup):
   - Should see update banner appear
   - Shows version 1.0.1
   - Shows release date
   - Download starts automatically

3. **Watch download progress**:
   - Progress bar fills 0-100%
   - Shows download speed

4. **When complete**:
   - Banner changes to "Update Ready to Install"
   - Button changes to "Update Now"

5. **Click "Update Now"**:
   - App quits
   - Update installs
   - App relaunches

6. **Verify update**:
   - App now shows "Hello World v2"
   - Version is v1.0.1
   - Success! ✅

### Debugging Auto-Updates

If updates don't work:

1. **Check app logs**:
   - Open DevTools in app
   - Look for update events
   - Check for error messages

2. **Verify GitHub Release**:
   - Check if release was created
   - Verify installer files are uploaded
   - Check release notes

3. **Check electron-updater config**:
   - In `package.json`, verify GitHub provider is configured
   - Check GitHub repo is correct: `rajeshbyreddy/trustinn-desktopp`

4. **Manual trigger**:
   - In app menu: Help → Check for Updates
   - Should log results in console

### Testing Multiple Updates

To test jumping versions (v1.0.0 → v1.0.2 skipping v1.0.1):

1. Create v1.0.1 as above
2. After installed app updates to v1.0.1
3. Create v1.0.2 with more content changes
4. App should detect and upgrade to latest

## Troubleshooting

### Issue: "npm install" fails

**Solution**: Clear cache and retry
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Issue: Vite dev server doesn't start

**Solution**: Check port is free
```bash
lsof -i :5173  # macOS/Linux
netstat -ano | findstr :5173  # Windows
```

Kill process or change port in `vite.config.ts`.

### Issue: Electron doesn't reload after changes

**Solution**: Restart dev session
```bash
# Stop npm run dev
Ctrl+C

# Restart
npm run dev
```

### Issue: "ENOTFOUND" errors on startup

**Solution**: electron-reload issue
- Try restarting dev session
- Check that Vite server is running
- Verify ports in use: Vite (5173), Electron

### Issue: Can't find built app

**Solution**: Check build output
```bash
# Check if built successfully
npm run build

# Look in:
ls out/            # Electron packages
ls dist/           # React build
```

### Issue: GitHub Actions fails

**Common causes**:
1. Tag wasn't pushed: `git push origin v1.0.0`
2. Branch is `test` not `main`: Tags on main only
3. No GITHUB_TOKEN: Added automatically by Actions
4. Permission error: Check repo settings

## Development Tips

### Using console.log in Electron

Main process logs appear in terminal where you ran `npm run dev`.

Renderer logs appear in DevTools console (F12 in app).

### Viewing IPC Debug Info

Add to `src/main/main.ts` for debug logging:
```typescript
ipcMain.handle('check-for-updates', async () => {
  console.log('IPC: check-for-updates called')  // <-- Add this
  // ... rest of code
})
```

Then check terminal output while running `npm run dev`.

### Testing Offline

Update checking requires internet. To test locally without GitHub:
1. Use `npm run dev:vite` and `npm run dev:electron` separately
2. Electron will skip auto-update in dev mode
3. Test IPC directly through DevTools

## Next Steps

1. ✅ Run `npm run dev` - Confirm it works
2. ✅ Make a small change to App.tsx - Verify hot-reload
3. ✅ Push to test branch - Check GitHub Actions
4. ✅ Create v1.0.0 release - Test install
5. ✅ Create v1.0.1 and test update flow

## Getting Help

- Check [Electron docs](https://www.electronjs.org/docs)
- Check [electron-updater docs](https://www.electron.build/auto-update)
- Check [Vite docs](https://vitejs.dev/)
- Check GitHub Issues for similar problems
