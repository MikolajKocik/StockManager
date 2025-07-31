using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.Extensions.Logging;
using StockManager.Application.Common.Logging.InventoryItem;
using StockManager.Application.Common.ResultPattern;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Application.Dtos.ModelsDto.InventoryItemDtos;
using MediatR;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Core.Domain.Models.InventoryItemEntity;

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

    public async Task<Result<InventoryItemDto>> Handle(ReleaseInventoryItemQuantityCommand request, CancellationToken cancellationToken)
    {
        InventoryItem? inventoryItem = await _repository.GetInventoryItemByIdAsync(request.Id, cancellationToken);
        if (inventoryItem is null)
        {
            InventoryItemLogWarning.LogInventoryItemNotFound(_logger, request.Id, default);
            return Result<InventoryItemDto>.Failure(
                new Error(
                    "Inventory item not found",
                    "InventoryItem.NotFound"));
        }

        _service.ReleaseQuantity(inventoryItem, request.Amount);
        await _repository.UpdateInventoryItemAsync(inventoryItem, cancellationToken);

        InventoryItemLogInfo.LogInventoryItemQuantityReleased(_logger, request.Id, request.Amount, default);

        InventoryItemDto dto = _mapper.Map<InventoryItemDto>(inventoryItem);
        return Result<InventoryItemDto>.Success(dto);
    }
}
