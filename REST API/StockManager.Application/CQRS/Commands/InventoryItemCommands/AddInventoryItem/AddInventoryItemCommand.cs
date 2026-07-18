using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Dtos.ModelsDto.InventoryItemDtos;

namespace StockManager.Application.CQRS.Commands.InventoryItemCommands.AddInventoryItem;
public sealed record AddInventoryItemCommand(InventoryItemCreateDto InventoryItem) : ICommand<InventoryItemDto>;
 