<#
.SYNOPSIS
    Powershell helper script to run StockManager components on Windows.
.DESCRIPTION
    Maps Makefile commands to Powershell functions for Windows compatibility.
#>

param (
    [Parameter(Mandatory=$false, Position=0)]
    [ValidateSet("help", "backend", "frontend", "ai-init", "seed-db", "all")]
    [string]$Action = "help",

    [Parameter(Mandatory=$false)]
    [switch]$Light
)

$RootDir = Get-Location

function Check-Docker {
    Write-Host "Checking if Docker daemon is running..." -ForegroundColor Cyan
    $null = docker info 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "`n[ERROR] Docker daemon is not running!" -ForegroundColor Red
        Write-Host "Please start Docker Desktop and ensure it is fully running before starting the backend." -ForegroundColor Yellow
        Write-Host "If Docker Desktop is open, please wait for the engine to initialize.`n" -ForegroundColor Yellow
        throw "Docker is not running."
    }
}

function Load-Env {
    $envPath = Join-Path $RootDir "REST API\.env"
    if (Test-Path $envPath) {
        Write-Host "Loading environment variables from $envPath..." -ForegroundColor Cyan
        Get-Content $envPath | ForEach-Object {
            $line = $_.Trim()
            if ($line -and -not $line.StartsWith("#") -and $line.Contains("=")) {
                $parts = $line.Split('=', 2)
                $key = $parts[0].Trim()
                $value = $parts[1].Trim()
                # Remove quotes if present
                $value = $value -replace '^["'']|["'']$'
                [System.Environment]::SetEnvironmentVariable($key, $value, [System.EnvironmentVariableTarget]::Process)
            }
        }
    } else {
        Write-Warning "No .env file found at $envPath. Using default values."
    }
}

function Show-Help {
    Write-Host "`nStockManager - Available commands (Windows PowerShell):" -ForegroundColor Green
    Write-Host "  .\run.ps1 all       - Run backend and frontend together (opens in separate windows)"
    Write-Host "  .\run.ps1 backend   - Run the backend API and database infrastructure"
    Write-Host "  .\run.ps1 frontend  - Run the React frontend development server"
    Write-Host "  .\run.ps1 ai-init   - Initialize Ollama and vector DB (make sure 'backend' containers are running first)"
    Write-Host "  .\run.ps1 seed-db   - Wipe existing data and seed the WMS database with dummy data"
    Write-Host "  .\run.ps1 help      - Show this help message"
}

function Run-Backend {
    Check-Docker
    Load-Env
    
    # Extract SA password or use default
    $saPassword = $env:MSSQL_SA_PASSWORD
    if (-not $saPassword) { $saPassword = "YourStrong!Passw0rd" }

    # Override specific variables for local development (pointing to Docker containers via localhost)
    $env:ConnectionStrings__DockerConnection = "Server=localhost,1433;Database=StockManagerDb;User Id=sa;Password=$saPassword;TrustServerCertificate=True;Encrypt=False;"
    $env:RABBITMQ__HOST = "127.0.0.1"
    $env:RABBITMQ__PORT = "5672"
    $env:RABBITMQ__USERNAME = "guest"
    $env:RABBITMQ__PASSWORD = "guest"
    $env:REDIS__HOST = "127.0.0.1"
    
    if (-not $env:JWT__Key) {
        $env:JWT__Key = "SuperSecretKey123!_SuperSecretKey123!"
    }

    Write-Host "`n1. Starting Infrastructure (Docker)..." -ForegroundColor Blue
    Set-Location (Join-Path $RootDir "REST API")
    if ($Light) {
        Write-Host "Running in LIGHT mode (starting SQL Server, RabbitMQ, and Redis only)..." -ForegroundColor Yellow
        docker compose up -d sqlserver rabbitmq redis
    } else {
        docker compose up -d sqlserver rabbitmq redis ollama vector_db
    }
    
    Write-Host "`n2. Waiting for SQL Server to be ready..." -ForegroundColor Blue
    while ($true) {
        $output = docker exec stockmanager-sql /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P $saPassword -Q "SELECT 1" -C 2>&1
        if ($LASTEXITCODE -eq 0) { break }
        Write-Host -NoNewline "."
        Start-Sleep -Seconds 2
    }
    Write-Host "`nSQL Server is ready!" -ForegroundColor Green

    Write-Host "`n2b. Waiting for RabbitMQ to be ready..." -ForegroundColor Blue
    while ($true) {
        $output = docker exec stockmanager-rabbitmq rabbitmq-diagnostics -q ping 2>&1
        if ($LASTEXITCODE -eq 0) { break }
        Write-Host -NoNewline "."
        Start-Sleep -Seconds 2
    }
    Write-Host "`nRabbitMQ is ready!" -ForegroundColor Green

    Write-Host "`n3. Applying Migrations..." -ForegroundColor Blue
    $hasEf = Get-Command dotnet-ef -ErrorAction SilentlyContinue
    if ($hasEf) {
        dotnet ef database update --project StockManager.Infrastructure --startup-project StockManager
    } else {
        Write-Warning "dotnet-ef tool not found. Skipping manual migration."
        Write-Host "The app will still try to apply migrations automatically on startup."
    }

    Write-Host "`n4. Starting Backend..." -ForegroundColor Blue
    # Kill any stale process on port 5000
    $staleProc = Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique
    if ($staleProc) {
        Write-Host "Killing stale process on port 5000 (PID: $staleProc)..." -ForegroundColor Yellow
        Stop-Process -Id $staleProc -Force -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
    }
    
    Set-Location (Join-Path $RootDir "REST API\StockManager")
    dotnet run
}

