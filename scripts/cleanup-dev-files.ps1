# PowerShell script to clean up development files from a Next.js project
# Run this script as: ./scripts/cleanup-dev-files.ps1 -Mode [Backup|List|Clean]

param (
    [Parameter(Mandatory=$false)]
    [ValidateSet("Backup", "List", "Clean")]
    [string]$Mode = "List"
)

$projectRoot = (Get-Location).Path

# Files and directories that are not needed in production
$devFilesToRemove = @(
    ".git",
    ".gitignore",
    "tmp",
    "SUPABASE_QUERIES.md",
    "GOOGLE_AUTH_SETUP.md",
    "learning_paths_sql_queries.sql",
    ".env.example",
    "docker-compose.yml",
    "scripts/supabase-setup.sql",
    "scripts/minimal-setup.sql",
    "scripts/create-test-function.sql",
    "scripts/create-get-tables-function.sql", 
    "scripts/create-learning-tables.sql",
    "scripts/manage-compiler.ts"
    # Not removing the script itself, so you can run it multiple times
)

# Function to verify a path exists
function Test-PathExists {
    param([string]$path)
    $fullPath = Join-Path -Path $projectRoot -ChildPath $path
    return Test-Path -Path $fullPath
}

# Function to safely remove a file or directory
function Remove-DevItem {
    param([string]$path)
    $fullPath = Join-Path -Path $projectRoot -ChildPath $path
    
    if (-not (Test-Path -Path $fullPath)) {
        Write-Host "Skipping $path (not found)" -ForegroundColor Yellow
        return
    }
    
    try {
        if (Test-Path -Path $fullPath -PathType Container) {
            Write-Host "Removing directory: $path" -ForegroundColor Cyan
            Remove-Item -Path $fullPath -Recurse -Force
        } else {
            Write-Host "Removing file: $path" -ForegroundColor Cyan
            Remove-Item -Path $fullPath -Force
        }
        Write-Host "Successfully removed: $path" -ForegroundColor Green
    } catch {
        Write-Host "Error removing $path: $_" -ForegroundColor Red
    }
}

# Create a backup of the project
function Backup-Project {
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $backupDir = Join-Path -Path $projectRoot -ChildPath "backup_$timestamp"
    
    Write-Host "Creating project backup in $backupDir" -ForegroundColor Cyan
    
    # Create backup directory
    New-Item -Path $backupDir -ItemType Directory | Out-Null
    
    # Copy package.json and other important files
    Copy-Item -Path (Join-Path -Path $projectRoot -ChildPath "package.json") -Destination $backupDir
    Copy-Item -Path (Join-Path -Path $projectRoot -ChildPath "next.config.mjs") -Destination $backupDir -ErrorAction SilentlyContinue
    
    Write-Host "Backup created successfully!" -ForegroundColor Green
}

# List files that would be removed
function List-FilesToRemove {
    Write-Host "The following development files can be removed:" -ForegroundColor White
    
    foreach ($file in $devFilesToRemove) {
        $exists = Test-PathExists -path $file
        if ($exists) {
            Write-Host " - $file" -ForegroundColor Cyan
        } else {
            Write-Host " - $file (not found)" -ForegroundColor Gray
        }
    }
    
    Write-Host "`nTo clean up these files, run this script with the 'Clean' parameter:" -ForegroundColor Yellow
    Write-Host "./scripts/cleanup-dev-files.ps1 -Mode Clean" -ForegroundColor Yellow
}

# Main script execution
Write-Host "Next.js Project Development Files Cleanup" -ForegroundColor Magenta
Write-Host "=========================================" -ForegroundColor Magenta

switch ($Mode) {
    "Backup" {
        Backup-Project
    }
    "List" {
        List-FilesToRemove
    }
    "Clean" {
        Write-Host "WARNING: This will permanently remove development files." -ForegroundColor Red
        $confirmation = Read-Host "Are you sure you want to continue? (Y/N)"
        
        if ($confirmation -eq "Y" -or $confirmation -eq "y") {
            Backup-Project  # Always create a backup first
            
            Write-Host "Starting cleanup of development files..." -ForegroundColor White
            foreach ($file in $devFilesToRemove) {
                Remove-DevItem -path $file
            }
            
            Write-Host "`nCleanup completed!" -ForegroundColor Green
            Write-Host "`nNext steps for production:" -ForegroundColor Yellow
            Write-Host "1. Run 'npm run build' or 'yarn build' to create a production build" -ForegroundColor Yellow
            Write-Host "2. Set proper environment variables for production" -ForegroundColor Yellow
            Write-Host "3. Consider using a CI/CD pipeline for automated deployments" -ForegroundColor Yellow
        } else {
            Write-Host "Cleanup cancelled." -ForegroundColor Yellow
        }
    }
} 