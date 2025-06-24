using MediatR;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Npgsql;
using OpenTelemetry.Logs;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using Serilog;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.CQRS.Commands.ProductCommands.AddProduct;
using StockManager.Application.CQRS.Commands.ProductCommands.DeleteProduct;
using StockManager.Application.CQRS.Commands.ProductCommands.EditProduct;
using StockManager.Application.CQRS.Queries.ProductQueries.GetProductById;
using StockManager.Application.CQRS.Queries.ProductQueries.GetProducts;
using StockManager.Application.Extensions;
using StockManager.Core.Domain.Models;
using StockManager.Extensions;
using StockManager.Infrastructure.Data;
using StockManager.Infrastructure.Extensions;
using StockManager.Middlewares;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.AddPresentation();
builder.Services.AddInfrastructure();
builder.Services.AddApplication();

// scrutor package
builder.Services.Scan(scan => scan
    .FromAssemblies(
         typeof(AddProductCommand).Assembly,
         typeof(DeleteProductCommand).Assembly,
         typeof(EditProductCommand).Assembly,
         typeof(GetProductByIdQuery).Assembly,
         typeof(GetProductsQuery).Assembly
    )
    .AddClasses(c => c.AssignableTo(typeof(ICommandHandler<>)))
        .AsImplementedInterfaces()
        .WithScopedLifetime()
    .AddClasses(c => c.AssignableTo(typeof(ICommandHandler<,>)))
        .AsImplementedInterfaces()
        .WithScopedLifetime()
    .AddClasses(c => c.AssignableTo(typeof(IQueryHandler<,>)))
        .AsImplementedInterfaces()
        .WithScopedLifetime()
    .AddClasses(c => c.AssignableTo(typeof(IRequestHandler<,>))) // adapters
        .AsImplementedInterfaces()
        .WithScopedLifetime()
);

builder.Services
    .AddOpenTelemetry()
    .ConfigureResource(resource =>
    {
        resource.AddService(
            serviceName: "my-app",
            serviceNamespace: "my-application-group",
            serviceVersion: "1.0.0");
    })
    .WithTracing(tracing =>
    {
        tracing
            .AddAspNetCoreInstrumentation()
            .AddHttpClientInstrumentation()
            .AddConsoleExporter()
            .AddOtlpExporter(opt =>
            {
                opt.Endpoint = new Uri(builder.Configuration["OTEL_EXPORTER_OTLP_ENDPOINT"] 
                    ?? throw new ArgumentException("configuration endpoint is empty"));
                opt.Headers = builder.Configuration["OTEL_EXPORTER_OTLP_HEADERS"];
                opt.Protocol = OpenTelemetry.Exporter.OtlpExportProtocol.HttpProtobuf;
            });
    });


builder.Logging.AddOpenTelemetry(logging =>
{
    logging.IncludeScopes = true;
    logging.IncludeFormattedMessage = true;

    logging.AddOtlpExporter();
});

WebApplication app = builder.Build();

// Configure the HTTP command pipeline.
app.UseMiddleware<ErrorHandlingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//serilog commands
app.UseSerilogRequestLogging();

// Automatically checks pending migrations and update database
using (IServiceScope scope = app.Services.CreateScope())
{
    StockManagerDbContext dbContext = scope.ServiceProvider
        .GetRequiredService<StockManagerDbContext>();

    int retryCount = 0;
    int maxRetries = 10;
    var delay = TimeSpan.FromSeconds(3);

    while(retryCount < maxRetries)
    {
        try
        {

            IEnumerable<string> pendingMigrations = await dbContext.Database.GetPendingMigrationsAsync();

            if (pendingMigrations.Any())
            {
                await dbContext.Database.MigrateAsync();
            }

            break;
        }
        catch (SqlException ex)
        {
            if (ex.Number == 1801)
            { 
                break; 
            }

            retryCount++;
            Console.WriteLine($"SQL Server not ready (attempt {retryCount}: {ex.Message}");
        }
    }
}

app.UseHttpsRedirection();

app.MapGroup("api/identity")
    .WithTags("Identity")
    .MapIdentityApi<User>();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

await app.RunAsync();
