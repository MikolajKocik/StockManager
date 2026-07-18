using MediatR;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Logging.PurchaseOrder;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.CQRS.Commands.PurchaseOrder.AssignPurchaseOrderReturnOrder;
using StockManager.Application.Helpers.CQRS.NullResult;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Common;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Interfaces.Services;

namespace StockManager.Application.CQRS.Commands.PurchaseOrderCommands.AssignPurchaseOrderReturnOrder;

public sealed class AssignPurchaseOrderReturnOrderCommandHandler(
        IPurchaseOrderRepository repository,
        ILogger<AssignPurchaseOrderReturnOrderCommandHandler> logger,
        IPurchaseOrderService service,
        IUnitOfWork uow
    ) : ICommandHandler<AssignPurchaseOrderReturnOrderCommand, Unit>
{
    private readonly IPurchaseOrderRepository _repository = repository;
    private readonly ILogger<AssignPurchaseOrderReturnOrderCommandHandler> _logger = logger;
    private readonly IPurchaseOrderService _service = service;
    private readonly IUnitOfWork _uow = uow;

    public async Task<Result<Unit>> Handle(AssignPurchaseOrderReturnOrderCommand command, CancellationToken ct)
    {
        ResultFailureHelper.AgainstDefaultValue(command.Id);

        Core.Domain.Models.PurchaseOrderEntity.PurchaseOrder? purchaseOrder = await _repository.GetPurchaseOrderByIdAsync(command.Id, ct);

        if (purchaseOrder is null)
        {
            PurchaseOrderLogWarning.LogPurchaseOrderNotFound(_logger, command.Id, default);
            return Result<Unit>.Failure(
                new Error(
                    $"PurchaseOrder {command.Id} not found",
                    ErrorCodes.PurchaseOrderNotFound));
        }

        _service.AssignReturnOrder(purchaseOrder, command.ReturnOrderId);
        await _uow.SaveChangesAsync(ct);

        return Result<Unit>.Success(Unit.Value);
    }
}
