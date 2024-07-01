Write-Output "Starting compilation..."
tsc #compiles typescript to javascript
lessc .\styles\formatting.less .\styles\formatting.css # Compiles less to css 
Write-Output "Ending compilation..."

dotnet run
