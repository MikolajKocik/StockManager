# Pobieranie modelu do tworzenia wyszukiwarki (embeddingi)
docker exec -it stockmanager_ollama ollama pull nomic-embed-text

# Pobieranie modelu do rozmowy (thinking model)
docker exec -it stockmanager_ollama ollama pull deepseek-r1:14b

CREATE EXTENSION IF NOT EXISTS vector;