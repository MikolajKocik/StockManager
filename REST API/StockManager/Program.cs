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
builder.Services.AddInfrastructure(builder.Configuration, builder.Environment);
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

if (app.Environment.IsDevelopment())
{
    // health check endpoint
    app.MapHealthChecks("/health", new HealthCheckOptions
    {
        ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
    });
}
else
{
    app.MapHealthChecks("/health");
}

await app.RunAsync();
