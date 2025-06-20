﻿using AutoMapper;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.PipelineBehavior;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.Product;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Models;

namespace StockManager.Application.CQRS.Commands.ProductCommands.DeleteProduct;

public class DeleteProductCommandHandler : ICommandHandler<DeleteProductCommand, ProductDto>
{
    private readonly IMapper _mapper;
    private readonly IProductRepository _repository;
    private readonly ILogger<DeleteProductCommandHandler> _logger;

    public DeleteProductCommandHandler(IMapper mapper, IProductRepository repository,
        ILogger<DeleteProductCommandHandler> logger)
    {
        _mapper = mapper;
        _repository = repository;
        _logger = logger;
    }

    public async Task<Result<ProductDto>> Handle(DeleteProductCommand command, CancellationToken cancellationToken)
    {
        try
        {
            await using IDbContextTransaction transaction = await _repository.BeginTransactionAsync();

            Product product = await _repository.GetProductByIdAsync(command.Id, cancellationToken);

            if (product is not null)
            {
                TrackingBehaviorLogMessages.LogRemovingProductOperation(_logger, command.Id, default);
                Product remove = await _repository.DeleteProductAsync(product, cancellationToken);

                ProductDto dto = _mapper.Map<ProductDto>(remove);

                await transaction.CommitAsync(cancellationToken);

                return Result<ProductDto>.Success(dto);
            }
            else
            {
                TrackingBehaviorLogMessages.LogProductNotFound(_logger, command.Id, default);
                await transaction.RollbackAsync(cancellationToken);

                var error = new Error(
                    $"Product with id {command.Id} not found",
                    ErrorCodes.ProductNotFound
                );

                return Result<ProductDto>.Failure(error);
            }
        }
        catch (Exception ex)
        {
            TrackingBehaviorLogMessages.LogRemovingProductException(_logger, ex);
            throw;
        }
    }
}
