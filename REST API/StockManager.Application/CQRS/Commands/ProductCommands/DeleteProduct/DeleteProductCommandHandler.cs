using AutoMapper;
using FluentValidation;
using FluentValidation.Results;
using MediatR;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Logging;
using StackExchange.Redis;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Logging.General;
using StockManager.Application.Common.Logging.Product;
using StockManager.Application.Common.PipelineBehavior;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.ProductDtos;
using StockManager.Application.Extensions.Redis;
using StockManager.Application.Helpers.CQRS.NullResult;
using StockManager.Application.Helpers.Error;
using StockManager.Application.Validations.ProductValidation;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models.ProductEntity;

namespace StockManager.Application.CQRS.Commands.ProductCommands.DeleteProduct;

public class DeleteProductCommandHandler : ICommandHandler<DeleteProductCommand, Unit>
{
    private readonly IProductRepository _repository;
    private readonly ILogger<DeleteProductCommandHandler> _logger;
    private readonly IConnectionMultiplexer _redis;
    private readonly IProductService _service;

    public DeleteProductCommandHandler(
        IProductRepository repository,
        ILogger<DeleteProductCommandHandler> logger,
        IConnectionMultiplexer redis,
        IProductService service
        )
    {
        _repository = repository;
        _logger = logger;
        _redis = redis;
        _service = service;
    }

    public async Task<Result<Unit>> Handle(DeleteProductCommand command, CancellationToken cancellationToken)
    {
        try
        {
            ResultFailureHelper.IfProvidedNullArgument(command.Id);

            Product product = await _repository.GetProductByIdAsync(command.Id, cancellationToken);

            if (product is not null)
            {
                ProductLogInfo.LogRemovingProductOperation(_logger, command.Id, default);

                _service.SetAsDeleted(product);
                ProductLogInfo.LogProductDeletedSuccess(_logger, product.Id, default);

                await _redis.RemoveKeyAsync(
                   $"product:{product.Id}:details")
                   .ConfigureAwait(false);

                await _redis.RemoveKeyAsync(
                    $"product:{product.Id}:views")
                    .ConfigureAwait(false);

                return Result<Unit>.Success(Unit.Value);
            }
            else
            {
                ProductLogWarning.LogProductNotFound(_logger, command.Id, default);

                var error = new Error(
                    $"Product with id {command.Id} not found",
                    ErrorCodes.ProductNotFound
                );

                return Result<Unit>.Failure(error);
            }
        }
        catch (Exception ex)
        {
            GeneralLogError.UnhandledException(_logger, ex.Message, ex);
            throw;
        }
    }
}
