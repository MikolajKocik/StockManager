# StockManager - Manual

This guide provides instructions on how to set up and run the StockManager project.

## Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js](https://nodejs.org/) (for Frontend)

## Project Structure

- `REST API/`: ASP.NET Core Backend
- `Frontend/`: React Frontend

## Running the Project

### 1. Start Infrastructure

The project uses several infrastructure services (SQL Server, Redis, RabbitMQ). You can start them using the provided Makefile command or via Docker Compose:
```bash
make backend
```


### 3. Run Backend

The backend can be started using the Makefile:

```bash
make backend
```

This script will:
- Load environment variables from `REST API/.env`
- Start Docker containers
- Wait for SQL Server and RabbitMQ to be ready
- Apply Entity Framework migrations
- Run the ASP.NET Core application on port 5000

### 4. Run Frontend

The frontend can be started using the Makefile command:

```bash
make frontend
```

This will run the Vite development server, usually on port 3000.

### 5. Seed Initial Data (Optional)

To populate the database with realistic test data (products, suppliers, inventory, operations), simply run:

```bash
make seed-db
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
