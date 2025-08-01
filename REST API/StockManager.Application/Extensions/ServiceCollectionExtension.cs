using System.Reflection;
using FluentValidation;
using FluentValidation.AspNetCore;
using MediatR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using StockManager.Application.Common.PipelineBehavior;
using StockManager.Application.Configurations;
using StockManager.Application.CQRS.Queries.ProductQueries.GetProductById;
using StockManager.Application.CQRS.Queries.ProductQueries.GetProducts;
using StockManager.Application.CQRS.Queries.SupplierQueries.GetSupplierById;
using StockManager.Application.CQRS.Queries.SupplierQueries.GetSuppliers;
using StockManager.Application.Services;

namespace StockManager.Application.Extensions;

public static class ServiceCollectionExtensions
{
    public static void AddApplication(this IServiceCollection services, IConfiguration config)
    {
        Assembly applicationAssembly = typeof(ServiceCollectionExtensions).Assembly;

        services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(applicationAssembly));

        services.AddAutoMapper(applicationAssembly);

        services.AddValidatorsFromAssembly(applicationAssembly)
            .AddFluentValidationAutoValidation();

        services.Configure<CacheSettings>(
            config.GetSection("CacheSettings"));

        services.AddHttpContextAccessor();

        services.AddTransient(typeof(IPipelineBehavior<,>), typeof(TrackingBehavior<,>));
    }
}
