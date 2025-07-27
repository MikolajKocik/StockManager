using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Dtos.ModelsDto.SupplierDtos;

namespace StockManager.Application.CQRS.Commands.SupplierCommands.AddSupplier;

public sealed class AddSupplierCommand : ICommand<SupplierDto>
{
    public SupplierDto Supplier { get; set; }
    public AddSupplierCommand(SupplierDto supplier)
    {
        Supplier = supplier;
    }
}
