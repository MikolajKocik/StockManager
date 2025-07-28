using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Dtos.ModelsDto.SupplierDtos;

namespace StockManager.Application.CQRS.Commands.SupplierCommands.EditSupplier;

public sealed class EditSupplierCommand : ICommand<SupplierDto>
{
    public Guid Id { get; }

    public SupplierUpdateDto Supplier { get; set; }

    public EditSupplierCommand(Guid id, SupplierUpdateDto supplier)
    {
        Id = id;
        Supplier = supplier;
    }
}
