using MediatR;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Dtos.ModelsDto.ProductDtos;

namespace StockManager.Application.CQRS.Commands.ProductCommands.AddProduct;

public sealed record AddProductCommand(
    ProductCreateDto Product)
    : ICommand<ProductDto>;

