using MediatR;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Dtos.ModelsDto.SupplierDtos;

namespace StockManager.Application.CQRS.Commands.SupplierCommands.DeleteSupplier;

public sealed record DeleteSupplierCommand : ICommand<Unit>
{
    public Guid Id { get; } 
    public DeleteSupplierCommand(Guid id)
    {
        Id = id;
    }
}
