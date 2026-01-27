using Azure.Monitor.OpenTelemetry.Exporter;
using Microsoft.Extensions.Logging.ApplicationInsights;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using StockManager.Controllers;

namespace StockManager.Extensions.WebAppBuilderExtensions.Azure;

public static class ApplicationInsightConfiguration
{
    public static void ConfigureApplicationInsight(WebApplicationBuilder builder)
    {
        if (builder.Environment.IsProduction())
        {
            string? aiConn = builder.Configuration["applicationinsights-connection-string"]
                         ?? throw new ArgumentException($"Azure key vault variable is missing for {nameof(aiConn)}");

            builder.Logging.AddApplicationInsights(
                configureTelemetryConfiguration: (cfg) =>
                {
                    cfg.ConnectionString = aiConn;
                },
                configureApplicationInsightsLoggerOptions: (opts) => { }
                );

            builder.Services.Configure<AzureMonitorExporterOptions>(a =>
            {
                a.ConnectionString = aiConn;
            });

            builder.Services
             .AddOpenTelemetry()
             .ConfigureResource(resource =>
             {
                 resource.AddService(
                     serviceName: "StockManager",
                     serviceNamespace: "StockManager-group"
                     );
             })
             .WithTracing(t =>
             {
                 t
                 .AddAspNetCoreInstrumentation()
                 .AddHttpClientInstrumentation()
                 .AddEntityFrameworkCoreInstrumentation()
                 .AddConsoleExporter()
                 .AddAzureMonitorTraceExporter();
             })
             .WithMetrics(m =>
             {
                 m.AddAzureMonitorMetricExporter();
             });

            var controllerFilters = new Dictionary<string, LogLevel[]>
            {
                [nameof(ProductController)] = new[] { LogLevel.Trace, LogLevel.Warning, LogLevel.Error, LogLevel.Critical },
                [nameof(PurchaseOrdersController)] = new[] { LogLevel.Trace, LogLevel.Information, LogLevel.Warning },
                [nameof(ShipmentController)] = new[] { LogLevel.Trace, LogLevel.Information, LogLevel.Warning },
                [nameof(StockTransactionController)] = new[] { LogLevel.Trace, LogLevel.Warning, LogLevel.Error, LogLevel.Critical },
                [nameof(AuthController)] = new[] { LogLevel.Information }
            };

            foreach ((string controller, LogLevel[] levels) in controllerFilters)
            {
                foreach (LogLevel level in levels)
                {
                    builder.Logging.AddFilter<ApplicationInsightsLoggerProvider>(controller, level);
                }
            }
        }
    }
}
