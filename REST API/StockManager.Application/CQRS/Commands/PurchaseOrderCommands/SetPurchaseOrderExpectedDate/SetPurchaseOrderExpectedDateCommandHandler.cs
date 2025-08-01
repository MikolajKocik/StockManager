using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Logging.General;
using StockManager.Application.Common.Logging.PurchaseOrder;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Helpers.CQRS.NullResult;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Interfaces.Services;

namespace StockManager.Application.CQRS.Commands.PurchaseOrder.SetPurchaseOrderExpectedDate;

public sealed class SetPurchaseOrderExpectedDateCommandHandler : ICommandHandler<SetPurchaseOrderExpectedDateCommand, Unit>
{
    private readonly IPurchaseOrderRepository _repository;
    private readonly ILogger<SetPurchaseOrderExpectedDateCommandHandler> _logger;
    private readonly IPurchaseOrderService _service;

    public SetPurchaseOrderExpectedDateCommandHandler(
        IPurchaseOrderRepository repository,
        ILogger<SetPurchaseOrderExpectedDateCommandHandler> logger,
        IPurchaseOrderService service
        )
    {
        _repository = repository;
        _logger = logger;
        _service = service;
    }

    public async Task<Result<Unit>> Handle(SetPurchaseOrderExpectedDateCommand command, CancellationToken cancellationToken)
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
            if (purchaseOrder.ExpectedDate.HasValue)
            {
                _service.SetExpectedDate(purchaseOrder, purchaseOrder.ExpectedDate.Value);
            }

            await _repository.UpdatePurchaseOrderAsync(purchaseOrder, cancellationToken);
            return Result<Unit>.Success(Unit.Value);
        }
        catch (Exception ex)
        {
            GeneralLogError.UnhandledException(_logger, ex.Message, ex);
            throw;
        }
    }
}
