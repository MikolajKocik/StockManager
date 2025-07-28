using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Logging;
using StackExchange.Redis;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Events;
using StockManager.Application.Common.Events.Product;
using StockManager.Application.Common.Logging.General;
using StockManager.Application.Common.Logging.InventoryItem;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Extensions.Redis;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.InventoryItemEntity;
using StockManager.Core.Domain.Models.ProductEntity;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace StockManager.Application.CQRS.Commands.InventoryItemCommands.DeleteInventoryItem;

public sealed class DeleteInventoryItemCommandHandler : ICommandHandler<DeleteInventoryItemCommand, Unit>
{
    private readonly IInventoryItemRepository _repository;
    private readonly ILogger<DeleteInventoryItemCommandHandler> _logger;
    private readonly IConnectionMultiplexer _redis;
    private readonly IEventBus _eventBus;

    public DeleteInventoryItemCommandHandler(
        IInventoryItemRepository repository,
        ILogger<DeleteInventoryItemCommandHandler> logger,
        IConnectionMultiplexer redis,
        IEventBus eventBus
        )
    {
        _repository = repository;
        _logger = logger;
        _redis = redis;
        _eventBus = eventBus;
    }

    public async Task<Result<Unit>> Handle(DeleteInventoryItemCommand command, CancellationToken cancellationToken)
    {
        try
        {
            await using IDbContextTransaction transaction = await _repository.BeginTransactionAsync(cancellationToken);

            InventoryItem? inventoryItem = await _repository.GetInventoryItemByIdAsync(command.Id, cancellationToken);

            if (inventoryItem is null)
            {
                InventoryItemLogWarning.LogInventoryItemNotFound(_logger, command.Id, default);
                return Result<Unit>.Failure(
                    new Error(
                        "Inventory item not found", 
                        "InventoryItem.NotFound"));
            }

            await _repository.DeleteInventoryItemAsync(inventoryItem, cancellationToken);

            await transaction.CommitAsync(cancellationToken);

            await _redis.RemoveKeyAsync(
                 $"inventory-item:{command.Id}:details")
                 .ConfigureAwait(false);

            await _redis.RemoveKeyAsync(
                $"inventory-item:{command.Id}:views")
                .ConfigureAwait(false);

            await _eventBus.PublishAsync(
                new ProductDeletedIntegrationEvent(
                command.Id)
                ).ConfigureAwait(false);

            InventoryItemLogInfo.LogInventoryItemDeletedSuccess(_logger, command.Id, default);
            return Result<Unit>.Success(Unit.Value);
        }
        catch (Exception ex)
        {
            GeneralLogError.UnhandledException(_logger, ex.Message, ex);
            throw;
        }
    }
}
