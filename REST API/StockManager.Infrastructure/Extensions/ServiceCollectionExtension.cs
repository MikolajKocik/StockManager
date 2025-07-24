using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using StockManager.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using StockManager.Infrastructure.Repositories;
using StockManager.Core.Domain.Interfaces.Repositories;
using Microsoft.AspNetCore.Http.HttpResults;
using StockManager.Infrastructure.Settings;
using StockManager.Application.Services;
using StockManager.Infrastructure.Services.Auth;
using StockManager.Core.Domain.Models.UserEntity;
using System.Reflection;


namespace StockManager.Infrastructure.Extensions;

public static class ServiceCollectionExtension
{
    public static void AddInfrastructure(this IServiceCollection services)
    {
        string? connectionString =
        Environment.GetEnvironmentVariable("ConnectionStrings__DockerConnection") ??
            Environment.GetEnvironmentVariable("VS__Connection");
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

        services.AddScoped<IProductRepository, ProductRepository>();
        services.AddScoped<ISupplierRepository, SupplierRepository>();
    }
}
