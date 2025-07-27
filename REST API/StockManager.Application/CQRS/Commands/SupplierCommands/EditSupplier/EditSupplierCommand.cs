using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Dtos.ModelsDto.SupplierDtos;

namespace StockManager.Application.CQRS.Commands.SupplierCommands.EditSupplier;

public sealed class EditSupplierCommand : ICommand<SupplierDto>
{
    public Guid Id { get; }

    public SupplierDto Supplier { get; set; }

    public EditSupplierCommand(Guid id, SupplierDto supplier)
    {
        Id = id;
        Supplier = supplier;
    }
}
