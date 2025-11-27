# Start all Trilix Atlassian MCP Server services
# This script starts all three services in separate background processes

Write-Host "Starting Trilix Atlassian MCP Server services..." -ForegroundColor Cyan
Write-Host ""

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$goPath = "C:\Program Files\Go\bin\go.exe"

# Check if Go is available
if (-not (Test-Path $goPath)) {
    Write-Host "Error: Go not found at $goPath" -ForegroundColor Red
    Write-Host "Please install Go or update the path in this script." -ForegroundColor Yellow
    exit 1
}

# Check if .env file exists
if (-not (Test-Path "$projectRoot\.env")) {
    Write-Host "Warning: .env file not found. Services may fail to start." -ForegroundColor Yellow
}

# Start Confluence Service
Write-Host "Starting Confluence Service..." -ForegroundColor Green
Start-Process -FilePath $goPath -ArgumentList "run","main.go" -WorkingDirectory "$projectRoot\cmd\confluence-service" -WindowStyle Hidden
Start-Sleep -Seconds 1

# Start Jira Service
Write-Host "Starting Jira Service..." -ForegroundColor Green
Start-Process -FilePath $goPath -ArgumentList "run","main.go" -WorkingDirectory "$projectRoot\cmd\jira-service" -WindowStyle Hidden
Start-Sleep -Seconds 1

# Start MCP Server
Write-Host "Starting MCP Server..." -ForegroundColor Green
Start-Process -FilePath $goPath -ArgumentList "run","main.go" -WorkingDirectory "$projectRoot\cmd\mcp-server" -WindowStyle Hidden
Start-Sleep -Seconds 2

Write-Host ""
Write-Host "All services started!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Services running:" -ForegroundColor Yellow
Write-Host "  - Confluence Service" -ForegroundColor White
Write-Host "  - Jira Service" -ForegroundColor White
Write-Host "  - MCP Server" -ForegroundColor White
Write-Host ""
Write-Host "To stop services, use: .\stop-services.ps1" -ForegroundColor Gray
Write-Host "Or find and kill the Go processes manually." -ForegroundColor Gray

