#!/usr/bin/env node

/**
 * Build script that handles both React (Vite) and Electron main process (TypeScript)
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function run(cmd, options = {}) {
  console.log(`\n▶ ${cmd}`);
  try {
    execSync(cmd, {
      stdio: 'inherit',
      ...options,
    });
  } catch (error) {
    console.error(`✗ Command failed: ${cmd}`);
    process.exit(1);
  }
}

const isDev = process.argv.includes('--dev');
const isWatch = process.argv.includes('--watch');

// Ensure dist directories exist
[
  'dist/main',
  'dist/renderer',
  'out',
].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

console.log('🔨 Building TrustInn Application');

// Build React app with Vite
console.log('\n📦 Building React app with Vite...');
run('vite build');

// Build Electron main process with TypeScript
console.log('\n⚙️ Building Electron main process...');
run('tsc --project . --outDir dist/main --module commonjs --target es2020');

// Copy preload script
console.log('\n📋 Building preload script...');
run('tsc src/main/preload.ts --outDir dist/main --module commonjs --target es2020 --lib es2020,dom');

console.log('\n✅ Build complete!');
console.log('\nNext steps:');
console.log('• Run electron-builder to package: npm run dist');
console.log('• Or: electron-builder');
