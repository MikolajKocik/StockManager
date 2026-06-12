using MediatR;
using StockManager.Application.Abstractions.CQRS.Command;

namespace StockManager.Application.CQRS.Commands.PurchaseOrderCommands.SetPurchaseOrderExpectedDate;

public sealed record SetPurchaseOrderExpectedDateCommand(
    int Id,
    DateTime ExpectedDate
    ) : ICommand<Unit>;
