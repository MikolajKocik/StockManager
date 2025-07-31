using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Dtos.ModelsDto.SupplierDtos;

namespace StockManager.Application.CQRS.Commands.SupplierCommands.EditSupplier;

public sealed record EditSupplierCommand(Guid Id, SupplierUpdateDto Supplier) : ICommand<SupplierDto>;

