using MediatR;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.InventoryItemDtos;

namespace StockManager.Application.CQRS.Commands.InventoryItemCommands.ReleaseQuantity;

public sealed record ReleaseInventoryItemQuantityCommand(
    int Id,
    decimal Amount) 
    : ICommand<InventoryItemDto>;
