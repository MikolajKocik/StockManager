using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Dtos.ModelsDto.SupplierDtos;

namespace StockManager.Application.CQRS.Commands.SupplierCommands.AddSupplier;

public sealed record AddSupplierCommand(SupplierCreateDto Supplier) : ICommand<SupplierDto>;
