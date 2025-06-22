using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using StockManager.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using StockManager.Infrastructure.Repositories;
using StockManager.Core.Domain.Models;
using StockManager.Core.Domain.Interfaces.Repositories;


namespace StockManager.Infrastructure.Extensions;

public static class ServiceCollectionExtension
{
    public static void AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<StockManagerDbContext>(options => 
            options
                .UseSqlServer(configuration.GetConnectionString("DefaultConnection"))
                .EnableSensitiveDataLogging());

        services.AddIdentityApiEndpoints<User>()
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<StockManagerDbContext>()
            .AddDefaultTokenProviders();
          
        services.AddScoped<IProductRepository, ProductRepository>();
        services.AddScoped<ISupplierRepository, SupplierRepository>();
    }
}
