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
using StockManager.Application.Common.Logging.PurchaseOrder;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Helpers.CQRS.NullResult;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Repositories;

namespace StockManager.Application.CQRS.Commands.PurchaseOrder.DeletePurchase;

public sealed class DeletePurchaseOrderCommandHandler : ICommandHandler<DeletePurchaseOrderCommand, Unit>
{
    private readonly IPurchaseOrderRepository _repository;
    private readonly ILogger<DeletePurchaseOrderCommandHandler> _logger;

    public DeletePurchaseOrderCommandHandler(
        IPurchaseOrderRepository repository, 
        ILogger<DeletePurchaseOrderCommandHandler> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    public async Task<Result<Unit>> Handle(DeletePurchaseOrderCommand command, CancellationToken cancellationToken)
    {
        try
        {
            ResultFailureHelper.IfProvidedNullArgument(command.Id);

            Core.Domain.Models.PurchaseOrderEntity
                .PurchaseOrder? entity = await _repository.GetPurchaseOrderByIdAsync(command.Id, cancellationToken);

            if (entity is null)
            {
                PurchaseOrderLogWarning.LogPurchaseOrderNotFound(_logger, command.Id, default);

                return Result<Unit>.Failure(
                    new Error(
                        $"PurchaseOrder {command.Id} not found",
                        ErrorCodes.PurchaseOrderNotFound));
            }

            await _repository.DeletePurchaseOrderAsync(entity, cancellationToken);
            return Result<Unit>.Success(Unit.Value);
        }
        catch (DbUpdateException ex) when (ex.InnerException is SqlException { Number: 547 })
        {
            return Result<Unit>.Failure(
                new Error(
                    "Cannot delete: referenced by other records.", 
                    ErrorCodes.PurchaseOrderConflict));
        }
        catch (Exception ex)
        {
            GeneralLogError.UnhandledException(_logger, ex.Message, ex);
            throw;
        }
    }
}
