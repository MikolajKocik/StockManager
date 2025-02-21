using AutoMapper;
using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using StockManager.Application.CQRS.Commands.ProductCommands.AddProduct;
using StockManager.Application.CQRS.Commands.ProductCommands.DeleteProduct;
using StockManager.Application.CQRS.Commands.ProductCommands.EditProduct;
using StockManager.Application.CQRS.Queries.ProductQueries.GetProductById;
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
            {
                cfg.RegisterServicesFromAssemblyContaining(typeof(GetProductsQuery));
                cfg.RegisterServicesFromAssemblyContaining(typeof(GetProductByIdQuery));
                cfg.RegisterServicesFromAssemblyContaining(typeof(EditProductCommand));
                cfg.RegisterServicesFromAssemblyContaining(typeof(DeleteProductCommand));
                cfg.RegisterServicesFromAssemblyContaining(typeof(AddProductCommand));
            });



            services.AddValidatorsFromAssemblyContaining<ProductValidator>()
                .AddFluentValidationAutoValidation()
                .AddFluentValidationAutoValidation();

            services.AddValidatorsFromAssemblyContaining<AddressValidator>()
                .AddFluentValidationAutoValidation()
                .AddFluentValidationAutoValidation();

            services.AddValidatorsFromAssemblyContaining<SupplierValidator>()
                .AddFluentValidationAutoValidation()
                .AddFluentValidationAutoValidation();
        }
    }
}
