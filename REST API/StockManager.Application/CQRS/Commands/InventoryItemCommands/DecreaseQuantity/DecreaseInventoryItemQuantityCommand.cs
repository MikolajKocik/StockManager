using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Dtos.ModelsDto.InventoryItemDtos;

namespace StockManager.Application.CQRS.Commands.InventoryItemCommands.DecreaseQuantity;

public sealed record DecreaseInventoryItemQuantityCommand(
    int Id, 
    decimal Amount
    ) : ICommand<InventoryItemDto>;
