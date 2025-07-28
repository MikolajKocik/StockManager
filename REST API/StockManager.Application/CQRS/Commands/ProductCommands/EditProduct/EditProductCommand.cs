using MediatR;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Dtos.ModelsDto.ProductDtos;

namespace StockManager.Application.CQRS.Commands.ProductCommands.EditProduct;

public sealed record EditProductCommand(
    int Id, 
    ProductUpdateDto Product)
    : ICommand<Unit>;

