# Remove node_modules folder
if (Test-Path -Path "node_modules") {
    Write-Host "Removing node_modules folder..."
    Remove-Item -Path "node_modules" -Recurse -Force
}

# Remove package-lock.json
if (Test-Path -Path "package-lock.json") {
    Write-Host "Removing package-lock.json..."
    Remove-Item -Path "package-lock.json" -Force
}

# Clear npm cache
Write-Host "Clearing npm cache..."
npm cache clean --force

# Install dependencies with legacy-peer-deps flag
Write-Host "Installing dependencies..."
npm install --legacy-peer-deps

Write-Host "Done! Dependencies reinstalled successfully."
