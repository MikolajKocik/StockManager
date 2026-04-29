using System.Reflection;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebSockets;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using StockManager.Application.Configurations;
using StockManager.Application.Services;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models.UserEntity;
using StockManager.Infrastructure.Persistence.Data;
using StockManager.Infrastructure.Repositories;
using StockManager.Infrastructure.Services.Auth;
using StockManager.Infrastructure.Services;
using StockManager.Infrastructure.Ollama.Services;
using StockManager.Infrastructure.Ollama.Interfaces;
using Microsoft.Extensions.AI;
using OllamaSharp;

namespace StockManager.Infrastructure.Extensions;

public static class ServiceCollectionExtension
{
    public static void AddInfrastructure(this IServiceCollection services, IConfiguration cfg, IHostEnvironment env)
    {
        string? connectionString; 

        services.AddDbContext<VectorDbContext>(options => 
            options.UseNpgsql(cfg.GetConnectionString("VectorDb"),
            o => o.UseVector())); 

        if (env.IsDevelopment())
        {
            connectionString = cfg.GetConnectionString("DockerConnection")
                ?? throw new ArgumentException("Connection string is empty for local database");
            ArgumentException.ThrowIfNullOrEmpty(connectionString);

            services.AddDbContext<StockManagerDbContext>(options =>
                options
                    .UseSqlServer(connectionString, sql =>
                    {
                        sql.EnableRetryOnFailure(
                            maxRetryCount: 5,
                            maxRetryDelay: TimeSpan.FromSeconds(10),
                            errorNumbersToAdd: null);
                    })
                    .EnableSensitiveDataLogging(env.IsDevelopment()));
        }
        else
        {
            connectionString = cfg.GetConnectionString("DefaultConnection")
                ?? throw new ArgumentException("Connection string is empty for azure database");
            ArgumentException.ThrowIfNullOrEmpty(connectionString);

            services.AddDbContext<StockManagerDbContext>(options =>
                options.UseSqlServer(connectionString, sql =>
                {
                    sql.UseAzureSqlDefaults();
                    sql.CommandTimeout(60);
                    sql.EnableRetryOnFailure();
                }));
        }

        services.AddIdentityApiEndpoints<User>()
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<StockManagerDbContext>()
            .AddDefaultTokenProviders();

        // AI Services
        var ollamaConfig = cfg.GetSection("Ollama");
        var ollamaUri = new Uri(ollamaConfig["BaseUrl"]!);
        var chatModel = ollamaConfig["ChatModel"]!;
        var embeddingModel = ollamaConfig["EmbeddingModel"]!;

        services.AddChatClient(new OllamaApiClient(ollamaUri, chatModel));
        services.AddEmbeddingGenerator(new OllamaApiClient(ollamaUri, embeddingModel));

        // configure DI for repositories and services with their interfaces
        var infrastructureAssembly = Assembly.Load("StockManager.Infrastructure");
        services.Scan(s =>
        {
            s.FromAssemblies(infrastructureAssembly)
                .AddClasses(c => c.Where(t => t.Name.EndsWith("Repository", StringComparison.OrdinalIgnoreCase)))
                .AsImplementedInterfaces()
                .WithScopedLifetime();

            s.FromAssemblies(infrastructureAssembly)
                .AddClasses(c => c.Where(t => t.Name.EndsWith("Service", StringComparison.OrdinalIgnoreCase)))
                .AsImplementedInterfaces()
                .WithScopedLifetime();
        });
    }
}
