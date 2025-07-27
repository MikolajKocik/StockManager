using MediatR;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Dtos.ModelsDto.ProductDtos;

namespace StockManager.Application.CQRS.Commands.ProductCommands.EditProduct;

public sealed class EditProductCommand : ICommand<Unit>
{
    public int Id { get; }
    public ProductUpdateDto Product { get; }

    public EditProductCommand(int id, ProductUpdateDto product) 
    {
        Id = id;
        Product = product;
    }
}
