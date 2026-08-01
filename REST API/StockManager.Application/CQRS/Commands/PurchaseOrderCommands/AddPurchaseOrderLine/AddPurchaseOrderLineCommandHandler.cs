using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Logging.PurchaseOrder;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.CQRS.Commands.PurchaseOrder.AddPurchaseOrderLine;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Common;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models.PurchaseOrderLineEntity;

namespace StockManager.Application.CQRS.Commands.PurchaseOrderCommands.AddPurchaseOrderLine;

public sealed class AddPurchaseOrderLineCommandHandler(
        IPurchaseOrderRepository repository,
        IMapper mapper,
        ILogger<AddPurchaseOrderLineCommandHandler> logger,
        IPurchaseOrderService service,
        IUnitOfWork uow
    ) : ICommandHandler<AddPurchaseOrderLineCommand, Unit>
{
    private readonly IPurchaseOrderRepository _repository = repository;
    private readonly IMapper _mapper = mapper;
    private readonly ILogger<AddPurchaseOrderLineCommandHandler> _logger = logger;
    private readonly IPurchaseOrderService _service = service;
    private readonly IUnitOfWork _uow = uow;

    public async Task<Result<Unit>> Handle(AddPurchaseOrderLineCommand command, CancellationToken ct)
    {
        ArgumentNullException.ThrowIfNull(command, nameof(command));

        Core.Domain.Models.PurchaseOrderEntity.PurchaseOrder? purchaseOrder = await _repository.GetPurchaseOrderByIdAsync(command.PurchaseOrderId, ct);
        if (purchaseOrder is null)
        {
            PurchaseOrderLogWarning.LogPurchaseOrderNotFound(_logger, command.PurchaseOrderId, default);
            return Result<Unit>.Failure(
                new Error(
                    $"PurchaseOrder {command.PurchaseOrderId} not found",
                    ErrorCodes.PurchaseOrderNotFound));
        }

        PurchaseOrderLine line = _mapper.Map<PurchaseOrderLine>(command.Line);
        _service.AddLine(purchaseOrder, line);

        await _uow.SaveChangesAsync(ct);
        PurchaseOrderLogInfo.LogPurchaseOrderUpdated(_logger, purchaseOrder.Id, default);

        return Result<Unit>.Success(Unit.Value);
    }
}
