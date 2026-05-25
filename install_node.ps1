# install_node.ps1
# Script to download and set up portable Node.js inside the workspace if not installed on the system.

$ProgressPreference = 'SilentlyContinue'
$nodeDir = Join-Path -Path $pwd -ChildPath "node_portable"
$zipPath = Join-Path -Path $pwd -ChildPath "node.zip"

if (-not (Test-Path $nodeDir)) {
    Write-Host "=============================================" -ForegroundColor Cyan
    Write-Host "🚀 Portable Node.js Installer for Resume Analyzer" -ForegroundColor Cyan
    Write-Host "=============================================" -ForegroundColor Cyan
    Write-Host "Node.js not detected on system PATH. Downloading portable Node.js LTS v20.12.2..." -ForegroundColor Yellow
    
    $url = "https://nodejs.org/dist/v20.12.2/node-v20.12.2-win-x64.zip"
    
    try {
        Invoke-WebRequest -Uri $url -OutFile $zipPath
        Write-Host "Extracting portable zip file..." -ForegroundColor Yellow
        Expand-Archive -Path $zipPath -DestinationPath $pwd
        
        $extractedFolder = Join-Path -Path $pwd -ChildPath "node-v20.12.2-win-x64"
        if (Test-Path $extractedFolder) {
            Rename-Item -Path $extractedFolder -NewName "node_portable"
            Write-Host "🟢 Portable Node.js successfully set up inside: $nodeDir" -ForegroundColor Green
        }
    } catch {
        Write-Host "❌ Failed to download or extract Node.js. Error: $_" -ForegroundColor Red
        if (Test-Path $zipPath) { Remove-Item -Path $zipPath -Force }
        exit 1;
    } finally {
        if (Test-Path $zipPath) { Remove-Item -Path $zipPath -Force }
    }
} else {
    Write-Host "🟢 Portable Node.js already active in workspace." -ForegroundColor Green
}

# Add local Node to path for the running terminal session
$env:PATH = "$nodeDir;$env:PATH"

Write-Host "Verifying Local Environment binaries:" -ForegroundColor Cyan
Write-Host "Node: $(node -v)" -ForegroundColor Green
Write-Host "NPM: $(npm -v)" -ForegroundColor Green
