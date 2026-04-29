#!/bin/bash

# Ensure containers are running
cd "REST API"
docker compose up -d ollama vector_db
cd ..

# Pull the embedding model
docker exec stockmanager-ollama ollama pull nomic-embed-text

# Pull the chat/thinking model
docker exec stockmanager-ollama ollama pull deepseek-r1:14b

# Initialize pgvector extension in the vector database
# Note: POSTGRES__PASSWORD should be available in the environment
docker exec -e PGPASSWORD=$POSTGRES__PASSWORD stockmanager-embeddings psql -U admin -d stockmanager-embeddings -c "CREATE EXTENSION IF NOT EXISTS vector;"