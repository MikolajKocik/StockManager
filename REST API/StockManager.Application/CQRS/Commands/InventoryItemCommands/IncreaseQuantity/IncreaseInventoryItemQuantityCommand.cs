using System.Windows.Input;
using MediatR;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.InventoryItemDtos;

namespace StockManager.Application.CQRS.Commands.InventoryItemCommands.IncreaseQuantity;

public sealed record IncreaseInventoryItemQuantityCommand(
    int Id,
    decimal Amount) 
    : ICommand<InventoryItemDto>;
