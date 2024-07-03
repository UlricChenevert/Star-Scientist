param (
    [Parameter(Mandatory=$true)][string]$name
)

if (-not ((Test-Path -Path ".\Bin") -and (Test-Path -Path ".\tools"))) {
    throw "File structure test failed. Please run this in your root directory"
}

Write-Output "Starting compilation..."
tsc #compiles typescript to javascript
lessc .\mirror\styles\formatting.less .\wwwroot\styles\formatting.css # Compiles less to css 

dotnet publish # -c Release

Write-Output "Starting github sync..."

git add --all
git commit -m $name
git push

Write-Output "Place Azure sync here!"