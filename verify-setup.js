#!/usr/bin/env node

/**
 * Verification script to check if the development environment is properly set up
 * Run with: node verify-setup.js
 */

import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function check(name, fn) {
  try {
    const result = fn()
    log(`✅ ${name}`, 'green')
    return true
  } catch (error) {
    log(`❌ ${name}`, 'red')
    if (error.message) {
      log(`   ${error.message}`, 'yellow')
    }
    return false
  }
}

function exec(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf-8', stdio: 'pipe' }).trim()
  } catch (error) {
    throw new Error(`Command failed: ${cmd}`)
  }
}

log('\n🔍 Verifying TrustInn Development Setup\n', 'blue')

let passed = 0
let failed = 0

// Check Node.js
if (check('Node.js installed', () => exec('node --version'))) {
  const version = exec('node --version')
  const major = parseInt(version.split('.')[0].slice(1))
  if (major < 18) {
    log(`   ⚠️  Node.js ${version} is older than recommended (18+)`, 'yellow')
  } else {
    passed++
  }
} else {
  failed++
}

// Check npm
if (check('npm installed', () => exec('npm --version'))) {
  passed++
} else {
  failed++
}

// Check git
if (check('Git installed', () => exec('git --version'))) {
  passed++
} else {
  failed++
}

// Check file structure
if (check('package.json exists', () => {
  if (!fs.existsSync('package.json')) throw new Error('package.json not found')
})) {
  passed++
} else {
  failed++
}

if (check('src/renderer/App.tsx exists', () => {
  if (!fs.existsSync('src/renderer/App.tsx')) throw new Error('React component missing')
})) {
  passed++
} else {
  failed++
}

if (check('src/main/main.ts exists', () => {
  if (!fs.existsSync('src/main/main.ts')) throw new Error('Electron main process missing')
})) {
  passed++
} else {
  failed++
}

if (check('src/main/preload.ts exists', () => {
  if (!fs.existsSync('src/main/preload.ts')) throw new Error('Preload script missing')
})) {
  passed++
} else {
  failed++
}

if (check('.github/workflows/release.yml exists', () => {
  if (!fs.existsSync('.github/workflows/release.yml')) throw new Error('Release workflow missing')
})) {
  passed++
} else {
  failed++
}

// Check node_modules
if (check('Dependencies installed (node_modules)', () => {
  if (!fs.existsSync('node_modules')) throw new Error('Run npm install first')
  if (!fs.existsSync('node_modules/electron')) throw new Error('Electron not installed')
  if (!fs.existsSync('node_modules/react')) throw new Error('React not installed')
  if (!fs.existsSync('node_modules/electron-builder')) throw new Error('electron-builder not installed')
  if (!fs.existsSync('node_modules/electron-updater')) throw new Error('electron-updater not installed')
})) {
  passed++
} else {
  failed++
}

// Check git configuration
if (check('Git configured with user', () => {
  const name = exec('git config user.name')
  const email = exec('git config user.email')
  if (!name || !email) throw new Error('Git user not configured')
})) {
  passed++
} else {
  failed++
  log('   Fix with: git config --global user.name "Your Name" && git config --global user.email "your@email.com"', 'yellow')
}

// Check git remote
if (check('Git remote configured', () => {
  const remote = exec('git remote get-url origin')
  if (!remote.includes('trustinn')) throw new Error('Git remote not set correctly')
})) {
  passed++
} else {
  failed++
  log('   Expected: https://github.com/rajeshbyreddy/trustinn-desktopp.git', 'yellow')
}

// Summary
log('\n' + '='.repeat(50), 'blue')
log(`\nResults: ${passed} passed, ${failed} failed\n`, failed === 0 ? 'green' : 'red')

if (failed === 0) {
  log('✅ Environment is ready for development!', 'green')
  log('\nNext steps:', 'blue')
  log('1. Run: npm run dev', 'reset')
  log('2. App should launch with hot-reload', 'reset')
  log('3. See README.md for next steps', 'reset')
} else {
  log('❌ Please fix the errors above before continuing', 'red')
  log('\nCommon fixes:', 'yellow')
  log('- npm install          # Install dependencies', 'reset')
  log('- git config --global user.name "Your Name"   # Configure git', 'reset')
  log('- git config --global user.email "your@email" # Configure git', 'reset')
}

log('\n')
process.exit(failed === 0 ? 0 : 1)
