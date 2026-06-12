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
using StockManager.Core.Domain.Models.SalesOrderEntity;

namespace StockManager.Application.CQRS.Commands.SalesOrderCommands.AddSalesOrderLine;

public sealed class AddSalesOrderLineCommandHandler : ICommandHandler<AddSalesOrderLineCommand, Unit>
{
    private readonly ISalesOrderRepository _repository;
    private readonly ILogger<AddSalesOrderLineCommandHandler> _logger;
    private readonly ISalesOrderService _service;
    private readonly IMessageBus _messageBus;

    public AddSalesOrderLineCommandHandler(
        ISalesOrderRepository repository,
        ILogger<AddSalesOrderLineCommandHandler> logger,
        ISalesOrderService service,
        IMessageBus messageBus
        )
    {
        _repository = repository;
        _logger = logger;
        _service = service;
        _messageBus = messageBus;
    }

    public async Task<Result<Unit>> Handle(AddSalesOrderLineCommand command, CancellationToken cancellationToken)
    {
        ResultFailureHelper.IfProvidedNullArgument(command.SalesOrderId);

        SalesOrder? salesOrder = await _repository.GetSalesOrderByIdAsync(command.SalesOrderId, cancellationToken);

        if (salesOrder is null)
        {
            SalesOrderLogWarning.LogSalesOrderLineNotFound(_logger, command, default);
            return Result<Unit>.Failure(
                new Error(
                    $"SalesOrder {command.SalesOrderId} not found",
                    ErrorCodes.SalesOrderNotFound));
        }

        try
        {
            _service.AddLine(salesOrder, command.ProductId, command.Quantity, command.Price, command.Unit);
            await _repository.UpdateSalesOrderAsync(salesOrder, cancellationToken);
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
