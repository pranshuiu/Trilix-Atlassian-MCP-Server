# Stop all Trilix Atlassian MCP Server services

Write-Host "Stopping Trilix Atlassian MCP Server services..." -ForegroundColor Cyan
Write-Host ""

# Find and stop Go processes running main.go
$processes = Get-Process | Where-Object {
    $_.ProcessName -eq "go" -and 
    (Get-WmiObject Win32_Process -Filter "ProcessId = $($_.Id)").CommandLine -like "*main.go*"
}

if ($processes.Count -eq 0) {
    Write-Host "No running services found." -ForegroundColor Yellow
    exit 0
}

Write-Host "Found $($processes.Count) service(s) to stop..." -ForegroundColor Yellow

foreach ($process in $processes) {
    Write-Host "Stopping process $($process.Id)..." -ForegroundColor Green
    Stop-Process -Id $process.Id -Force
}

Start-Sleep -Seconds 1
Write-Host ""
Write-Host "All services stopped." -ForegroundColor Cyan

