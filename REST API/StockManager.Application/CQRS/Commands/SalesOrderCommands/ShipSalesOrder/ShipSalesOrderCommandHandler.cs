using MediatR;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Logging.General;
using StockManager.Application.Common.Logging.SalesOrder;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Helpers.CQRS.NullResult;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Events;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Interfaces.Services;

namespace StockManager.Application.CQRS.Commands.SalesOrderCommands.ShipSalesOrder;

public sealed class ShipSalesOrderCommandHandler : ICommandHandler<ShipSalesOrderCommand, Unit>
{
    private readonly ISalesOrderRepository _repository;
    private readonly ILogger<ShipSalesOrderCommandHandler> _logger;
    private readonly ISalesOrderService _service;
    private readonly IMessageBus _messageBus;

    public ShipSalesOrderCommandHandler(
        ISalesOrderRepository repository,
        ILogger<ShipSalesOrderCommandHandler> logger,
        ISalesOrderService service,
        IMessageBus messageBus
        )
    {
        _repository = repository;
        _logger = logger;
        _service = service;
        _messageBus = messageBus;
    }

    public async Task<Result<Unit>> Handle(ShipSalesOrderCommand command, CancellationToken cancellationToken)
    {
        ResultFailureHelper.IfProvidedNullArgument(command.Id);

        Core.Domain.Models.SalesOrderEntity
            .SalesOrder? salesOrder = await _repository.GetSalesOrderByIdAsync(command.Id, cancellationToken);

        if (salesOrder is null)
        {
            SalesOrderLogWarning.LogSalesOrderNotFound(_logger, command.Id, default);
            return Result<Unit>.Failure(
                new Error(
                    $"SalesOrder {command.Id} not found",
                    ErrorCodes.SalesOrderNotFound));
        }

        try
        {
            _service.Ship(salesOrder, command.ShipDate);
            await _repository.UpdateSalesOrderAsync(salesOrder, cancellationToken);

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
