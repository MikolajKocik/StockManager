using MediatR;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.ResultPattern;

namespace StockManager.Application.CQRS.Commands.InventoryItemCommands.DeleteInventoryItem;

public sealed record DeleteInventoryItemCommand(int Id) : ICommand<Unit>;
