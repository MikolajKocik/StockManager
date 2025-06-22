using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Dtos.ModelsDto.Product;

namespace StockManager.Application.CQRS.Commands.ProductCommands.EditProduct;

public sealed class EditProductCommand : ICommand<ProductDto>
{
    public int Id { get; }
    public ProductDto Product { get; }

    public EditProductCommand(int id, ProductDto product) 
    {
        Id = id;
        Product = product;
    }
}
