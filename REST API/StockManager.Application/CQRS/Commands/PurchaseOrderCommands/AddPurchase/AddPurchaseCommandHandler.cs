using AutoMapper;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Logging.PurchaseOrder;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.CQRS.Commands.PurchaseOrder.AddPurchase;
using StockManager.Application.Dtos.ModelsDto.PurchaseOrderDtos;
using StockManager.Application.Helpers.CQRS.NullResult;
using StockManager.Core.Domain.Interfaces.Common;
using StockManager.Core.Domain.Interfaces.Repositories;

namespace StockManager.Application.CQRS.Commands.PurchaseOrderCommands.AddPurchase;

public sealed class AddPurchaseOrderCommandHandler(
        IPurchaseOrderRepository repository,
        IMapper mapper,
        ILogger<AddPurchaseOrderCommandHandler> logger,
        IUnitOfWork uow
    ) : ICommandHandler<AddPurchaseOrderCommand, PurchaseOrderDto>
{
    private readonly IPurchaseOrderRepository _repository = repository;
    private readonly IMapper _mapper = mapper;
    private readonly ILogger<AddPurchaseOrderCommandHandler> _logger = logger;
    private readonly IUnitOfWork _uow = uow;

    public async Task<Result<PurchaseOrderDto>> Handle(AddPurchaseOrderCommand command, CancellationToken ct)
    {
        ResultFailureHelper.IfProvidedNullArgument(command.CreateDto);

        Core.Domain.Models.PurchaseOrderEntity.PurchaseOrder purchaseOrder =
            _mapper.Map<Core.Domain.Models.PurchaseOrderEntity.PurchaseOrder>(command.CreateDto);

        _repository.AddPurchaseOrder(purchaseOrder);
        await _uow.SaveChangesAsync(ct);

        PurchaseOrderDto dto = _mapper.Map<PurchaseOrderDto>(purchaseOrder);
        PurchaseOrderLogInfo.LogPurchaseOrderCreated(_logger, dto.Id, null);
        return Result<PurchaseOrderDto>.Success(dto);
    }
}
