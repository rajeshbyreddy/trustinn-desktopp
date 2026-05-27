#!/bin/bash

echo "🚀 TrustInn Desktop App - Quick Start Setup"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
  echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
  exit 1
fi

echo "✅ Node.js $(node -v)"
echo "✅ npm $(npm -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Start development: npm run dev"
echo "2. Build for production: npm run build"
echo "3. See README.md for detailed instructions"
echo ""
