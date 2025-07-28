using MediatR;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Dtos.ModelsDto.ProductDtos;

namespace StockManager.Application.CQRS.Commands.ProductCommands.DeleteProduct;

public sealed record DeleteProductCommand : ICommand<Unit>
{
    public int Id { get; }

    public DeleteProductCommand(int id)
    {
        Id = id;
    }
}
