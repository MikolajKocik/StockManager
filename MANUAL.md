# StockManager - Manual

This guide provides instructions on how to set up and run the StockManager project.

## Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js](https://nodejs.org/) (for Frontend)

## Project Structure

- `REST API/`: ASP.NET Core Backend
- `Frontend/`: React Frontend
- `init_ollama.sh`: Script to initialize Ollama models and vector database.

## Running the Project

### 1. Start Infrastructure

The project uses several infrastructure services (SQL Server, Redis, RabbitMQ, Ollama, PostgreSQL with pgvector).

You can start them using the provided `backend.sh` script (which also starts the backend) or manually via Docker Compose:

```bash
cd "REST API"
docker compose up -d
```

### 2. Initialize AI Models & Vector DB

Once the containers are running, you need to pull the AI models (DeepSeek-R1 and Nomic Embed) and initialize the vector extension:

```bash
./init_ollama.sh
```

> [!NOTE]
> Pulling the models might take some time depending on your internet connection (DeepSeek-R1:14b is ~9GB).

### 3. Run Backend

The backend can be started using the `backend.sh` script:

```bash
./backend.sh
```

This script will:
- Load environment variables from `REST API/.env`
- Start Docker containers
- Wait for SQL Server and RabbitMQ to be ready
- Apply Entity Framework migrations
- Run the ASP.NET Core application on port 5000

### 4. Run Frontend

The frontend can be started using the `frontend.sh` script:

```bash
./frontend.sh
```

This will run the Vite development server, usually on port 3000.

### 5. Seed Initial Data (Optional)

To populate the database with realistic test data (products, suppliers, inventory, operations), run:

```bash
docker cp seed_data.sql stockmanager-sql:/seed_data.sql
docker exec stockmanager-sql /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P 'YourStrong!Passw0rd' -C -i /seed_data.sql
```

## Environment Variables

Ensure you have a `.env` file in `REST API/` with the following variables:

```env
MSSQL_SA_PASSWORD=YourStrong!Passw0rd
JWT__KEY=YourSuperSecretKeyHere...
JWT__ISSUER=StockManager
JWT__AUDIENCE=StockManager
REDIS__HOST=localhost
RABBITMQ__HOST=localhost
RABBITMQ__USERNAME=guest
RABBITMQ__PASSWORD=guest
POSTGRES__PASSWORD=YourPostgresPassword
```

## AI Features

The project uses Ollama for:
- **Chat/Reasoning**: `deepseek-r1:14b`
- **Embeddings**: `nomic-embed-text`

These are used for document retrieval and AI-powered search in the inventory.
