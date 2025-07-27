using System.Reflection;
using MediatR;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Abstractions.CQRS.MediatorAdapter.Command;
using StockManager.Application.Abstractions.CQRS.MediatorAdapter.Query;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.CQRS.Commands.ProductCommands.AddProduct;
using StockManager.Application.CQRS.Commands.ProductCommands.DeleteProduct;
using StockManager.Application.CQRS.Commands.ProductCommands.EditProduct;
using StockManager.Application.CQRS.Queries.ProductQueries.GetProductById;
using StockManager.Application.CQRS.Queries.ProductQueries.GetProducts;
using StockManager.Infrastructure.DomainServices;

namespace StockManager.Extensions.WebAppBuilderExtensions.Services;

internal static class ServiceRegistration
{
    public static void AddServices(this IServiceCollection services)
    {
        // scrutor package
        services.Scan(scan => scan
            .FromAssemblies(
                 typeof(AddProductCommand).Assembly,
                 typeof(DeleteProductCommand).Assembly,
                 typeof(EditProductCommand).Assembly,
                 typeof(GetProductByIdQuery).Assembly,
                 typeof(GetProductsQuery).Assembly
            )
            // handlers
            .AddClasses(c => c.AssignableTo(typeof(ICommandHandler<>)))
                .AsImplementedInterfaces()
                .WithScopedLifetime()
            .AddClasses(c => c.AssignableTo(typeof(ICommandHandler<,>)))
                .AsImplementedInterfaces()
                .WithScopedLifetime()
            .AddClasses(c => c.AssignableTo(typeof(IQueryHandler<,>)))
                .AsImplementedInterfaces()
                .WithScopedLifetime()
        );

        // MediatR adapters
        RegisterMediatorAdapters(services);

        // domain services 
        Assembly domainServicesAssembly = typeof(ProductService).Assembly;

        services.Scan(scan => scan
            .FromAssemblies(domainServicesAssembly)
            .AddClasses(classes => classes.InNamespaces(
                "StockManager.Infrastructure.DomainServices"))
            .AsImplementedInterfaces()
            .WithTransientLifetime());
    }

    private static void  RegisterMediatorAdapters(this IServiceCollection services)
    {

        Assembly appAssembly = typeof(Application.Extensions.ServiceCollectionExtensions).Assembly;
        foreach (Type type in appAssembly.GetTypes())
        {
            if (type.IsAbstract || !type.IsClass)
            {
                continue;
            }

            foreach (Type iface in type.GetInterfaces())
            {
                if (!iface.IsGenericType)
                {
                    continue;
                }

                Type def = iface.GetGenericTypeDefinition();

                // QueryHandler<TQ,TR>
                if (def == typeof(IQueryHandler<,>))
                {
                    (Type TQ, Type TR) = (iface.GetGenericArguments()[0], iface.GetGenericArguments()[1]);
                    services.AddTransient(
                        typeof(IRequestHandler<,>).MakeGenericType(TQ, typeof(Result<>).MakeGenericType(TR)),
                        typeof(MediatorQueryAdapter<,>).MakeGenericType(TQ, TR)
                    );
                }
                // CommandHandler<TC,TR>
                else if (def == typeof(ICommandHandler<,>))
                {
                    (Type TC, Type TR) = (iface.GetGenericArguments()[0], iface.GetGenericArguments()[1]);
                    services.AddTransient(
                        typeof(IRequestHandler<,>).MakeGenericType(TC, typeof(Result<>).MakeGenericType(TR)),
                        typeof(MediatorCommandAdapterValue<,>).MakeGenericType(TC, TR)
                    );
                }
                // CommandHandler<TC> (void)
                else if (def == typeof(ICommandHandler<>))
                {
                    Type TC = iface.GetGenericArguments()[0];
                    services.AddTransient(
                        typeof(IRequestHandler<,>).MakeGenericType(TC, typeof(Result<Unit>)),
                        typeof(MediatorCommandAdapter<>).MakeGenericType(TC)
                    );
                }
            }
        }
    }
}
