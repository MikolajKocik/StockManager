.PHONY: help backend frontend ai-init seed-db

help: ## Show this help message
	@echo "StockManager - Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

backend: ## Run the backend API and database infrastructure
	@chmod +x ./backend.sh
	./backend.sh

frontend: ## Run the React frontend development server
	@chmod +x ./frontend.sh
	./frontend.sh

ai-init: ## Initialize Ollama and vector DB (make sure 'backend' containers are running first)
	@chmod +x ./init_ollama.sh
	./init_ollama.sh

seed-db: ## Wipe existing data and seed the WMS database with dummy data
	@echo "Seeding database..."
	docker cp seed_data.sql stockmanager-sql:/seed_data.sql
	docker exec stockmanager-sql /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P 'YourStrong!Passw0rd' -C -i /seed_data.sql
