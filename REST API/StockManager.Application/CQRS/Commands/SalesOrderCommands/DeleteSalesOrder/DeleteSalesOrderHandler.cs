using MediatR;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Logging.SalesOrder;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Helpers.CQRS.NullResult;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Common;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.SalesOrderEntity;

namespace StockManager.Application.CQRS.Commands.SalesOrderCommands.DeleteSalesOrder;

public sealed class DeleteSalesOrderCommandHandler(
        ISalesOrderRepository repository,
        ILogger<DeleteSalesOrderCommandHandler> logger,
        IUnitOfWork uow
    ) : ICommandHandler<DeleteSalesOrderCommand, Unit>
{
    private readonly ISalesOrderRepository _repository = repository;
    private readonly ILogger<DeleteSalesOrderCommandHandler> _logger = logger;
    private readonly IUnitOfWork _uow = uow;

    public async Task<Result<Unit>> Handle(DeleteSalesOrderCommand command, CancellationToken ct)
    {
        ResultFailureHelper.AgainstDefaultValue(command.Id);

        SalesOrder? salesOrder = await _repository.GetSalesOrderByIdAsync(command.Id, ct);

        if (salesOrder is null)
        {
            return Result<Unit>.Failure(
                new Error(
                    $"SalesOrder {command.Id} not found",
                    ErrorCodes.SalesOrderNotFound));
        }

        await _repository.DeleteSalesOrderAsync(salesOrder.Id, ct);
        await _uow.SaveChangesAsync(ct);
        SalesOrderLogInfo.LogSalesOrderDeleted(_logger, salesOrder.Id, null);
        return Result<Unit>.Success(Unit.Value);
    }
}
