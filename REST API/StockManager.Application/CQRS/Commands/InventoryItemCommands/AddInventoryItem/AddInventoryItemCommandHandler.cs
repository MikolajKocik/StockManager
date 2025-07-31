using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;
using AutoMapper;
using FluentValidation;
using FluentValidation.Results;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Logging;
using StackExchange.Redis;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Events;
using StockManager.Application.Common.Events.InventoryItem;
using StockManager.Application.Common.Events.Product;
using StockManager.Application.Common.Logging.General;
using StockManager.Application.Common.Logging.InventoryItem;
using StockManager.Application.Common.Logging.Product;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.CQRS.Commands.ProductCommands.AddProduct;
using StockManager.Application.Dtos.ModelsDto.InventoryItemDtos;
using StockManager.Application.Dtos.ModelsDto.ProductDtos;
using StockManager.Application.Extensions.Redis;
using StockManager.Application.Helpers.Error;
using StockManager.Application.Validations.InventoryItemValidation;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models.BinLocationEntity;
using StockManager.Core.Domain.Models.InventoryItemEntity;
using StockManager.Core.Domain.Models.ProductEntity;
using StockManager.Core.Domain.Models.SupplierEntity;

namespace StockManager.Application.CQRS.Commands.InventoryItemCommands.AddInventoryItem;
public sealed class AddInventoryItemCommandHandler : ICommandHandler<AddInventoryItemCommand, InventoryItemDto>
{
    private readonly IMapper _mapper;
    private readonly IInventoryItemRepository _inventoryItemRepository;
    private readonly IProductRepository _productRepository;
    private readonly ILogger<AddInventoryItemCommandHandler> _logger;
    private readonly IEventBus _eventBus;
    private readonly IConnectionMultiplexer _redis;

    public AddInventoryItemCommandHandler(
        IMapper mapper,
        IInventoryItemRepository inventoryItemRepository,
        ILogger<AddInventoryItemCommandHandler> logger,
        IEventBus eventBus,
        IConnectionMultiplexer redis,
        IProductRepository productRepository
        )
    {
        _eventBus = eventBus;
        _mapper = mapper;
        _inventoryItemRepository = inventoryItemRepository;
        _logger = logger;
        _redis = redis;
        _productRepository = productRepository;
    }
    public async Task<Result<InventoryItemDto>> Handle(AddInventoryItemCommand command, CancellationToken cancellationToken)
    {
        try
        {
            // generally product may has multiple inventory items, so we can add new one
            // but we need to check if provided product not null
            Product? product = await _productRepository.GetProductByIdAsync(command.InventoryItem.ProductId, cancellationToken);

            if (product is null)
            {
                InventoryItemLogWarning.LogInventoryProductNotFound(_logger, command.InventoryItem.ProductId, default);
                return Result<InventoryItemDto>.Failure(
                    new Error("Product not found",
                    ErrorCodes.ProductNotFound));
            }

            BinLocation binLocation = await _inventoryItemRepository.GetBinLocationByIdAsync(command.InventoryItem.BinLocationId, cancellationToken);

            if (binLocation is null)
            {
                InventoryItemLogWarning.LogInventoryBinLocationNotFound(_logger, command.InventoryItem.BinLocationId, default);
                return Result<InventoryItemDto>.Failure(
                    new Error("Bin location not found",
                    ErrorCodes.InventoryBinLocationNotFound));
            }

            InventoryItem inventoryItemEntity = _mapper.Map<InventoryItem>(command.InventoryItem);

            InventoryItem addedInventoryItem = await _inventoryItemRepository.AddInventoryItemAsync(inventoryItemEntity, cancellationToken);

            InventoryItemDto inventoryItemDto = _mapper.Map<InventoryItemDto>(addedInventoryItem);

            InventoryItemLogInfo.LogAddInventoryItemSuccesfull(_logger, inventoryItemDto.Id, inventoryItemDto.ProductId, inventoryItemDto.Warehouse, default);

            string key = $"inventory-item:{inventoryItemDto.Id}:views";

            await _redis.IncrementKeyAsync(
               key,
               TimeSpan.FromHours(24),
               cancellationToken)
               .ConfigureAwait(false);

            await _eventBus.PublishAsync(new InventoryItemAddedIntegrationEvent(
               inventoryItemDto.Id, 
               inventoryItemDto.ProductId,
               inventoryItemDto.ProductName, 
               inventoryItemDto.BinLocationId)
                ).ConfigureAwait(false);

            return Result<InventoryItemDto>.Success(inventoryItemDto);
        }
        catch (Exception ex)
        {
            GeneralLogError.UnhandledException(_logger, ex.Message, ex);
            throw;
        }
    }
}
