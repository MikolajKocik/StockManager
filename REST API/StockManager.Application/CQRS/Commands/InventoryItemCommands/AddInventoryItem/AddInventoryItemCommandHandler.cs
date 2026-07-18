using AutoMapper;
using Microsoft.Extensions.Logging;
using StackExchange.Redis;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Logging.InventoryItem;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.InventoryItemDtos;
using StockManager.Application.Extensions.Cache;
using StockManager.Application.Helpers.CQRS.NullResult;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Common;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.BinLocationEntity;
using StockManager.Core.Domain.Models.InventoryItemEntity;
using StockManager.Core.Domain.Models.ProductEntity;

namespace StockManager.Application.CQRS.Commands.InventoryItemCommands.AddInventoryItem;
public sealed class AddInventoryItemCommandHandler(
        IMapper mapper,
        IInventoryItemRepository inventoryItemRepository,
        ILogger<AddInventoryItemCommandHandler> logger,
        IConnectionMultiplexer redis,
        IUnitOfWork uow,
        IProductRepository productRepository
    ) : ICommandHandler<AddInventoryItemCommand, InventoryItemDto>
{
    private readonly IMapper _mapper = mapper;
    private readonly IInventoryItemRepository _inventoryItemRepository = inventoryItemRepository;
    private readonly IProductRepository _productRepository = productRepository;
    private readonly ILogger<AddInventoryItemCommandHandler> _logger = logger;
    private readonly IConnectionMultiplexer _redis = redis;
    private readonly IUnitOfWork _uow = uow;

    public async Task<Result<InventoryItemDto>> Handle(AddInventoryItemCommand command, CancellationToken ct)
    {
 
        ResultFailureHelper.AgainstDefaultValue(command.InventoryItem.ProductId);

        // generally product may has multiple inventory items, so we can add new one
        // but we need to check if provided product not null
         Product? product = await _productRepository.GetProductByIdAsync(command.InventoryItem.ProductId, ct);

        if (product is null)
        {
            InventoryItemLogWarning.LogInventoryProductNotFound(_logger, command.InventoryItem.ProductId, default);
            return Result<InventoryItemDto>.Failure(
                new Error("Product not found",
                ErrorCodes.ProductNotFound));
        }

        BinLocation binLocation = await _inventoryItemRepository.GetBinLocationByIdAsync(command.InventoryItem.BinLocationId, ct);

        if (binLocation is null)
        {
            InventoryItemLogWarning.LogInventoryBinLocationNotFound(_logger, command.InventoryItem.BinLocationId, default);
            return Result<InventoryItemDto>.Failure(
                new Error("Bin location not found",
                ErrorCodes.InventoryBinLocationNotFound));
        }

        InventoryItem inventoryItemEntity = _mapper.Map<InventoryItem>(command.InventoryItem);

        _inventoryItemRepository.AddInventoryItem(inventoryItemEntity);
        await _uow.SaveChangesAsync(ct);

        InventoryItemDto inventoryItemDto = _mapper.Map<InventoryItemDto>(inventoryItemEntity);

        InventoryItemLogInfo.LogAddInventoryItemSuccesfull(_logger, inventoryItemDto.Id, inventoryItemDto.ProductId, inventoryItemDto.Warehouse, default);

        string key = $"inventory-item:{inventoryItemDto.Id}:views";

        await _redis.IncrementKeyAsync(
            key,
            TimeSpan.FromHours(24),
            ct);

        return Result<InventoryItemDto>.Success(inventoryItemDto);
    }
}
