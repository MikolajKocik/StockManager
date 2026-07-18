using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Logging.PurchaseOrder;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.CQRS.Commands.PurchaseOrder.EditPurchase;
using StockManager.Application.Helpers.CQRS.NullResult;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Common;
using StockManager.Core.Domain.Interfaces.Repositories;

namespace StockManager.Application.CQRS.Commands.PurchaseOrderCommands.EditPurchase;

public sealed class EditPurchaseOrderCommandHandler(
        IPurchaseOrderRepository repository,
        IMapper mapper,
        ILogger<EditPurchaseOrderCommandHandler> logger,
        IUnitOfWork uow
    ) : ICommandHandler<EditPurchaseOrderCommand, Unit>
{
    private readonly IPurchaseOrderRepository _repository = repository;
    private readonly IMapper _mapper = mapper;
    private readonly ILogger<EditPurchaseOrderCommandHandler> _logger = logger;
    private readonly IUnitOfWork _uow = uow;

    public async Task<Result<Unit>> Handle(EditPurchaseOrderCommand command, CancellationToken ct)
    {
        ResultFailureHelper.AgainstDefaultValue(command.Id);

        Core.Domain.Models.PurchaseOrderEntity.PurchaseOrder? purchaseOrder = await _repository.GetPurchaseOrderByIdAsync(command.Id, ct);

        if (purchaseOrder is null)
        {
            PurchaseOrderLogWarning.LogPurchaseOrderNotFound(_logger, command.Id, default);
            return Result<Unit>.Failure(new Error(
                $"PurchaseOrder {command.Id} not found",
                ErrorCodes.PurchaseOrderNotFound));
        }

        _mapper.Map(command.UpdateDto, purchaseOrder);
        await _uow.SaveChangesAsync(ct);

        return Result<Unit>.Success(Unit.Value);
    }
}
