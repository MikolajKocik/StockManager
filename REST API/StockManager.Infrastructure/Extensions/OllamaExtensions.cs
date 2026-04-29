using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.AI;
using OllamaSharp;

namespace StockManager.Infrastructure.Extensions;

public static class OllamaExtensions
{
    public static void RegisterOllamaInstance(this IServiceCollection services, IConfiguration cfg)
    {
        var ollamaConfig = cfg.GetSection("Ollama");
        var ollamaUri = new Uri(ollamaConfig["BaseUrl"]!);
        var chatModel = ollamaConfig["ChatModel"]!;
        var embeddingModel = ollamaConfig["EmbeddingModel"]!;

        services.AddHttpClient("Ollama", client =>
        {
            client.BaseAddress = ollamaUri;
            client.Timeout = TimeSpan.FromMinutes(5);
        });

        services.AddChatClient(sp =>
        {
            var httpClient = sp.GetRequiredService<IHttpClientFactory>().CreateClient("Ollama");
            return new OllamaApiClient(httpClient, chatModel);
        });

        services.AddEmbeddingGenerator(sp =>
        {
            var httpClient = sp.GetRequiredService<IHttpClientFactory>().CreateClient("Ollama");
            return new OllamaApiClient(httpClient, embeddingModel);
        });
    }
}