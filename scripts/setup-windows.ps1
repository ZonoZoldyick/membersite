param(
  [switch]$StartDevServer
)

$ErrorActionPreference = "Stop"

function Write-Step {
  param([string]$Message)
  Write-Host ""
  Write-Host "==> $Message" -ForegroundColor Cyan
}

function Assert-CommandExists {
  param([string]$CommandName)

  if (-not (Get-Command $CommandName -ErrorAction SilentlyContinue)) {
    throw "Required command not found: $CommandName"
  }
}

function Assert-NodeVersion {
  $nodeVersionText = (node --version).TrimStart("v")
  $nodeVersion = [Version]$nodeVersionText
  $minimumVersion = [Version]"18.18.0"

  if ($nodeVersion -lt $minimumVersion) {
    throw "Node.js $minimumVersion or newer is required. Current version: $nodeVersionText"
  }
}

$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Resolve-Path (Join-Path $scriptDirectory "..")

Set-Location $projectRoot

Write-Step "Checking required tools"
Assert-CommandExists -CommandName "node"
Assert-CommandExists -CommandName "npm"
Assert-NodeVersion

Write-Host "Node version: $(node --version)"
Write-Host "npm version: $(npm --version)"

Write-Step "Installing dependencies"
npm install

Write-Step "Running type check"
npm run type-check

Write-Step "Running production build"
npm run build

if ($StartDevServer) {
  Write-Step "Starting development server"
  npm run dev
}
else {
  Write-Step "Setup complete"
  Write-Host "Run the following to start the dev server:" -ForegroundColor Green
  Write-Host "  powershell -ExecutionPolicy Bypass -File .\scripts\setup-windows.ps1 -StartDevServer"
}
