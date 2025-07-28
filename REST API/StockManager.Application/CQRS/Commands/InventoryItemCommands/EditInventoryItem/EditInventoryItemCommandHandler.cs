using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using FluentValidation;
using FluentValidation.Results;
using MediatR;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Logging;
using StackExchange.Redis;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Events;
using StockManager.Application.Common.Events.InventoryItem;
using StockManager.Application.Common.Logging.General;
using StockManager.Application.Common.Logging.InventoryItem;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.InventoryItemDtos;
using StockManager.Application.Extensions.Redis;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.InventoryItemEntity;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace StockManager.Application.CQRS.Commands.InventoryItemCommands.EditInventoryItem;

public sealed class EditInventoryItemCommandHandler : ICommandHandler<EditInventoryItemCommand, Unit>
{
    private readonly IInventoryItemRepository _inventoryItemRepository;
    private readonly IMapper _mapper;
    private readonly IValidator<InventoryItemUpdateDto> _validator;
    private readonly ILogger<EditInventoryItemCommandHandler> _logger;
    private readonly IEventBus _eventBus;
    private readonly IConnectionMultiplexer _redis;

    public EditInventoryItemCommandHandler(
        IInventoryItemRepository inventoryItemRepository,
        IMapper mapper,
        IValidator<InventoryItemUpdateDto> validator,
        ILogger<EditInventoryItemCommandHandler> logger,
        IEventBus eventBus,
        IConnectionMultiplexer redis
        )
    {
        _inventoryItemRepository = inventoryItemRepository;
        _mapper = mapper;
        _validator = validator;
        _logger = logger;
        _eventBus = eventBus;
        _redis = redis;
    }

    public async Task<Result<Unit>> Handle(EditInventoryItemCommand command, CancellationToken cancellationToken)
    {
        ValidationResult validationResult = await _validator.ValidateAsync(command.UpdateDto, cancellationToken);
        if (!validationResult.IsValid)
        {
            InventoryItemLogWarning.LogInventoryItemUpdateValidationFailed(_logger, command.UpdateDto, default);
           
            return Result<Unit>.Failure(
                new Error(
                    string.Join(", ", validationResult.Errors.Select(e => e.ErrorMessage)),
                    "InventoryItem.Validation"));
        }

        try
        {
            await using IDbContextTransaction transaction = await _inventoryItemRepository.BeginTransactionAsync(cancellationToken);

            InventoryItemLogInfo.LogModyfingInventoryItem(
                _logger,
                command.Id,
                command.UpdateDto.ProductId,
                command.UpdateDto.BinLocationId,
                default);

            InventoryItem? inventoryItem = await _inventoryItemRepository.GetInventoryItemByIdAsync(command.Id, cancellationToken);

            if (inventoryItem is null)
            {
                InventoryItemLogWarning.LogInventoryItemNotFound(_logger, command.Id, default);
                return Result<Unit>.Failure(
                    new Error(
                        "Inventory item not found", 
                        "InventoryItem.NotFound"));
            }

            await _inventoryItemRepository.UpdateInventoryItemAsync(inventoryItem, cancellationToken);

            await transaction.CommitAsync(cancellationToken);

            InventoryItemDto dto =  _mapper.Map<InventoryItemDto>(inventoryItem);

            InventoryItemLogInfo.LogInventoryItemModifiedSuccess(_logger, dto.Id, default);

            await _redis.RemoveKeyAsync(
                $"inventory-item:{command.Id}:details")
                .ConfigureAwait(false);

            await _eventBus.PublishAsync(
                new InventoryItemAddedIntegrationEvent(
                    dto.Id,
                    dto.ProductId,
                    dto.ProductName,
                    dto.BinLocationId,
                    cancellationToken
                )).ConfigureAwait(false);

            return Result<Unit>.Success(Unit.Value);
        }
        catch (Exception ex)
        {
            GeneralLogError.UnhandledException(_logger, ex.Message, ex);
            throw;
        }
    }
}
