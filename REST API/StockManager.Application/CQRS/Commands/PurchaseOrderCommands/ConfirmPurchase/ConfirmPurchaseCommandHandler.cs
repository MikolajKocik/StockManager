using MediatR;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Logging.General;
using StockManager.Application.Common.Logging.PurchaseOrder;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Helpers.CQRS.NullResult;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Events;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Interfaces.Services;

namespace StockManager.Application.CQRS.Commands.PurchaseOrderCommands.ConfirmPurchase;

public sealed class ConfirmPurchaseOrderCommandHandler : ICommandHandler<ConfirmPurchaseOrderCommand, Unit>
{
    private readonly IPurchaseOrderRepository _repository;
    private readonly IPurchaseOrderService _purchaseOrderService;
    private readonly ILogger<ConfirmPurchaseOrderCommandHandler> _logger;
    private readonly IMessageBus _messageBus;

    public ConfirmPurchaseOrderCommandHandler(
        IPurchaseOrderRepository repository,
        ILogger<ConfirmPurchaseOrderCommandHandler> logger,
        IPurchaseOrderService purchaseOrderService,
        IMessageBus messageBus
        )
    {
        _repository = repository;
        _logger = logger;
        _purchaseOrderService = purchaseOrderService;
        _messageBus = messageBus;
    }

    public async Task<Result<Unit>> Handle(ConfirmPurchaseOrderCommand command, CancellationToken cancellationToken)
    {
        ResultFailureHelper.IfProvidedNullArgument(command.Id);

        Core.Domain.Models.PurchaseOrderEntity
            .PurchaseOrder? purchaseOrder = await _repository.GetPurchaseOrderByIdAsync(command.Id, cancellationToken);
        if (purchaseOrder is null)
        {
            PurchaseOrderLogWarning.LogPurchaseOrderNotFound(_logger, command.Id, default);
            return Result<Unit>.Failure(
                new Error(
                    $"PurchaseOrder {command.Id} not found",
                    ErrorCodes.PurchaseOrderNotFound));
        }

        try
        {
            _purchaseOrderService.Confirm(purchaseOrder);
            await _repository.UpdatePurchaseOrderAsync(purchaseOrder, cancellationToken);

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
                cancellationToken
            );

            return Result<Unit>.Success(Unit.Value);
        }
        catch (Exception ex)
        {
            GeneralLogError.UnhandledException(_logger, ex.Message, ex);
            throw;
        }
    }
}
