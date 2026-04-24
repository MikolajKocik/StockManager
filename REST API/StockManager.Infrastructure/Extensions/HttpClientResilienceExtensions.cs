using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Http.Resilience;

namespace StockManager.Infrastructure.Extensions;

public static class HttpClientResilienceExtensions
{
    /// <summary>
    /// Adds a standard resilience handler to the HttpClient builder.
    /// </summary>
    public static IHttpClientBuilder AddStandardHttpClientResilience(this IHttpClientBuilder builder)
    {
        builder.AddStandardResilienceHandler(options =>
        {
            options.Retry.MaxRetryAttempts = 3;
            options.CircuitBreaker.FailureRatio = 0.5;
        });

        return builder;
    }
}
