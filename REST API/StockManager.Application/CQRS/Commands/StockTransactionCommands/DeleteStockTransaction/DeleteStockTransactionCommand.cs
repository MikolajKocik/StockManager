using System.Windows.Input;
using MediatR;
using StockManager.Application.Abstractions.CQRS.Command;

namespace StockManager.Application.CQRS.Commands.StockTransactionCommands.DeleteStockTransaction;

public sealed record DeleteStockTransactionCommand(
int Id
) : ICommand<Unit>;
