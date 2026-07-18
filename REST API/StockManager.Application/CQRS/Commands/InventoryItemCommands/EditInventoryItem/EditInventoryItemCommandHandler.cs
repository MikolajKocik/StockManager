using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using StackExchange.Redis;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Logging.InventoryItem;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.InventoryItemDtos;
using StockManager.Application.Extensions.Cache;
using StockManager.Application.Helpers.CQRS.NullResult;
using StockManager.Core.Domain.Interfaces.Common;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.InventoryItemEntity;

namespace StockManager.Application.CQRS.Commands.InventoryItemCommands.EditInventoryItem;

public sealed class EditInventoryItemCommandHandler(
        IInventoryItemRepository inventoryItemRepository,
        IMapper mapper,
        ILogger<EditInventoryItemCommandHandler> logger,
        IConnectionMultiplexer redis,
        IUnitOfWork uow
) : ICommandHandler<EditInventoryItemCommand, Unit>
{
    private readonly IInventoryItemRepository _inventoryItemRepository = inventoryItemRepository;
    private readonly IMapper _mapper = mapper;
    private readonly ILogger<EditInventoryItemCommandHandler> _logger = logger;
    private readonly IConnectionMultiplexer _redis = redis;
    private readonly IUnitOfWork _uow = uow;

    public async Task<Result<Unit>> Handle(EditInventoryItemCommand command, CancellationToken ct)
    {
        ResultFailureHelper.AgainstDefaultValue(command.Id);

        InventoryItemLogInfo.LogModyfingInventoryItem(
            _logger,
            command.Id,
            command.UpdateDto.ProductId,
            command.UpdateDto.BinLocationId,
            default);

        InventoryItem? inventoryItem = await _inventoryItemRepository.GetInventoryItemByIdAsync(command.Id, ct);

        if (inventoryItem is null)
        {
            InventoryItemLogWarning.LogInventoryItemNotFound(_logger, command.Id, default);
            return Result<Unit>.Failure(
                new Error(
                    "Inventory item not found",
                    "InventoryItem.NotFound"));
        }

        await _uow.SaveChangesAsync(ct);
        await _redis.RemoveKeyAsync($"inventory-item:{command.Id}:details");
        
        InventoryItemDto dto =  _mapper.Map<InventoryItemDto>(inventoryItem);

        InventoryItemLogInfo.LogInventoryItemModifiedSuccess(_logger, dto.Id, default);

        return Result<Unit>.Success(Unit.Value);
    }
}
