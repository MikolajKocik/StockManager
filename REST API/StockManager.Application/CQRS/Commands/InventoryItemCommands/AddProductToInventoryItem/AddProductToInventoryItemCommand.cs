using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Dtos.ModelsDto.ProductDtos;

namespace StockManager.Application.CQRS.Commands.InventoryItemCommands.AddProductToInventoryItem;

public sealed record AddProductToInventoryItemCommand(
    int InventoryItemId,
    ProductDto Product)
    : ICommand<ProductDto>;
