using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MediatR;
using Microsoft.Extensions.Logging;
using StockManager.Application.Common.Logging.General;
using StockManager.Application.Common.Logging.PurchaseOrder;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.CQRS.Commands.PurchaseOrder.AssignPurchaseOrderInvoice;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Interfaces.Services;

namespace StockManager.Application.CQRS.Commands.PurchaseOrderCommands.AssignPurchaseOrderInvoice;

public sealed class AssignPurchaseOrderInvoiceCommandHandler
    : IRequestHandler<AssignPurchaseOrderInvoiceCommand, Result<Unit>>
{
    private readonly IPurchaseOrderRepository _repository;
    private readonly ILogger<AssignPurchaseOrderInvoiceCommandHandler> _logger;
    private readonly IPurchaseOrderService _service;

    public AssignPurchaseOrderInvoiceCommandHandler(
        IPurchaseOrderRepository repository, 
        ILogger<AssignPurchaseOrderInvoiceCommandHandler> logger,
        IPurchaseOrderService service
        )
    {
        _repository = repository;
        _logger = logger;
        _service = service;
    }

    public async Task<Result<Unit>> Handle(AssignPurchaseOrderInvoiceCommand command, CancellationToken cancellationToken)
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
            _service.AssignInvoice(purchaseOrder, command.InvoiceId);
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
