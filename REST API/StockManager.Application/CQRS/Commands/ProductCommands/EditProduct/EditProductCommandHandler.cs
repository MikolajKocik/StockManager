﻿using AutoMapper;
using FluentValidation.Results;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Logging;
using StackExchange.Redis;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Events;
using StockManager.Application.Common.Events.Product;
using StockManager.Application.Common.Logging.General;
using StockManager.Application.Common.Logging.Product;
using StockManager.Application.Common.PipelineBehavior;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.Product;
using StockManager.Application.Extensions.Redis;
using StockManager.Application.Helpers.Error;
using StockManager.Application.Validations;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Models;

namespace StockManager.Application.CQRS.Commands.ProductCommands.EditProduct;

public class EditProductCommandHandler : ICommandHandler<EditProductCommand, ProductDto>
{
    private readonly IMapper _mapper;
    private readonly IProductRepository _repository;
    private readonly ILogger<EditProductCommandHandler> _logger;
    private readonly IConnectionMultiplexer _redis;
    private readonly IEventBus _eventBus;


    public EditProductCommandHandler(
        IMapper mapper,
        IProductRepository repository, 
        ILogger<EditProductCommandHandler> logger,
        IConnectionMultiplexer redis,
        IEventBus eventBus)
    {
        _mapper = mapper;
        _repository = repository;
        _logger = logger;
        _redis = redis;
        _eventBus = eventBus;
    }

    public async Task<Result<ProductDto>> Handle(EditProductCommand command, CancellationToken cancellationToken)
    {
        try
        {
            await using IDbContextTransaction transaction = await _repository.BeginTransactionAsync();

            Product product = await _repository.GetProductByIdAsync(command.Id, cancellationToken);

            if (product is not null)
            {
                ProductLogInfo.LogModyfingProduct(_logger, command.Id, command.Product, default);

                Product updateProduct = await _repository.UpdateProductAsync(product, cancellationToken);

                ProductDto productModified = _mapper.Map<ProductDto>(updateProduct);

                var validate = new ProductValidator();
                ValidationResult validationResult = await validate.ValidateAsync(productModified, cancellationToken);

                if (validationResult.IsValid)
                {                   
                    await transaction.CommitAsync(cancellationToken);

                    await _redis.RemoveKeyAsync(
                        $"product:{command.Id}:details")
                        .ConfigureAwait(false);

                    await _eventBus.PublishAsync(new ProductUpdatedIntegrationEvent(
                        command.Id, command.Product.Name, command.Product.SupplierId))
                        .ConfigureAwait(false);

                    return Result<ProductDto>.Success(productModified);
                }
                else
                {
                    ProductLogWarning.LogProductValidationFailedExtended(
                        _logger,
                        product,
                        string.Join(", ", validationResult.Errors.Select(e => e.ErrorMessage)), default);

                    var error = new Error(
                        string.Join(", ", validationResult.Errors.Select(e => e.ErrorMessage)),
                        ErrorCodes.ProductValidation
                    );

                    return Result<ProductDto>.Failure(error);
                }
            }
            else
            {
                ProductLogWarning.LogProductNotFound(_logger, command.Id, default);
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
            GeneralLogError.UnhandledException(_logger, ex.Message, ex);
            throw;
        }
    }
}
