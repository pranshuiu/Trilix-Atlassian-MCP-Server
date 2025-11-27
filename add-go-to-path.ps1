# Add Go to PATH for current PowerShell session
# Run this script before using 'go' commands, or add Go to your system PATH permanently

$goPath = "C:\Program Files\Go\bin"

if (Test-Path $goPath) {
    if ($env:PATH -notlike "*$goPath*") {
        $env:PATH += ";$goPath"
        Write-Host "Go added to PATH for this session." -ForegroundColor Green
        Write-Host "Go version:" -ForegroundColor Cyan
        &"$goPath\go.exe" version
    } else {
        Write-Host "Go is already in PATH." -ForegroundColor Yellow
    }
} else {
    Write-Host "Error: Go not found at $goPath" -ForegroundColor Red
    Write-Host "Please install Go from https://go.dev/dl/" -ForegroundColor Yellow
}

Write-Host "`nNote: This only affects the current PowerShell session." -ForegroundColor Gray
Write-Host "To add Go to PATH permanently, add 'C:\Program Files\Go\bin' to your system PATH environment variable." -ForegroundColor Gray

