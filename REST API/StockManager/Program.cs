using System.Globalization;
using HealthChecks.UI.Client;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Serilog;
using StockManager.Application.Extensions;
using StockManager.Core.Domain.Models.UserEntity;
using StockManager.Extensions;
using StockManager.Extensions.WebAppBuilderExtensions.Cors;
using StockManager.Helpers;
using StockManager.Infrastructure.Extensions;
using StockManager.Middlewares;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.AddPresentation(builder.Services);
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddApplication(builder.Configuration);

WebApplication app = builder.Build();

// rate limit middleware
app.UseRateLimiter();

// Configure the HTTP command pipeline.
app.UseMiddleware<ErrorHandlingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//serilog commands
app.UseSerilogRequestLogging();

await app.AddAutomateMigrations();

app.UseHttpsRedirection();

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

await app.RunAsync();
