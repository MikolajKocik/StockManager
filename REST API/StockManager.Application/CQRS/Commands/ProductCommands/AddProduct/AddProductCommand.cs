using MediatR;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Dtos.ModelsDto.ProductDtos;

namespace StockManager.Application.CQRS.Commands.ProductCommands.AddProduct;

public sealed class AddProductCommand : ICommand<ProductDto>
{
    public ProductCreateDto Product { get; set; }

    public AddProductCommand(ProductCreateDto product)
    {
        Product = product;
    }
}
