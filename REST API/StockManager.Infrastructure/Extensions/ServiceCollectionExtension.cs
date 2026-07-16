using System.Reflection;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using StockManager.Core.Domain.Models.UserEntity;
using StockManager.Infrastructure.Persistence.Data;
using StockManager.Core.Domain.Interfaces.Common;
using StockManager.Infrastructure.Common;

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

        // Ollama instance
        services.RegisterOllamaInstance(cfg);

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

        services.AddScoped<IUnitOfWork, UnitOfWork>();
    }
}
