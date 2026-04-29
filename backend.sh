#!/bin/bash

# backend.sh - Infrastructure + Backend Run Script

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Load variables from .env file if it exists
if [ -f "REST API/.env" ]; then
    export $(grep -v '^#' "REST API/.env" | xargs)
fi

# Override specific variables for local development (pointing to Docker containers via localhost)
export ConnectionStrings__DockerConnection="Server=localhost,1433;Database=StockManagerDb;User Id=sa;Password=$MSSQL_SA_PASSWORD;TrustServerCertificate=True;Encrypt=False;"
export RABBITMQ__HOST="127.0.0.1"
export RABBITMQ__PORT="5672"
export RABBITMQ__USERNAME="guest"
export RABBITMQ__PASSWORD="guest"
export REDIS__HOST="127.0.0.1"
# Ensure JWT variables are taken from .env or have defaults
export JWT__Key=${JWT__KEY:-"SuperSecretKey123!_SuperSecretKey123!"}

echo -e "${BLUE}1. Starting Infrastructure (Docker)...${NC}"
cd "REST API"
docker compose up -d sqlserver rabbitmq redis ollama vector_db

echo -e "${BLUE}2. Waiting for SQL Server to be ready...${NC}"
# wait for the port to be open
until docker exec stockmanager-sql /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P 'YourStrong!Passw0rd' -Q "SELECT 1" -C &> /dev/null; do
  echo -n "."
  sleep 2
done
echo -e "\n${GREEN}SQL Server is ready!${NC}"

echo -e "${BLUE}2b. Waiting for RabbitMQ to be ready...${NC}"
until docker exec stockmanager-rabbitmq rabbitmq-diagnostics -q ping &> /dev/null; do
  echo -n "."
  sleep 2
done
echo -e "\n${GREEN}RabbitMQ is ready!${NC}"

echo -e "${BLUE}3. Applying Migrations...${NC}"
if command -v dotnet-ef &> /dev/null; then
    dotnet ef database update --project StockManager.Infrastructure --startup-project StockManager
else
    echo -e "${RED}Warning: dotnet-ef tool not found. Skipping manual migration.${NC}"
    echo -e "The app will still try to apply migrations automatically on startup."
fi

echo -e "${BLUE}4. Starting Backend in Watch Mode...${NC}"
# Kill any stale process on port 5000 from a previous run
STALE_PID=$(lsof -ti :5000 2>/dev/null)
if [ -n "$STALE_PID" ]; then
    echo -e "${RED}Killing stale process on port 5000 (PID: $STALE_PID)...${NC}"
    kill -9 $STALE_PID 2>/dev/null
    sleep 2
fi
cd StockManager
echo "RabbitMQ Host: $RABBITMQ__HOST"
dotnet run
