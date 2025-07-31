using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Logging.General;
using StockManager.Application.Common.Logging.PurchaseOrder;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models.PurchaseOrderLineEntity;

namespace StockManager.Application.CQRS.Commands.PurchaseOrder.AddPurchaseOrderLine;
public sealed class AddPurchaseOrderLineCommandHandler : ICommandHandler<AddPurchaseOrderLineCommand, Unit>
{
    private readonly IPurchaseOrderRepository _repository;
    private readonly IMapper _mapper;
    private readonly ILogger<AddPurchaseOrderLineCommandHandler> _logger;
    private readonly IPurchaseOrderService _service;

    public AddPurchaseOrderLineCommandHandler(
        IPurchaseOrderRepository repository, 
        IMapper mapper,
        ILogger<AddPurchaseOrderLineCommandHandler> logger,
        IPurchaseOrderService service
        )
    {
        _repository = repository;
        _mapper = mapper;
        _logger = logger;
        _service = service;
    }

    public async Task<Result<Unit>> Handle(AddPurchaseOrderLineCommand command, CancellationToken cancellationToken)
    {
        Core.Domain.Models.PurchaseOrderEntity.PurchaseOrder? purchaseOrder = await _repository.GetPurchaseOrderByIdAsync(command.PurchaseOrderId, cancellationToken);
        if (purchaseOrder is null)
        {
            PurchaseOrderLogWarning.LogPurchaseOrderNotFound(_logger, command.PurchaseOrderId, default);
            return Result<Unit>.Failure(
                new Error(
                    $"PurchaseOrder {command.PurchaseOrderId} not found", 
                    ErrorCodes.PurchaseOrderNotFound));
        }

        try
        {
            PurchaseOrderLine line = _mapper.Map<PurchaseOrderLine>(command.Line);
            purchaseOrder.AddLine(line);

            await _repository.UpdatePurchaseOrderAsync(purchaseOrder, cancellationToken);
            PurchaseOrderLogInfo.LogPurchaseOrderUpdated(_logger, purchaseOrder.Id, default);

            return Result<Unit>.Success(Unit.Value);
        }
        catch (Exception ex)
        {
            GeneralLogError.UnhandledException(_logger, ex.Message, ex);
            throw;
        }
    }
}
