# Testing and Verification Guide

This guide walks you through testing the complete auto-update functionality.

## Pre-Testing Checklist

- [ ] Repository created on GitHub
- [ ] Remote URL is correct: `https://github.com/rajeshbyreddy/trustinn-desktopp.git`
- [ ] Local git configured with GitHub credentials
- [ ] Node.js 18+ installed
- [ ] npm installed
- [ ] Dependencies installed: `npm install`

## Quick Verification Steps

### Step 1: Verify Development Setup (5 minutes)

```bash
# Should display version info
node -v
npm -v
git -v

# Should clone successfully
git clone https://github.com/rajeshbyreddy/trustinn-desktopp.git
cd trustinn

# Should install without errors
npm install

# Should start without errors
npm run dev
```

**Expected**: Electron app launches with "Hello World v1" and React hot-reload works.

### Step 2: Create Initial Release (15 minutes)

#### 2a. Verify main branch

```bash
# Check current branch
git branch -a

# If on test, switch to main
git checkout main

# Verify package.json shows version 1.0.0
grep '"version"' package.json
```

#### 2b. Create v1.0.0 tag

```bash
# Tag current commit
git tag v1.0.0

# Push tag to trigger GitHub Actions
git push origin v1.0.0

# Verify tag was pushed
git tag -l v1.0.0
git show v1.0.0
```

#### 2c. Monitor GitHub Actions

1. Go to: `https://github.com/rajeshbyreddy/trustinn-desktopp/actions`
2. Should see "Release" workflow running
3. Wait for all jobs to complete (5-15 minutes)
4. All checks should pass ✅

#### 2d. Verify Release Created

1. Go to: `https://github.com/rajeshbyreddy/trustinn-desktopp/releases`
2. Should see **v1.0.0** release
3. Should have installer files:
   - Windows: `.exe` file
   - macOS: `.dmg` file
4. Release notes should be auto-generated

### Step 3: Install Application (10 minutes)

1. **Download installer**
   - Go to v1.0.0 release
   - Download appropriate file for your OS

2. **Install**
   - macOS: Open `.dmg`, drag app to Applications
   - Windows: Run `.exe`, follow installer

3. **Launch app**
   - Should show "Hello World v1"
   - Version: 1.0.0
   - No update available (correct - we just installed latest)

### Step 4: Create Update (v1.0.1)

#### 4a. Prepare changes

```bash
# Ensure on main branch
git checkout main
git pull origin main
```

#### 4b. Make content change

Edit `src/renderer/App.tsx`:
```typescript
// Line with <h1>
// Change from:
<h1 className="title">Hello World v1</h1>

// To:
<h1 className="title">Hello World v2</h1>
```

#### 4c. Update version

Edit `package.json`:
```json
{
  "version": "1.0.1"
}
```

#### 4d. Commit and tag

```bash
# Stage changes
git add package.json src/renderer/App.tsx

# Commit with message
git commit -m "chore: bump to v1.0.1 with updated content"

# Create tag
git tag v1.0.1

# Push everything
git push origin main
git push origin v1.0.1

# Verify
git log --oneline -5
git tag -l | grep v1.0.1
```

#### 4e. Monitor Actions again

- Check GitHub Actions for build completion
- Verify v1.0.1 release is created with new installers

### Step 5: Test Auto-Update (10 minutes)

#### 5a. Trigger update check

1. **Open the installed v1.0.0 app**
2. App automatically checks for updates on startup
3. Wait 3-5 seconds

#### 5b. Watch for update banner

Should see:
- 📥 "Downloading Update" banner
- Version 1.0.1 showing
- Download progress 0-100%
- Download speed (KB/s or MB/s)

#### 5c. Wait for download completion

Banner changes to:
- ✅ "Update Ready to Install"
- New button: "🚀 Update Now"
- "Update Now" and "Remind Me Later" buttons

#### 5d. Install update

1. Click "🚀 Update Now"
2. App quits
3. Update installs (takes a few seconds)
4. App relaunches automatically

#### 5e. Verify update applied

After app relaunches:
- Should show "Hello World v2" ✅
- Version: 1.0.1 ✅
- Content updated ✅

**Success!** Auto-update worked end-to-end.

## Detailed Verification Checklist

### GitHub Setup
- [ ] Repository exists at `https://github.com/rajeshbyreddy/trustinn-desktopp`
- [ ] Repository is public (for GitHub Releases)
- [ ] GitHub token available (auto-added by Actions)

### Local Development
- [ ] `npm install` completes without errors
- [ ] `npm run dev` starts Electron successfully
- [ ] React hot-reload works (change App.tsx, see it update)
- [ ] DevTools open and show no console errors

