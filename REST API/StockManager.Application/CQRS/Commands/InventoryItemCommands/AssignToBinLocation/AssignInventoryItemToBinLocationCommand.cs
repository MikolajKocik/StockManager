using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Dtos.ModelsDto.InventoryItemDtos;

namespace StockManager.Application.CQRS.Commands.InventoryItemCommands.AssignToBinLocation;

public sealed record AssignInventoryItemToBinLocationCommand(
    int Id, 
    int NewBinLocationId)
    : ICommand<InventoryItemDto>;
