using MediatR;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Logging.SalesOrder;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Helpers.CQRS.NullResult;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Events;
using StockManager.Core.Domain.Interfaces.Common;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models.SalesOrderEntity;

namespace StockManager.Application.CQRS.Commands.SalesOrderCommands.AddSalesOrderLine;

public sealed class AddSalesOrderLineCommandHandler(
        ISalesOrderRepository repository,
        ILogger<AddSalesOrderLineCommandHandler> logger,
        ISalesOrderService service,
        IMessageBus messageBus,
        IUnitOfWork uow
    ) : ICommandHandler<AddSalesOrderLineCommand, Unit>
{
    private readonly ISalesOrderRepository _repository = repository;
    private readonly ILogger<AddSalesOrderLineCommandHandler> _logger = logger;
    private readonly ISalesOrderService _service = service;
    private readonly IMessageBus _messageBus = messageBus;
    private readonly IUnitOfWork _uow = uow;

    public async Task<Result<Unit>> Handle(AddSalesOrderLineCommand command, CancellationToken ct)
    {
        ResultFailureHelper.AgainstDefaultValue(command.SalesOrderId);

        SalesOrder? salesOrder = await _repository.GetSalesOrderByIdAsync(command.SalesOrderId, ct);

        if (salesOrder is null)
        {
            SalesOrderLogWarning.LogSalesOrderLineNotFound(_logger, command, default);
            return Result<Unit>.Failure(
                new Error(
                    $"SalesOrder {command.SalesOrderId} not found",
                    ErrorCodes.SalesOrderNotFound));
        }

        _service.AddLine(salesOrder, command.ProductId, command.Quantity, command.Price, command.Unit);
        await _uow.SaveChangesAsync(ct);
        SalesOrderLogInfo.LogSalesOrderUpdated(_logger, salesOrder.Id, default);

        await _messageBus.PublishAsync(
            new ActivityMessage(
                Title: "Order position added",
                Description: $"Product ID {command.ProductId} added to order {salesOrder.Id}",
                Category: "Orders",
                Type: "Info",
                Timestamp: DateTime.UtcNow,
                User: "System"
            ),
            queueName: "activities-queue",
            ct
        );

        return Result<Unit>.Success(Unit.Value);
    }
}
