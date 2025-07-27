using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Dtos.ModelsDto.SupplierDtos;

namespace StockManager.Application.CQRS.Commands.SupplierCommands.DeleteSupplier;

public sealed record DeleteSupplierCommand : ICommand<SupplierDto>
{
    public Guid Id { get; } 
    public DeleteSupplierCommand(Guid id)
    {
        Id = id;
    }
}
