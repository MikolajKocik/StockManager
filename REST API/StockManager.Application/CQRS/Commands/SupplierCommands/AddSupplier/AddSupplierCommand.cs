using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Dtos.ModelsDto.SupplierDtos;

namespace StockManager.Application.CQRS.Commands.SupplierCommands.AddSupplier;

public sealed class AddSupplierCommand : ICommand<SupplierDto>
{
    public SupplierCreateDto Supplier { get; set; }
    public AddSupplierCommand(SupplierCreateDto supplier)
    {
        Supplier = supplier;
    }
}
