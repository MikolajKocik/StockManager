using AutoMapper;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Logging.InventoryItem;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.ProductDtos;
using StockManager.Application.Helpers.CQRS.NullResult;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Common;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models.InventoryItemEntity;
using StockManager.Core.Domain.Models.ProductEntity;

namespace StockManager.Application.CQRS.Commands.InventoryItemCommands.AddProductToInventoryItem;

public sealed class AddProductToInventoryItemCommandHandler(
        IInventoryItemRepository inventoryItemRepository,
        IProductRepository productRepository,
        IMapper mapper,
        ILogger<AddProductToInventoryItemCommandHandler> logger,
        IProductService productService,
        IUnitOfWork uow
    ) : ICommandHandler<AddProductToInventoryItemCommand, ProductDto>
{
    private readonly IInventoryItemRepository _inventoryItemRepository = inventoryItemRepository;
    private readonly IProductRepository _productRepository = productRepository;
    private readonly IProductService _productService = productService;
    private readonly IMapper _mapper = mapper;
    private readonly ILogger<AddProductToInventoryItemCommandHandler> _logger = logger;
    private readonly IUnitOfWork _uow = uow;

    public async Task<Result<ProductDto>> Handle(AddProductToInventoryItemCommand command, CancellationToken ct)
    {
        ResultFailureHelper.AgainstDefaultValue(command.InventoryItemId);

        InventoryItem? inventoryItem = await _inventoryItemRepository.GetInventoryItemByIdAsync(command.InventoryItemId, ct);
        if (inventoryItem is null)
        {
            InventoryItemLogWarning.LogInventoryItemNotFound(_logger, command.InventoryItemId, default);
            return Result<ProductDto>.Failure(new Error(
                $"Inventory item with id {command.InventoryItemId} not found",
                ErrorCodes.InventoryItemNotFound));
        }

        Product? product = await _productRepository.GetProductByIdAsync(command.Product.Id, ct);
        if (product is null)
        {
            InventoryItemLogWarning.LogInventoryProductNotFound(_logger, command.Product.Id, default);
            return Result<ProductDto>.Failure(new Error(
                $"Product with id {command.Product.Id} not found",
                ErrorCodes.ProductNotFound));
        }

        _productService.SetProductToInventoryItem(product, inventoryItem);
        await _uow.SaveChangesAsync(ct);

        InventoryItemLogInfo.LogAddProductToInventoryItemSuccess(_logger, inventoryItem.Id, product.Id, default);

        ProductDto dto = _mapper.Map<ProductDto>(product);

        return Result<ProductDto>.Success(dto);
    }
}
