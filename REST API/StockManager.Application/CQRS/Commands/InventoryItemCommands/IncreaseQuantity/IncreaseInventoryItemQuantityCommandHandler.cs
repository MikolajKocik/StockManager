using AutoMapper;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Logging.InventoryItem;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.InventoryItemDtos;
using StockManager.Application.Helpers.CQRS.NullResult;
using StockManager.Core.Domain.Interfaces.Common;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models.InventoryItemEntity;

namespace StockManager.Application.CQRS.Commands.InventoryItemCommands.IncreaseQuantity;

public sealed class IncreaseInventoryItemQuantityCommandHandler(
    IInventoryItemRepository repository,
    IInventoryItemService service,
    IMapper mapper,
    ILogger<IncreaseInventoryItemQuantityCommandHandler> logger,
    IUnitOfWork uow
    ) : ICommandHandler<IncreaseInventoryItemQuantityCommand, InventoryItemDto>
{
    private readonly IInventoryItemRepository _repository = repository;
    private readonly IInventoryItemService _service = service;
    private readonly IMapper _mapper = mapper;
    private readonly ILogger<IncreaseInventoryItemQuantityCommandHandler> _logger = logger;
    private readonly IUnitOfWork _uow = uow;

    public async Task<Result<InventoryItemDto>> Handle(IncreaseInventoryItemQuantityCommand command, CancellationToken cancellationToken)
    {
        ResultFailureHelper.AgainstDefaultValue(command.Id);

        InventoryItem? inventoryItem = await _repository.GetInventoryItemByIdAsync(command.Id, cancellationToken);

        if (inventoryItem is null)
        {
            InventoryItemLogWarning.LogInventoryItemNotFound(_logger, command.Id, default);
            return Result<InventoryItemDto>.Failure(
                new Error(
                    "Inventory item not found",
                    "InventoryItem.NotFound"));
        }

        _service.IncreaseQuantity(inventoryItem, command.Amount);
        await _uow.SaveChangesAsync(cancellationToken);

        InventoryItemDto dto = _mapper.Map<InventoryItemDto>(inventoryItem);

        InventoryItemLogInfo.LogInventoryItemQuantityIncreased(_logger, command.Id, command.Amount, default);
        return Result<InventoryItemDto>.Success(dto);
    }
}
