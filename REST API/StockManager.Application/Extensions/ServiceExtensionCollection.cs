using AutoMapper;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using StockManager.Application.CQRS.Queries.ProductQueries.GetProducts;
using StockManager.Application.Mappings;
using StockManager.Application.Validations;

namespace StockManager.Application.Extensions
{
    public static class ServiceExtensionsCollection
    {
        public static void AddApplication(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddAutoMapper(typeof(MappingProfile)); // automapper

            services.AddMediatR(cfg =>
            cfg.RegisterServicesFromAssemblyContaining(typeof(GetProductsQuery)));

            services.AddValidatorsFromAssemblyContaining<ProductValidator>()
                .AddFluentValidationAutoValidation()
                .AddFluentValidationAutoValidation();
        }
    }
}
