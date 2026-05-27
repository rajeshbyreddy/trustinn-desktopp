@echo off
echo 🚀 TrustInn Desktop App - Quick Start Setup
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo ❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/
  pause
  exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i

echo ✅ Node.js %NODE_VERSION%
echo ✅ npm %NPM_VERSION%
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
  echo ❌ Installation failed
  pause
  exit /b 1
)

echo.
echo ✅ Setup complete!
echo.
echo Next steps:
echo 1. Start development: npm run dev
echo 2. Build for production: npm run build
echo 3. See README.md for detailed instructions
echo.
pause
