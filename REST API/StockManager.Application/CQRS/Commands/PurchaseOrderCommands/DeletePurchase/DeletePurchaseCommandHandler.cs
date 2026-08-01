using MediatR;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Logging.PurchaseOrder;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.CQRS.Commands.PurchaseOrder.DeletePurchase;
using StockManager.Application.Helpers.CQRS.NullResult;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Common;
using StockManager.Core.Domain.Interfaces.Repositories;

namespace StockManager.Application.CQRS.Commands.PurchaseOrderCommands.DeletePurchase;

public sealed class DeletePurchaseOrderCommandHandler(
        IPurchaseOrderRepository repository,
        ILogger<DeletePurchaseOrderCommandHandler> logger,
        IUnitOfWork uow
    ) : ICommandHandler<DeletePurchaseOrderCommand, Unit>
{
    private readonly IPurchaseOrderRepository _repository = repository;
    private readonly ILogger<DeletePurchaseOrderCommandHandler> _logger = logger;
    private readonly IUnitOfWork _uow = uow;

    public async Task<Result<Unit>> Handle(DeletePurchaseOrderCommand command, CancellationToken ct)
    {
        ResultFailureHelper.AgainstDefaultValue(command.Id);

        Core.Domain.Models.PurchaseOrderEntity.PurchaseOrder? entity = await _repository.GetPurchaseOrderByIdAsync(command.Id, ct);

        if (entity is null)
        {
            PurchaseOrderLogWarning.LogPurchaseOrderNotFound(_logger, command.Id, default);

            return Result<Unit>.Failure(
                new Error(
                    $"PurchaseOrder {command.Id} not found",
                    ErrorCodes.PurchaseOrderNotFound));
        }

        await _repository.DeletePurchaseOrder(entity.Id, ct);
        await _uow.SaveChangesAsync(ct);
        return Result<Unit>.Success(Unit.Value);
    }
}
