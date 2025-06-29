using System.Globalization;
using System.Reflection;
using HealthChecks.UI.Client;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using OpenTelemetry.Logs;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using RabbitMQ.Client;
using Serilog;
using StackExchange.Redis;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Abstractions.CQRS.MediatorAdapter;
using StockManager.Application.Abstractions.CQRS.MediatorAdapter.Command;
using StockManager.Application.Abstractions.CQRS.MediatorAdapter.Query;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Common.Events;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Configuration;
using StockManager.Application.CQRS.Commands.ProductCommands.AddProduct;
using StockManager.Application.CQRS.Commands.ProductCommands.DeleteProduct;
using StockManager.Application.CQRS.Commands.ProductCommands.EditProduct;
using StockManager.Application.CQRS.Queries.ProductQueries.GetProductById;
using StockManager.Application.CQRS.Queries.ProductQueries.GetProducts;
using StockManager.Application.Extensions;
using StockManager.Core.Domain.Models;
using StockManager.Extensions;
using StockManager.Infrastructure.Data;
using StockManager.Infrastructure.EventBus;
using StockManager.Infrastructure.Extensions;
using StockManager.Infrastructure.Settings;
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
    // handlers
    .AddClasses(c => c.AssignableTo(typeof(ICommandHandler<>)))
        .AsImplementedInterfaces()
        .WithScopedLifetime()
    .AddClasses(c => c.AssignableTo(typeof(ICommandHandler<,>)))
        .AsImplementedInterfaces()
        .WithScopedLifetime()
    .AddClasses(c => c.AssignableTo(typeof(IQueryHandler<,>)))
        .AsImplementedInterfaces()
        .WithScopedLifetime()
);

Assembly appAsm = typeof(StockManager.Application.Extensions.ServiceCollectionExtensions).Assembly;
foreach (Type type in appAsm.GetTypes())
{
    if (type.IsAbstract || !type.IsClass)
    {
        continue;
    }

    foreach (Type iface in type.GetInterfaces())
    {
        if (!iface.IsGenericType)
        {
            continue;
        }

        Type def = iface.GetGenericTypeDefinition();

        // QueryHandler<TQ,TR>
        if (def == typeof(IQueryHandler<,>))
        {
            (Type TQ, Type TR) = (iface.GetGenericArguments()[0], iface.GetGenericArguments()[1]);
            builder.Services.AddTransient(
                typeof(IRequestHandler<,>).MakeGenericType(TQ, typeof(Result<>).MakeGenericType(TR)),
                typeof(MediatorQueryAdapter<,>).MakeGenericType(TQ, TR)
            );
        }
        // CommandHandler<TC,TR>
        else if (def == typeof(ICommandHandler<,>))
        {
            (Type TC, Type TR) = (iface.GetGenericArguments()[0], iface.GetGenericArguments()[1]);
            builder.Services.AddTransient(
                typeof(IRequestHandler<,>).MakeGenericType(TC, typeof(Result<>).MakeGenericType(TR)),
                typeof(MediatorCommandAdapterValue<,>).MakeGenericType(TC, TR)
            );
        }
        // CommandHandler<TC> (void)
        else if (def == typeof(ICommandHandler<>))
        {
            Type TC = iface.GetGenericArguments()[0];
            builder.Services.AddTransient(
                typeof(IRequestHandler<,>).MakeGenericType(TC, typeof(Result<Unit>)),
                typeof(MediatorCommandAdapter<>).MakeGenericType(TC)
            );
        }
    }
}

// opentelemetry tracing

string otlpEndpoint = Environment.GetEnvironmentVariable("OTEL_EXPORTER_OTLP_ENDPOINT")
    ?? throw new ArgumentException("OTLP endpoint is not configured");
string? otlpHeaders = Environment.GetEnvironmentVariable("OTEL_EXPORTER_OTLP_HEADERS");

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
                opt.Endpoint = new Uri(otlpEndpoint);
                opt.Protocol = OpenTelemetry.Exporter.OtlpExportProtocol.HttpProtobuf;
                if (!string.IsNullOrWhiteSpace(otlpHeaders))
                {
                    opt.Headers = otlpHeaders;
                }
            });
    });


builder.Logging.AddOpenTelemetry(logging =>
{
    logging.IncludeScopes = true;
    logging.IncludeFormattedMessage = true;

    logging.AddOtlpExporter(opt =>
    {
        opt.Endpoint = new Uri(otlpEndpoint);
        opt.Protocol = OpenTelemetry.Exporter.OtlpExportProtocol.HttpProtobuf;
        if(!string.IsNullOrWhiteSpace(otlpHeaders))
        {
            opt.Headers = otlpHeaders;
        }
    });
});

// Rabbitmq
CultureInfo format = CultureInfo.InvariantCulture;
builder.Services.Configure<RabbitMqSettings>(opts =>
{
    opts.HostName = Environment.GetEnvironmentVariable("RABBITMQ_HOST")!;
    opts.Port = Convert.ToInt32(Environment.GetEnvironmentVariable("RABBITMQ_PORT")!, format);
    opts.UserName = Environment.GetEnvironmentVariable("RABBITMQ_USER")!;
    opts.Password = Environment.GetEnvironmentVariable("RABBITMQ_PASS")!;
    opts.Exchange = Environment.GetEnvironmentVariable("RABBITMQ_EXCHANGE") ?? "stock-exchange";
});

builder.Services.AddSingleton(sp =>
{
    RabbitMqSettings settings = sp.GetRequiredService<IOptions<RabbitMqSettings>>().Value;
    var factory = new ConnectionFactory
    {
        HostName = settings.HostName,
        Port = settings.Port,
        UserName = settings.UserName,
        Password = settings.Password
    };

    return factory
        .CreateConnectionAsync()
        .GetAwaiter()
        .GetResult();
});

builder.Services.AddSingleton<IEventBus, RabbitMqEventBus>();

// Redis
string redisHost = Environment.GetEnvironmentVariable("REDIS_HOST")!;
string redisPort = Environment.GetEnvironmentVariable("REDIS_PORT")!;

builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = $"{redisHost}:{redisPort}";
    options.InstanceName = "MyAppCache:";
});

builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
    ConnectionMultiplexer.Connect($"{redisHost}:{redisPort}")
);

// health checks
string sqlConn = Environment.GetEnvironmentVariable("ConnectionStrings__DockerConnection")
              ?? throw new ArgumentException("Empty variable ConnectionStrings__DockerConnection");

builder.Services.AddHealthChecks()
    .AddRedis($"{redisHost}:{redisPort}", name: "redis")
    .AddSqlServer(sqlConn, name: "sqlserver")
    // for RabbitMQ is used IConnection from DI
    .AddRabbitMQ(name: "rabbitmq");

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
    var delay = TimeSpan.FromSeconds(5);

    while (retryCount < maxRetries)
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

            await Task.Delay(delay);
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

// health check endpoint
app.MapHealthChecks("/health", new HealthCheckOptions
{
    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
});

await app.RunAsync();
