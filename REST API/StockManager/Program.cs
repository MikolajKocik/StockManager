using System.Globalization;
using HealthChecks.UI.Client;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.HttpOverrides;
using Serilog;
using StockManager.Application.Extensions;
using StockManager.Core.Domain.Models.UserEntity;
using StockManager.Extensions;
using StockManager.Extensions.WebAppBuilderExtensions.Cors;
using StockManager.Helpers;
using StockManager.Infrastructure.Extensions;
using StockManager.Middlewares;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.AddPresentation();
bool runMigrations = builder.Configuration.GetValue("RUN_MIGRATIONS", true);

builder.Services.AddInfrastructure(builder.Configuration, builder.Environment);
builder.Services.AddApplication(builder.Configuration);

WebApplication app = builder.Build();

if (runMigrations)
{
    try
    {
        await app.AddAutomateMigrations();
    }
    catch (Exception ex)
    {
        Log.Error(ex, "Migrations failed on startup – skipping in Production");
    }
}

// rate limit middleware
app.UseRateLimiter();

// Configure the HTTP command pipeline.
app.UseMiddleware<ErrorHandlingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseForwardedHeaders(new ForwardedHeadersOptions
    {
        ForwardedHeaders = ForwardedHeaders.XForwardedProto | ForwardedHeaders.XForwardedFor
    });

    app.UseHsts();
    app.UseHttpsRedirection();
}
//serilog commands
app.UseSerilogRequestLogging();

await app.AddAutomateMigrations();

app.MapGroup("api/identity")
    .WithTags("Identity")
    .MapIdentityApi<User>();

app.UseCors(Policy.SpecificOrigins);

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// health check endpoint
app.MapHealthChecks("/health", new HealthCheckOptions
{
    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
});

// check secret from azure key vault
app.MapGet("/dbdev-check", (IConfiguration cfg) =>
{
    string conn = cfg.GetConnectionString("DefaultConnection");
    return string.IsNullOrEmpty(conn)
        ? Results.NotFound($"Empty secret {nameof(conn)}")
        : Results.Ok($"Conn length: {conn.Length}");
});

await app.RunAsync();
