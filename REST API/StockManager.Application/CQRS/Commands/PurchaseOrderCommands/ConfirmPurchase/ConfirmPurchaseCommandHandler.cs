using MediatR;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Logging.PurchaseOrder;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Helpers.CQRS.NullResult;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Events;
using StockManager.Core.Domain.Interfaces.Common;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Interfaces.Services;

namespace StockManager.Application.CQRS.Commands.PurchaseOrderCommands.ConfirmPurchase;

public sealed class ConfirmPurchaseOrderCommandHandler(
        IPurchaseOrderRepository repository,
        ILogger<ConfirmPurchaseOrderCommandHandler> logger,
        IPurchaseOrderService purchaseOrderService,
        IMessageBus messageBus,
        IUnitOfWork uow
    ) : ICommandHandler<ConfirmPurchaseOrderCommand, Unit>
{
    private readonly IPurchaseOrderRepository _repository = repository;
    private readonly IPurchaseOrderService _purchaseOrderService = purchaseOrderService;
    private readonly ILogger<ConfirmPurchaseOrderCommandHandler> _logger = logger;
    private readonly IMessageBus _messageBus = messageBus;
    private readonly IUnitOfWork _uow = uow;

    public async Task<Result<Unit>> Handle(ConfirmPurchaseOrderCommand command, CancellationToken ct)
    {
        ResultFailureHelper.AgainstDefaultValue(command.Id);

        Core.Domain.Models.PurchaseOrderEntity.PurchaseOrder? purchaseOrder = await _repository.GetPurchaseOrderByIdAsync(command.Id, ct);
        if (purchaseOrder is null)
        {
            PurchaseOrderLogWarning.LogPurchaseOrderNotFound(_logger, command.Id, default);
            return Result<Unit>.Failure(
                new Error(
                    $"PurchaseOrder {command.Id} not found",
                    ErrorCodes.PurchaseOrderNotFound));
        }

        _purchaseOrderService.Confirm(purchaseOrder);
        await _uow.SaveChangesAsync(ct);

        await _messageBus.PublishAsync(
            new ActivityMessage(
                Title: "Shipment received",
                Description: $"Received purchase order ID {purchaseOrder.Id} from supplier with ID {purchaseOrder.SupplierId}.",
                Category: "Orders",
                Type: "Success",
                Timestamp: DateTime.UtcNow,
                User: "System"
            ),
            "activities-queue",
            ct
        );

        return Result<Unit>.Success(Unit.Value);
    }
}
