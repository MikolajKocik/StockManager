using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using StockManager.Infrastructure.Data;
using Microsoft.AspNetCore.Identity;
using StockManager.Core.Domain.Interfaces;
using StockManager.Infrastructure.Repositories;


namespace StockManager.Infrastructure.Extensions
{
    public static class ServiceCollectionExtension
    {
        public static void AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<StockManagerDbContext>(options => 
                options
                    .UseSqlServer(configuration.GetConnectionString("DefaultConnection"))
                    .EnableSensitiveDataLogging());

            services.AddDefaultIdentity<IdentityUser>()
                .AddRoles<IdentityRole>() // Employee + Manager
                .AddEntityFrameworkStores<StockManagerDbContext>()
                .AddDefaultTokenProviders();

            services.AddScoped<IProductRepository, ProductRepository>();
        }
    }
}