### Release v1.0.0
- [ ] `git tag v1.0.0` creates tag
- [ ] `git push origin v1.0.0` pushes tag
- [ ] GitHub Actions "Release" workflow triggers
- [ ] Build completes on both Windows and macOS
- [ ] Release created at `/releases/tag/v1.0.0`
- [ ] Installers uploaded (.exe and .dmg)

### Installation
- [ ] Downloaded installer matches OS
- [ ] Installer launches without errors
- [ ] App installs to correct location
  - macOS: `/Applications/TrustInn.app`
  - Windows: `C:\Program Files\TrustInn\`
- [ ] Installed app launches successfully
- [ ] App shows "Hello World v1"
- [ ] Version displays correctly (1.0.0)

### Update Detection
- [ ] No update banner appears initially (correct)
- [ ] Clicking "Check for Updates" says "up to date"
- [ ] No console errors in DevTools

### Update v1.0.1
- [ ] Content changed in source (v2 text added)
- [ ] Version bumped in package.json
- [ ] Changes committed with `git commit`
- [ ] Tag created with `git tag v1.0.1`
- [ ] Tag pushed with `git push origin v1.0.1`
- [ ] GitHub Actions triggers build
- [ ] v1.0.1 release created with new installers

### Auto-Update in Installed App
- [ ] Update banner appears 3-5 seconds after launch
- [ ] Banner shows correct version (1.0.1)
- [ ] Banner shows download progress
- [ ] Download completes (100%)
- [ ] Banner changes to "Update Ready"
- [ ] Clicking "Update Now" triggers install
- [ ] App restarts
- [ ] App shows new content ("Hello World v2")
- [ ] App version shows 1.0.1

## Troubleshooting During Testing

### Issue: Tag not pushing

```bash
# Verify tag was created
git tag -l v1.0.0

# Check remote
git remote -v

# Force push if needed
git push --force origin v1.0.0
```

### Issue: GitHub Actions doesn't trigger

1. Go to repository → Actions tab
2. Manually check "Release" workflow exists
3. Check that tag was pushed (not just created locally)
4. Verify tag matches pattern `v*`

### Issue: Release not created

1. Check Actions tab for error messages
2. Common issues:
   - No GITHUB_TOKEN (auto-provided by GitHub Actions)
   - Build failed (check logs)
   - Files not found for upload

### Issue: App doesn't show update banner

1. Close and reopen app
2. Wait 3-5 seconds on startup
3. Check DevTools console for errors
4. Try "Check for Updates" button manually

### Issue: Update can't be installed

1. Check file permissions in installation directory
2. Ensure app can write to installation location
3. Try reinstalling v1.0.0 first
4. Check disk space (need ~200MB free)

## Performance Notes

### Expected Timing

- **npm install**: 1-3 minutes
- **npm run dev**: 30-60 seconds to launch
- **npm run build**: 2-5 minutes
- **GitHub Actions build**: 5-15 minutes per OS
- **Update download**: Depends on network
  - Fast (10+ MB/s): < 10 seconds
  - Slow (1 MB/s): ~60 seconds
- **Update install**: 5-10 seconds

### System Requirements

- **Disk space**: 500 MB minimum
- **RAM**: 2 GB recommended
- **Network**: 10+ Mbps recommended for testing

## Success Indicators

✅ **You've succeeded when:**

1. App builds and runs locally
2. v1.0.0 release created and installer works
3. Installed app launches correctly
4. v1.0.1 update detected automatically
5. Update banner shows correct information
6. Clicking "Update Now" installs and relaunches
7. New version displays new content
8. No console errors anywhere

🎉 **Congratulations! Production-ready auto-update is working!**

## Next Steps

After successful testing:

1. **Documentation**: Update release notes in GitHub
2. **Branding**: Replace placeholder icon with real logo
3. **Code Signing**: Set up proper signing for production
4. **Analytics**: Add usage tracking if needed
5. **Additional Features**: Implement custom features

## Advanced Testing

### Test Skipping Versions

Create v1.0.2 while on v1.0.1:
- Installed v1.0.0 app should update to v1.0.2 (latest)
- Skips v1.0.1 and goes directly to v1.0.2

### Test Offline Handling

While update is available:
1. Disconnect internet
2. Try to click "Update Now"
3. Should show error gracefully
4. Reconnect internet
5. Should retry automatically

### Test Multiple Machines

Install v1.0.0 on different machines:
- Windows
- macOS
- Different architectures if available

Each should detect v1.0.1 independently.