function Run-Frontend {
    # Check if node_modules exists, if not prompt to install
    $frontendDir = Join-Path $RootDir "Frontend"
    if (-not (Test-Path (Join-Path $frontendDir "node_modules"))) {
        Write-Host "Frontend node_modules not found. Running npm install first..." -ForegroundColor Yellow
        Set-Location $frontendDir
        npm install
    }
    
    Write-Host "`nStarting Frontend..." -ForegroundColor Blue
    Set-Location $frontendDir
    npm run dev
}

function Run-AiInit {
    Check-Docker
    Load-Env
    Write-Host "`nEnsuring Ollama and Vector DB containers are running..." -ForegroundColor Blue
    Set-Location (Join-Path $RootDir "REST API")
    docker compose up -d ollama vector_db

    Write-Host "`nPulling the embedding model (nomic-embed-text)..." -ForegroundColor Blue
    docker exec stockmanager-ollama ollama pull nomic-embed-text

    Write-Host "`nPulling the chat/thinking model (deepseek-r1:1.5b)..." -ForegroundColor Blue
    docker exec stockmanager-ollama ollama pull deepseek-r1:1.5b

    Write-Host "`nInitializing pgvector extension in the vector database..." -ForegroundColor Blue
    $postgresPwd = $env:POSTGRES__PASSWORD
    if (-not $postgresPwd) { $postgresPwd = "YourStrong!Passw0rd" }
    docker exec -e PGPASSWORD=$postgresPwd stockmanager-embeddings psql -U admin -d stockmanager-embeddings -c "CREATE EXTENSION IF NOT EXISTS vector;"
    Write-Host "`nAI Models and Vector DB initialized successfully!" -ForegroundColor Green
}

function Run-SeedDb {
    Check-Docker
    Load-Env
    $saPassword = $env:MSSQL_SA_PASSWORD
    if (-not $saPassword) { $saPassword = "YourStrong!Passw0rd" }

    Write-Host "`nSeeding database..." -ForegroundColor Blue
    docker cp (Join-Path $RootDir "seed_data.sql") stockmanager-sql:/seed_data.sql
    docker exec stockmanager-sql /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P $saPassword -C -i /seed_data.sql
    Write-Host "`nDatabase seeded successfully!" -ForegroundColor Green
}

function Run-All {
    Write-Host "`nStarting everything..." -ForegroundColor Magenta

    # Ensure frontend node_modules are ready so we don't block during launch
    $frontendDir = Join-Path $RootDir "Frontend"
    if (-not (Test-Path (Join-Path $frontendDir "node_modules"))) {
        Write-Host "Frontend node_modules not found. Running npm install first to prepare..." -ForegroundColor Yellow
        Set-Location $frontendDir
        npm install
        Set-Location $RootDir
    }

    Write-Host "Launching Backend in a new window..." -ForegroundColor Blue
    if ($Light) {
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$RootDir'; .\run.ps1 backend -Light"
    } else {
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$RootDir'; .\run.ps1 backend"
    }

    Write-Host "Waiting 5 seconds before launching Frontend..." -ForegroundColor Blue
    Start-Sleep -Seconds 5

    Write-Host "Launching Frontend in a new window..." -ForegroundColor Blue
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$RootDir'; .\run.ps1 frontend"

    Write-Host "`nBoth Backend and Frontend have been launched in separate terminal windows." -ForegroundColor Green
    Write-Host "You can close those windows to stop the services." -ForegroundColor Green
}

# Execute action
try {
    switch ($Action) {
        "help" { Show-Help }
        "backend" { Run-Backend }
        "frontend" { Run-Frontend }
        "ai-init" { Run-AiInit }
        "seed-db" { Run-SeedDb }
        "all" { Run-All }
    }
}
finally {
    Set-Location $RootDir
}
