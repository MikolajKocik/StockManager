using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Logging.General;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Repositories;

namespace StockManager.Application.CQRS.Commands.SalesOrderCommands.DeleteSalesOrder;
public sealed class DeleteSalesOrderCommandHandler: ICommandHandler<DeleteSalesOrderCommand, Unit>
{
    private readonly ISalesOrderRepository _repository;
    private readonly ILogger<DeleteSalesOrderCommandHandler> _logger;

    public DeleteSalesOrderCommandHandler(
        ISalesOrderRepository repository,
        ILogger<DeleteSalesOrderCommandHandler> logger
        )
    {
        _repository = repository;
        _logger = logger;
    }

    public async Task<Result<Unit>> Handle(DeleteSalesOrderCommand command, CancellationToken cancellationToken)
    {
        try
        {
            Core.Domain.Models.SalesOrderEntity.SalesOrder? salesOrder = await _repository.GetSalesOrderByIdAsync(command.Id, cancellationToken);

            if (salesOrder is null)
            {
                return Result<Unit>.Failure(
                    new Error(
                        $"SalesOrder {command.Id} not found", 
                        ErrorCodes.SalesOrderNotFound));
            }

            await _repository.DeleteSalesOrderAsync(salesOrder, cancellationToken);
            return Result<Unit>.Success(Unit.Value);
        }
        catch (DbUpdateException ex) when (ex.InnerException is SqlException { Number: 547 })
        {
            return Result<Unit>.Failure(
                new Error(
                    "Cannot delete: referenced by other records.", 
                    ErrorCodes.SalesOrderConflict));
        }
        catch (Exception ex)
        {
            GeneralLogError.UnhandledException(_logger, ex.Message, ex);
            throw;
        }
    }
}
