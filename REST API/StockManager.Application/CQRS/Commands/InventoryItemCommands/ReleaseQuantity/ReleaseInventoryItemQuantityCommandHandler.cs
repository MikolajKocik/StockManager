using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Logging.InventoryItem;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.InventoryItemDtos;
using StockManager.Application.Helpers.CQRS.NullResult;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models.InventoryItemEntity;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace StockManager.Application.CQRS.Commands.InventoryItemCommands.ReleaseQuantity;

public sealed class ReleaseInventoryItemQuantityCommandHandler : ICommandHandler<ReleaseInventoryItemQuantityCommand, InventoryItemDto>
{
    private readonly IInventoryItemRepository _repository;
    private readonly IInventoryItemService _service;
    private readonly IMapper _mapper;
    private readonly ILogger<ReleaseInventoryItemQuantityCommandHandler> _logger;

    public ReleaseInventoryItemQuantityCommandHandler(
        IInventoryItemRepository repository,
        IInventoryItemService service,
        IMapper mapper,
        ILogger<ReleaseInventoryItemQuantityCommandHandler> logger)
    {
        _repository = repository;
        _service = service;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<Result<InventoryItemDto>> Handle(ReleaseInventoryItemQuantityCommand command, CancellationToken cancellationToken)
    {
        ResultFailureHelper.IfProvidedNullArgument(command.Id);

        InventoryItem? inventoryItem = await _repository.GetInventoryItemByIdAsync(command.Id, cancellationToken);
        if (inventoryItem is null)
        {
            InventoryItemLogWarning.LogInventoryItemNotFound(_logger, command.Id, default);
            return Result<InventoryItemDto>.Failure(
                new Error(
                    "Inventory item not found",
                    "InventoryItem.NotFound"));
        }

        _service.ReleaseQuantity(inventoryItem, command.Amount);
        await _repository.UpdateInventoryItemAsync(inventoryItem, cancellationToken);

        InventoryItemLogInfo.LogInventoryItemQuantityReleased(_logger, command.Id, command.Amount, default);

        InventoryItemDto dto = _mapper.Map<InventoryItemDto>(inventoryItem);
        return Result<InventoryItemDto>.Success(dto);
    }
}
