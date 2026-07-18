using MediatR;
using Microsoft.Extensions.Logging;
using StackExchange.Redis;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Logging.InventoryItem;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Extensions.Cache;
using StockManager.Application.Helpers.CQRS.NullResult;
using StockManager.Core.Domain.Interfaces.Common;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.InventoryItemEntity;

namespace StockManager.Application.CQRS.Commands.InventoryItemCommands.DeleteInventoryItem;

public sealed class DeleteInventoryItemCommandHandler(
        IInventoryItemRepository repository,
        ILogger<DeleteInventoryItemCommandHandler> logger,
        IConnectionMultiplexer redis,
        IUnitOfWork uow
    ) : ICommandHandler<DeleteInventoryItemCommand, Unit>
{
    private readonly IInventoryItemRepository _repository = repository;
    private readonly ILogger<DeleteInventoryItemCommandHandler> _logger = logger;
    private readonly IConnectionMultiplexer _redis = redis;
    private readonly IUnitOfWork _uow = uow;

    public async Task<Result<Unit>> Handle(DeleteInventoryItemCommand command, CancellationToken ct)
    {   
        ResultFailureHelper.AgainstDefaultValue(command.Id);

        InventoryItem? inventoryItem = await _repository.GetInventoryItemByIdAsync(command.Id, ct);

        if (inventoryItem is null)
        {
            InventoryItemLogWarning.LogInventoryItemNotFound(_logger, command.Id, default);
            return Result<Unit>.Failure(
                new Error(
                    "Inventory item not found", 
                    "InventoryItem.NotFound"));
        }

        await _repository.DeleteInventoryItemAsync(inventoryItem.Id, ct);

        await _redis.RemoveKeyAsync(
                 $"inventory-item:{command.Id}:details");

        await _redis.RemoveKeyAsync(
            $"inventory-item:{command.Id}:views");

        await _uow.SaveChangesAsync(ct);

        InventoryItemLogInfo.LogInventoryItemDeletedSuccess(_logger, command.Id, default);
        return Result<Unit>.Success(Unit.Value);
    }
}
