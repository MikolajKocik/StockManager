using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Logging.General;
using StockManager.Application.Common.Logging.SalesOrder;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Interfaces.Services;

namespace StockManager.Application.CQRS.Commands.SalesOrderCommands.AddSalesOrderLine;
public sealed class AddSalesOrderLineCommandHandler : ICommandHandler<AddSalesOrderLineCommand, Unit>
{
    private readonly ISalesOrderRepository _repository;
    private readonly ILogger<AddSalesOrderLineCommandHandler> _logger;
    private readonly ISalesOrderService _service;

    public AddSalesOrderLineCommandHandler(
        ISalesOrderRepository repository,
        ILogger<AddSalesOrderLineCommandHandler> logger,
        ISalesOrderService service
        )
    {
        _repository = repository;
        _logger = logger;
        _service = service;
    }

    public async Task<Result<Unit>> Handle(AddSalesOrderLineCommand command, CancellationToken cancellationToken)
    {
        Core.Domain.Models.SalesOrderEntity.SalesOrder? salesOrder = await _repository.GetSalesOrderByIdAsync(command.SalesOrderId, cancellationToken);
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

            return Result<Unit>.Success(Unit.Value);
        }
        catch (Exception ex)
        {
            GeneralLogError.UnhandledException(_logger, ex.Message, ex);
            throw;
        }
    }
}
