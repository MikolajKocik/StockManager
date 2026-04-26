using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.AI;
using Pgvector;
using StockManager.Infrastructure.Ollama.Interfaces;
using StockManager.Infrastructure.Ollama.Vectors;
using StockManager.Infrastructure.Persistence.Data;

namespace StockManager.Infrastructure.Ollama.Services;

public sealed class DocumentIngestionService : IDocumentIngestionService
{
    private readonly IEmbeddingGenerator<string, Embedding<float>> _embeddingGenerator;
    private readonly VectorDbContext _vectorDb;

    public DocumentIngestionService(
        IEmbeddingGenerator<string, Embedding<float>> embeddingGenerator,
        VectorDbContext vectorDb
    )
    {
        _embeddingGenerator = embeddingGenerator;
        _vectorDb = vectorDb;
    }

    private List<string> SplitTextIntoChunks(string text, int chunkSize)
    {
        string[] words = text.Split(' ', StringSplitOptions.RemoveEmptyEntries);
        var chunks = new List<string>();
        var currentChunk = new List<string>();

        foreach (string word in words)
        {
            currentChunk.Add(word);
            if (string.Join(" ", currentChunk).Length >= chunkSize)
            {
                chunks.Add(string.Join(" ", currentChunk));
                currentChunk.Clear();
            }
        }

        if (currentChunk.Any())
        {
            chunks.Add(string.Join(" ", currentChunk));    
        }

        return chunks;
    }

    public async Task ProcessDocumentAsync(int sourceDocumentId, string rawText, CancellationToken cancellationToken)
    {
        List<string> chunks = SplitTextIntoChunks(rawText, chunkSize: 500);

        GeneratedEmbeddings<Embedding<float>> generatedEmbeddings =
            await _embeddingGenerator.GenerateAsync(chunks, cancellationToken: cancellationToken);
    
        var documentChunks = new List<DocumentChunk>();

        for (int i = 0; i < chunks.Count; i++)
        {
            float[] embedArray = generatedEmbeddings[i].Vector.ToArray();
            var pgVector = new Vector(embedArray);

            documentChunks.Add(new DocumentChunk
            {
               SourceDocumentId = sourceDocumentId,
               Content = chunks[i],
               Embedding = pgVector 
            });
        }

        await _vectorDb.DocumentChunks.AddRangeAsync(documentChunks, cancellationToken);
        await _vectorDb.SaveChangesAsync(cancellationToken);
    }
}
