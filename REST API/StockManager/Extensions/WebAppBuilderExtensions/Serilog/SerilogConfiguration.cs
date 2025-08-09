using Serilog;
using Serilog.Sinks.OpenTelemetry;

namespace StockManager.Extensions.WebAppBuilderExtensions.Serilog;

internal static class SerilogConfiguration
{
    public static void AddSerilogConfiguration(WebApplicationBuilder builder)
    {
        builder.Host.UseSerilog((context, configuration) =>
        {
            configuration
                .ReadFrom.Configuration(context.Configuration)
                .WriteTo.OpenTelemetry(options =>
                {
                    options.Endpoint = Environment.GetEnvironmentVariable("otel-exporter-otlp-endpoint");
                    options.Protocol = OtlpProtocol.Grpc;
                    options.ResourceAttributes = new Dictionary<string, object>
                    {
                        ["service.name"] = "StockManager",
                        ["deployment.environment"] = "production"
                    };
                });
        });   
    }
}
