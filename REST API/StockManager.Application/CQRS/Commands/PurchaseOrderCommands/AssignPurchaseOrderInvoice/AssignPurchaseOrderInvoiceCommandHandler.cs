using MediatR;
using Microsoft.Extensions.Logging;
using StockManager.Application.Common.Logging.PurchaseOrder;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.CQRS.Commands.PurchaseOrder.AssignPurchaseOrderInvoice;
using StockManager.Application.Helpers.CQRS.NullResult;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Common;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Interfaces.Services;

namespace StockManager.Application.CQRS.Commands.PurchaseOrderCommands.AssignPurchaseOrderInvoice;

public sealed class AssignPurchaseOrderInvoiceCommandHandler(
        IPurchaseOrderRepository repository,
        ILogger<AssignPurchaseOrderInvoiceCommandHandler> logger,
        IPurchaseOrderService service,
        IUnitOfWork uow
    ) : IRequestHandler<AssignPurchaseOrderInvoiceCommand, Result<Unit>>
{
    private readonly IPurchaseOrderRepository _repository = repository;
    private readonly ILogger<AssignPurchaseOrderInvoiceCommandHandler> _logger = logger;
    private readonly IPurchaseOrderService _service = service;
    private readonly IUnitOfWork _uow = uow;

    public async Task<Result<Unit>> Handle(AssignPurchaseOrderInvoiceCommand command, CancellationToken ct)
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

        _service.AssignInvoice(purchaseOrder, command.InvoiceId);
        await _uow.SaveChangesAsync(ct);

        return Result<Unit>.Success(Unit.Value);
    }
}
