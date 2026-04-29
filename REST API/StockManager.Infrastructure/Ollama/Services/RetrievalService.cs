using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.AI;
using Pgvector;
using Pgvector.EntityFrameworkCore;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Infrastructure.Ollama.Interfaces;
using StockManager.Infrastructure.Persistence.Data;

namespace StockManager.Infrastructure.Ollama.Services;

public sealed class RetrievalService : IRetrievalService
{
    private readonly IEmbeddingGenerator<string, Embedding<float>> _embeddingGenerator;
    private readonly IChatClient _chatClient;
    private readonly VectorDbContext _vectorDb;

    public RetrievalService(
        IEmbeddingGenerator<string, Embedding<float>> embeddingGenerator,
        IChatClient chatClient,
        VectorDbContext vectorDb)
    {
        _embeddingGenerator = embeddingGenerator;
        _chatClient = chatClient;
        _vectorDb = vectorDb;
    }

    public async Task<string> AnswerQuestionAsync(string question, CancellationToken cancellationToken = default)
    {
        Embedding<float> queryEmbedding = 
            await _embeddingGenerator.GenerateAsync(question, cancellationToken: cancellationToken);
            
        var queryVector = new Vector(queryEmbedding.Vector.ToArray());

        // Cosinus vector searching 
        List<string> topMatchingChunks = await _vectorDb.DocumentChunks
            .OrderBy(c => c.Embedding.CosineDistance(queryVector))
            .Take(3) 
            .Select(c => c.Content)
            .ToListAsync(cancellationToken);

        if (!topMatchingChunks.Any())
        {
            return "I couldn't find any information about this in the WMS document database.";
        }

        string contextText = string.Join("\n\n---\n\n", topMatchingChunks);

        string prompt = $"""
        You are a helpful assistant in WMS. 
        Answer the employee's question using ONLY the context provided below (document excerpts). 
        If the context doesn't provide an answer, say directly, "I don't know.".

        CONTEXT:
        {contextText}

        QUESTION:
        {question}
        """;

        ChatResponse response = await _chatClient.GetResponseAsync(prompt, cancellationToken: cancellationToken);
        return response.Text;
    }

    public async Task<string> ExtractDataToJsonAsync(string question, CancellationToken cancellationToken = default)
    {
        string prompt = $$"""
            You are a strict data extraction tool for a Warehouse Management System.
            Extract search parameters from the user's prompt and return ONLY a valid JSON object.
            
            The JSON MUST match this structure:
            {
              "productName": "extracted name or null",
              "warehouse": "one of: RegularStorage, RefrigeratedSection, FreezerSection, OutdoorStorage or null",
              "binLocationCode": "extracted code or null",
              "genre": "one of: Vegetables, Fruits, Dairy, Meat, Fish, DryProducts, FrozenProducts or null"
            }

            RULES:
            - If you see "Regular", use "RegularStorage".
            - If you see "Refrigerated", use "RefrigeratedSection".
            - If you see "Freezer", use "FreezerSection".
            - Output ONLY JSON. No markdown tags.

            USER PROMPT:
            {{question}}
            """;

        ChatResponse aiResponse = await _chatClient.GetResponseAsync(prompt, cancellationToken: cancellationToken);
        
        string json = aiResponse.Text.Replace("```json", "").Replace("```", "").Trim();
        return json;
    }
}
