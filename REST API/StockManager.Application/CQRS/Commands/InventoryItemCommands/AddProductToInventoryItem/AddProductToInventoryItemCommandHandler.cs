using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Logging.InventoryItem;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.ProductDtos;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models.InventoryItemEntity;
using StockManager.Core.Domain.Models.ProductEntity;

namespace StockManager.Application.CQRS.Commands.InventoryItemCommands.AddProductToInventoryItem;

public sealed class AddProductToInventoryItemCommandHandler : ICommandHandler<AddProductToInventoryItemCommand, ProductDto>
{
    private readonly IInventoryItemRepository _inventoryItemRepository;
    private readonly IProductRepository _productRepository;
    private readonly IProductService _productService;
    private readonly IMapper _mapper;
    private readonly ILogger<AddProductToInventoryItemCommandHandler> _logger;

    public AddProductToInventoryItemCommandHandler(
        IInventoryItemRepository inventoryItemRepository,
        IProductRepository productRepository,
        IMapper mapper,
        ILogger<AddProductToInventoryItemCommandHandler> logger,
        IProductService productService
        )
    {
        _inventoryItemRepository = inventoryItemRepository;
        _productRepository = productRepository;
        _mapper = mapper;
        _logger = logger;
        _productService = productService;
    }

    public async Task<Result<ProductDto>> Handle(AddProductToInventoryItemCommand command, CancellationToken cancellationToken)
    {
        InventoryItem? inventoryItem = await _inventoryItemRepository.GetInventoryItemByIdAsync(command.InventoryItemId, cancellationToken);
        if (inventoryItem is null)
        {
            InventoryItemLogWarning.LogInventoryItemNotFound(_logger, command.InventoryItemId, default);
            return Result<ProductDto>.Failure(new Error(
                $"Inventory item with id {command.InventoryItemId} not found",
                ErrorCodes.InventoryItemNotFound));
        }

        Product? product = await _productRepository.GetProductByIdAsync(command.Product.Id, cancellationToken);
        if (product is null)
        {
            InventoryItemLogWarning.LogInventoryProductNotFound(_logger, command.Product.Id, default);
            return Result<ProductDto>.Failure(new Error(
                $"Product with id {command.Product.Id} not found",
                ErrorCodes.ProductNotFound));
        }

        _productService.SetProductToInventoryItem(product, inventoryItem);

        await _inventoryItemRepository.UpdateInventoryItemAsync(inventoryItem, cancellationToken);

        InventoryItemLogInfo.LogAddProductToInventoryItemSuccess(_logger, inventoryItem.Id, product.Id, default);

        ProductDto dto = _mapper.Map<ProductDto>(product);

        return Result<ProductDto>.Success(dto);
    }
}
