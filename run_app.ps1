# run_app.ps1
# Script to configure local PATH, install dependencies, and launch both Backend and Frontend dev servers concurrently.

$ProgressPreference = 'SilentlyContinue'
$nodeDir = Join-Path -Path $pwd -ChildPath "node_portable"

if (-not (Test-Path $nodeDir)) {
    Write-Host "Local Node.js portable environment not found. Please run install_node.ps1 first." -ForegroundColor Red
    exit 1
}

# Prepend portable Node.js to PATH
$env:PATH = "$nodeDir;$env:PATH"
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "Booting AI-Based Resume Analyzer" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "Node version: $(node -v)" -ForegroundColor Green
Write-Host "NPM version:  $(npm -v)" -ForegroundColor Green

# 1. Check & Install Dependencies
$installNeeded = $false
$modulesToCheck = @(
    (Join-Path -Path $pwd -ChildPath "node_modules"),
    (Join-Path -Path (Join-Path -Path $pwd -ChildPath "backend") -ChildPath "node_modules"),
    (Join-Path -Path (Join-Path -Path $pwd -ChildPath "frontend") -ChildPath "node_modules")
)

foreach ($dir in $modulesToCheck) {
    if (-not (Test-Path $dir)) {
        $installNeeded = $true
        break
    }
}

if ($installNeeded) {
    Write-Host "Installing project dependencies (Root, Backend, and Frontend)..." -ForegroundColor Yellow
    
    Write-Host "Installing Root dependencies..." -ForegroundColor Yellow
    npm install
    
    Write-Host "Installing Backend dependencies..." -ForegroundColor Yellow
    cd backend
    npm install
    cd ..
    
    Write-Host "Installing Frontend dependencies..." -ForegroundColor Yellow
    cd frontend
    npm install
    cd ..
    
    Write-Host "All dependencies installed successfully!" -ForegroundColor Green
} else {
    Write-Host "Dependencies already verified and cached." -ForegroundColor Green
}

# 2. Start servers concurrently
Write-Host "Launching backend and frontend dev servers concurrently..." -ForegroundColor Cyan
Write-Host "Backend API will run on http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend dashboard will run on http://localhost:5173" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

npm run dev
