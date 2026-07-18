using MediatR;
using StockManager.Application.Abstractions.CQRS.Command;

namespace StockManager.Application.CQRS.Commands.InventoryItemCommands.DeleteInventoryItem;

public sealed record DeleteInventoryItemCommand(int Id) : ICommand<Unit>;
