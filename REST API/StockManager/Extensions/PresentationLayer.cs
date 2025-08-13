using System.Reflection;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.RateLimiting;
using StockManager.Application.Helpers.NullConfiguration;
using StockManager.Extensions.WebAppBuilderExtensions.Azure;
using StockManager.Extensions.WebAppBuilderExtensions.Cors;
using StockManager.Extensions.WebAppBuilderExtensions.JWT;
using StockManager.Extensions.WebAppBuilderExtensions.OpenTelemetry;
using StockManager.Extensions.WebAppBuilderExtensions.RedisAndHealthChecks;
using StockManager.Extensions.WebAppBuilderExtensions.Serilog;
using StockManager.Extensions.WebAppBuilderExtensions.Services;
using StockManager.Extensions.WebAppBuilderExtensions.Swagger;
using StockManager.Middlewares;

namespace StockManager.Extensions;

public static class PresentationLayer
{
    public static void AddPresentation(this WebApplicationBuilder builder)
    {
        // Azure key-vault
        AzureKeyVault.AzureConfigure(builder);

        // Rate limitting
        builder.Services.AddRateLimiter(opts =>
        {
            opts.AddFixedWindowLimiter("fixed", opt =>
            {
                opt.PermitLimit = 5;
                opt.Window = TimeSpan.FromSeconds(5);
                opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
                opt.QueueLimit = 0;
            });

            opts.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
        });

        builder.Services.AddScoped<ErrorHandlingMiddleware>();

        // Swagger
        SwaggerConfiguration.AddSwagger(builder);

        // Cors
        CorsConfiguration.AddCorsCredentials(builder);

        // hsts
        builder.Services.AddHsts(opts =>
        {
            opts.Preload = false;    
            opts.IncludeSubDomains = false;
            opts.MaxAge = TimeSpan.FromDays(365);
        });

        // JWT
        JsonWebTokenConfig.AddJWT(builder);

        // Services - cqrs, domain
        ServiceRegistration.AddServices(builder.Services);

        builder.Services
            .AddControllers()
            .AddJsonOptions(opts =>
                opts.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

        // Serilog
        SerilogConfiguration.AddSerilogConfiguration(builder);

        // Azure application-insights
        ApplicationInsightConfiguration.ConfigureApplicationInsight(builder);

        // OpenTelemetry
        OpenTelemetryConfiguration.AddOpenTelemetryConfiguration(builder);

        // Redis & health checks
        RedisAndHealthChecksConfiguration.AddConfigurations(builder);
    }
}
