using Azure.Monitor.OpenTelemetry.Exporter;
using Grafana.OpenTelemetry;
using OpenTelemetry.Exporter;
using OpenTelemetry.Logs;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;

namespace StockManager.Extensions.WebAppBuilderExtensions.OpenTelemetry;

internal static class OpenTelemetryConfiguration
{
    public static void AddOpenTelemetryConfiguration(WebApplicationBuilder builder)
    {
        // otlp debug
        string otlLogLevel = builder.Configuration["otel-log-level"]
            ?? "Information";

        builder.Logging.SetMinimumLevel(otlLogLevel.ToLower() switch
        {
            "debug" => LogLevel.Debug,
            "information" => LogLevel.Information,
            "warning" => LogLevel.Warning,
            "error" => LogLevel.Error,
            "critical" => LogLevel.Critical,
            _ => LogLevel.Information
        });

        // otlp config
        builder.Services
            .AddOpenTelemetry()
            .ConfigureResource(resource =>
            {
                resource.AddService(
                    serviceName: "StockManager",
                    serviceNamespace: "StockManager-group"
                    );
            })
            // grafana
            .WithTracing(t =>
            {
                t.UseGrafana()
                .AddConsoleExporter()
                .AddAzureMonitorTraceExporter();
            })
            .WithMetrics(m =>
            {
                m.UseGrafana()
                .AddConsoleExporter()
                .AddAzureMonitorMetricExporter();
            });

        // azure config
        builder.Services.Configure<AzureMonitorExporterOptions>(a =>
        {
            a.ConnectionString = builder.Configuration["applicationinsights-connection-string"]
                ?? throw new ArgumentException(nameof(a.ConnectionString));
        });

        builder.Logging.ClearProviders();
        builder.Logging.AddConsole();

        builder.Logging.AddOpenTelemetry(logging =>
        {
            logging.AddConsoleExporter();

            logging.IncludeScopes = true;
            logging.IncludeFormattedMessage = true;
            logging.ParseStateValues = true;

            string baseUrl = builder.Configuration["otel-exporter-otlp-endpoint"]
                ?? throw new ArgumentException(nameof(baseUrl));

            string headers = builder.Configuration["otel-exporter-otlp-headers"]
                ?? throw new ArgumentException(nameof(headers));

            logging.AddOtlpExporter(opt =>
            {
                opt.Endpoint = new Uri(baseUrl);
                opt.Protocol = OtlpExportProtocol.HttpProtobuf;
                opt.Headers = headers;
            });
        });
    }
}
