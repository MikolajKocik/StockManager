using System.Globalization;
using Serilog;
using Serilog.Sinks.OpenTelemetry;

namespace StockManager.Extensions.WebAppBuilderExtensions.Serilog;

internal static class SerilogConfiguration
{
    public static void AddSerilogConfiguration(WebApplicationBuilder builder)
    {
        builder.Host.UseSerilog((context, configuration) =>
        {
            if (builder.Environment.IsDevelopment())
            {
                configuration
                    .ReadFrom.Configuration(context.Configuration)
                    .WriteTo.Console(formatProvider: CultureInfo.InvariantCulture);

            }
            else
            {
                configuration
                    .ReadFrom.Configuration(context.Configuration)
                    .WriteTo.OpenTelemetry(options =>
                    {
                        options.Endpoint = builder.Configuration["otel-exporter-otlp-endpoint"];
                        options.Protocol = OtlpProtocol.Grpc;
                        options.ResourceAttributes = new Dictionary<string, object>
                        {
                            ["service.name"] = "StockManager",
                            ["deployment.environment"] = "production"
                        };
                    });
            }
        });
    }
}
