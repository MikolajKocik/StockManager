using System;

namespace StockManager.Infrastructure.Ollama.Interfaces;

public interface IDocumentIngestionService
{
    Task ProcessDocumentAsync(int sourceDocumentId, string rawText, CancellationToken cancellationToken);
}
