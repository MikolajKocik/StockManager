using MediatR;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Logging.SalesOrder;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Helpers.CQRS.NullResult;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Common;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Interfaces.Services;

namespace StockManager.Application.CQRS.Commands.SalesOrderCommands.DeliverSalesOrder;

public sealed class DeliverSalesOrderCommandHandler(
        ISalesOrderRepository repository,
        ILogger<DeliverSalesOrderCommandHandler> logger,
        ISalesOrderService service,
        IUnitOfWork uow
    ) : ICommandHandler<DeliverSalesOrderCommand, Unit>
{
    private readonly ISalesOrderRepository _repository = repository;
    private readonly ILogger<DeliverSalesOrderCommandHandler> _logger = logger;
    private readonly ISalesOrderService _service = service;
    private readonly IUnitOfWork _uow = uow;

    public async Task<Result<Unit>> Handle(DeliverSalesOrderCommand command, CancellationToken ct)
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

        _service.Deliver(salesOrder, command.DeliveredDate); 
        await _uow.SaveChangesAsync(ct);
        SalesOrderLogInfo.LogSalesOrderUpdated(_logger, salesOrder.Id, default);

        return Result<Unit>.Success(Unit.Value);
    }
}
