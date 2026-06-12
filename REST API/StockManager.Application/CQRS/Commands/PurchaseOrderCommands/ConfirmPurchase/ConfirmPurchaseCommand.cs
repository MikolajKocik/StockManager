using MediatR;
using StockManager.Application.Abstractions.CQRS.Command;

namespace StockManager.Application.CQRS.Commands.PurchaseOrderCommands.ConfirmPurchase;

public sealed record ConfirmPurchaseOrderCommand(
    int Id)
    : ICommand<Unit>;
