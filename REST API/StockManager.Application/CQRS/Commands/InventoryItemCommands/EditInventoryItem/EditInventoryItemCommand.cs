using System.Windows.Input;
using MediatR;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.InventoryItemDtos;

namespace StockManager.Application.CQRS.Commands.InventoryItemCommands.EditInventoryItem;

public sealed record EditInventoryItemCommand(int Id, InventoryItemUpdateDto UpdateDto) 
    : ICommand<Unit>;
