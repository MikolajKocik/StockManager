using AutoMapper;
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
using StockManager.Application.Dtos.ModelsDto.ProductDtos;
using StockManager.Application.Extensions.Redis;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.ProductEntity;

namespace StockManager.Application.CQRS.Commands.ProductCommands.DeleteProduct;

public class DeleteProductCommandHandler : ICommandHandler<DeleteProductCommand, ProductDto>
{
    private readonly IMapper _mapper;
    private readonly IProductRepository _repository;
    private readonly ILogger<DeleteProductCommandHandler> _logger;
    private readonly IConnectionMultiplexer _redis;
    private readonly IEventBus _eventBus;


    public DeleteProductCommandHandler(
        IMapper mapper,
        IProductRepository repository,
        ILogger<DeleteProductCommandHandler> logger,
        IConnectionMultiplexer redis,
        IEventBus eventBus)
    {
        _mapper = mapper;
        _repository = repository;
        _logger = logger;
        _redis = redis;
        _eventBus = eventBus;
    }

    public async Task<Result<ProductDto>> Handle(DeleteProductCommand command, CancellationToken cancellationToken)
    {
        try
        {
            await using IDbContextTransaction transaction = await _repository.BeginTransactionAsync();

            Product product = await _repository.GetProductByIdAsync(command.Id, cancellationToken);

            if (product is not null)
            {
                ProductLogInfo.LogRemovingProductOperation(_logger, command.Id, default);
                Product remove = await _repository.DeleteProductAsync(product, cancellationToken);

                ProductDto dto = _mapper.Map<ProductDto>(remove);         

                await transaction.CommitAsync(cancellationToken);

                await _redis.RemoveKeyAsync(
                   $"product:{product.Id}:details")
                   .ConfigureAwait(false);

                await _redis.RemoveKeyAsync(
                    $"product:{product.Id}:views")
                    .ConfigureAwait(false);

                await _eventBus.PublishAsync(new ProductDeletedIntegrationEvent(
                    command.Id)
                    ).ConfigureAwait(false);

                return Result<ProductDto>.Success(dto);
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
