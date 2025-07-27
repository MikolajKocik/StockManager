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
        string otlLogLevel = Environment.GetEnvironmentVariable("OTEL_LOG_LEVEL")
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
            a.ConnectionString = Environment.GetEnvironmentVariable("APPLICATIONINSIGHTS_CONNECTION_STRING");
        });

        builder.Logging.ClearProviders();

        builder.Logging.AddOpenTelemetry(logging =>
        {
            logging.AddConsoleExporter();

            logging.IncludeScopes = true;
            logging.IncludeFormattedMessage = true;
            logging.ParseStateValues = true;

            string baseUrl = Environment.GetEnvironmentVariable("OTEL_EXPORTER_OTLP_ENDPOINT")!;
            string headers = Environment.GetEnvironmentVariable("OTEL_EXPORTER_OTLP_HEADERS")!;

            logging.AddOtlpExporter(opt =>
            {
                opt.Endpoint = new Uri(baseUrl);
                opt.Protocol = OtlpExportProtocol.HttpProtobuf;
                opt.Headers = headers;
            });
        });

    }
}
