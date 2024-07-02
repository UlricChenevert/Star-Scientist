Write-Output "Starting compilation..."
tsc #compiles typescript to javascript
lessc .\mirror\styles\formatting.less .\wwwroot\styles\formatting.css # Compiles less to css 
Write-Output "Ending compilation..."

dotnet publish -c Release

Write-Output "Place Azure sync here!"