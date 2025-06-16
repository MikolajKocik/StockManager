using MediatR;
using Microsoft.EntityFrameworkCore;
using Serilog;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.CQRS.Commands.ProductCommands.AddProduct;
using StockManager.Application.CQRS.Commands.ProductCommands.DeleteProduct;
using StockManager.Application.CQRS.Commands.ProductCommands.EditProduct;
using StockManager.Application.CQRS.Queries.ProductQueries.GetProductById;
using StockManager.Application.CQRS.Queries.ProductQueries.GetProducts;
using StockManager.Application.Extensions;
using StockManager.Core.Domain.Models;
using StockManager.Extensions;
using StockManager.Infrastructure.Data;
using StockManager.Infrastructure.Extensions;
using StockManager.Middlewares;

var builder = WebApplication.CreateBuilder(args);

if (builder.Environment.IsDevelopment())
{
    // user secrets data
    builder.Configuration.AddUserSecrets<Program>();
}

builder.AddPresentation();
builder.Services.AddInfrastructure(builder.Configuration);

builder.Services.AddApplication(builder.Configuration);

// scrutor package
builder.Services.Scan(scan => scan
    .FromAssemblies(
         typeof(AddProductCommand).Assembly,
         typeof(DeleteProductCommand).Assembly,
         typeof(EditProductCommand).Assembly,
         typeof(GetProductByIdQuery).Assembly,
         typeof(GetProductsQuery).Assembly
    )
    .AddClasses(c => c.AssignableTo(typeof(ICommandHandler<>)))
        .AsImplementedInterfaces()
        .WithScopedLifetime()
    .AddClasses(c => c.AssignableTo(typeof(ICommandHandler<,>)))
        .AsImplementedInterfaces()
        .WithScopedLifetime()
    .AddClasses(c => c.AssignableTo(typeof(IQueryHandler<,>)))
        .AsImplementedInterfaces()
        .WithScopedLifetime()
    .AddClasses(c => c.AssignableTo(typeof(IRequestHandler<,>))) // adapters
        .AsImplementedInterfaces()
        .WithScopedLifetime()
);

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseMiddleware<ErrorHandlingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//serilog requests
app.UseSerilogRequestLogging();

// Automatically checks pending migrations and update database
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider
        .GetRequiredService<StockManagerDbContext>();

    var pendingMigrations = dbContext.Database.GetPendingMigrations();

    if (pendingMigrations.Any())
    {
        dbContext.Database.Migrate();
    }
}

app.UseHttpsRedirection();

app.MapGroup("api/identity")
    .WithTags("Identity")
    .MapIdentityApi<User>();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();