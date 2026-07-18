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

namespace StockManager.Application.CQRS.Commands.SalesOrderCommands.ShipSalesOrder;

public sealed class ShipSalesOrderCommandHandler(
        ISalesOrderRepository repository,
        ILogger<ShipSalesOrderCommandHandler> logger,
        ISalesOrderService service,
        IMessageBus messageBus,
        IUnitOfWork uow
    ) : ICommandHandler<ShipSalesOrderCommand, Unit>
{
    private readonly ISalesOrderRepository _repository = repository;
    private readonly ILogger<ShipSalesOrderCommandHandler> _logger = logger;
    private readonly ISalesOrderService _service = service;
    private readonly IMessageBus _messageBus = messageBus;
    private readonly IUnitOfWork _uow = uow;

    public async Task<Result<Unit>> Handle(ShipSalesOrderCommand command, CancellationToken ct)
    {
        ResultFailureHelper.AgainstDefaultValue(command.Id);

        Core.Domain.Models.SalesOrderEntity.SalesOrder? salesOrder = await _repository.GetSalesOrderByIdAsync(command.Id, ct);

        if (salesOrder is null)
        {
            SalesOrderLogWarning.LogSalesOrderNotFound(_logger, command.Id, default);
            return Result<Unit>.Failure(
                new Error(
                    $"SalesOrder {command.Id} not found",
                    ErrorCodes.SalesOrderNotFound));
        }

        _service.Ship(salesOrder, command.ShipDate);
        await _uow.SaveChangesAsync(ct);

        SalesOrderLogInfo.LogSalesOrderUpdated(_logger, salesOrder.Id, default);

        await _messageBus.PublishAsync(
            new ActivityMessage(
                Title: "Order send",
                Description: $"Sales order ID {salesOrder.Id} has been send.",
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
