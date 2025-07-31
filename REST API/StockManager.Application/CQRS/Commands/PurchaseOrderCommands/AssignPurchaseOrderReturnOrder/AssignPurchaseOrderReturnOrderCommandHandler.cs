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
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Interfaces.Services;

namespace StockManager.Application.CQRS.Commands.PurchaseOrder.AssignPurchaseOrderReturnOrder;
public sealed class AssignPurchaseOrderReturnOrderCommandHandler: ICommandHandler<AssignPurchaseOrderReturnOrderCommand, Unit>
{
    private readonly IPurchaseOrderRepository _repository;
    private readonly ILogger<AssignPurchaseOrderReturnOrderCommandHandler> _logger;
    private readonly IPurchaseOrderService _service;

    public AssignPurchaseOrderReturnOrderCommandHandler(
        IPurchaseOrderRepository repository,
        ILogger<AssignPurchaseOrderReturnOrderCommandHandler> logger,
        IPurchaseOrderService service

        )
    {
        _repository = repository;
        _logger = logger;
        _service = service;
    }

    public async Task<Result<Unit>> Handle(AssignPurchaseOrderReturnOrderCommand command, CancellationToken cancellationToken)
    {
        Core.Domain.Models.PurchaseOrderEntity.PurchaseOrder? purchaseOrder = await _repository.GetPurchaseOrderByIdAsync(command.Id, cancellationToken);
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
            _service.AssignReturnOrder(purchaseOrder, command.ReturnOrderId);
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
