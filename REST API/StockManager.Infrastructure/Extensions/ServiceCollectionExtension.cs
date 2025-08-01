using System.Reflection;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebSockets;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using StockManager.Application.Configurations;
using StockManager.Application.Services;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.UserEntity;
using StockManager.Infrastructure.Persistence.Data;
using StockManager.Infrastructure.Repositories;
using StockManager.Infrastructure.Services.Auth;
using StockManager.Infrastructure.Settings;


namespace StockManager.Infrastructure.Extensions;

public static class ServiceCollectionExtension
{
    public static void AddInfrastructure(this IServiceCollection services, IConfiguration config)
    {
        string? connectionString = config.GetConnectionString("DockerConnection")
            ?? throw new ArgumentException("Connection string is empty for local database");
        ArgumentException.ThrowIfNullOrEmpty(connectionString);

        services.AddDbContext<StockManagerDbContext>(options =>
            options
                .UseSqlServer(connectionString)
                .EnableSensitiveDataLogging());

        services.AddIdentityApiEndpoints<User>()
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<StockManagerDbContext>()
            .AddDefaultTokenProviders();

        services.AddScoped<IAuthService, AuthService>();

        // repositories with interfaces
        var infrastructureAssembly = Assembly.Load("StockManager.Infrastructure");
        services.Scan(s =>
        {
            s.FromAssemblies(infrastructureAssembly)
                .AddClasses(c => c.Where(t => t.Name.EndsWith("Repository", StringComparison.OrdinalIgnoreCase))) 
                .AsImplementedInterfaces()
                .WithScopedLifetime();
        });
    }
}
