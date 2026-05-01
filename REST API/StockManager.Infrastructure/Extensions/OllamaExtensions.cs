using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.AI;
using OllamaSharp;

namespace StockManager.Infrastructure.Extensions;

public static class OllamaExtensions
{
    public static void RegisterOllamaInstance(this IServiceCollection services, IConfiguration cfg)
    {
        IConfigurationSection ollamaConfig = cfg.GetSection("Ollama");
        var ollamaUri = new Uri(ollamaConfig["BaseUrl"]!);
        string chatModel = ollamaConfig["ChatModel"]!;
        string embeddingModel = ollamaConfig["EmbeddingModel"]!;

        services.AddHttpClient("Ollama", client =>
        {
            client.BaseAddress = ollamaUri;
            client.Timeout = TimeSpan.FromMinutes(5);
        });

        services.AddChatClient(sp =>
        {
            HttpClient httpClient = sp.GetRequiredService<IHttpClientFactory>().CreateClient("Ollama");
            return new OllamaApiClient(httpClient, chatModel);
        });

        services.AddEmbeddingGenerator(sp =>
        {
            HttpClient httpClient = sp.GetRequiredService<IHttpClientFactory>().CreateClient("Ollama");
            return new OllamaApiClient(httpClient, embeddingModel);
        });
    }
}
