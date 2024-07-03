if (-not ((Test-Path -Path ".\Bin") -and (Test-Path -Path ".\tools"))) {
    throw "File structure test failed. Please run this in your root directory"
}

Write-Output "Starting compilation..."
tsc #compiles typescript to javascript
lessc .\mirror\styles\formatting.less .\wwwroot\styles\formatting.css # Compiles less to css 
Write-Output "Ending compilation..."

Write-Output("Localhost link: http://localhost:5283/views/game-page.html")

dotnet run
