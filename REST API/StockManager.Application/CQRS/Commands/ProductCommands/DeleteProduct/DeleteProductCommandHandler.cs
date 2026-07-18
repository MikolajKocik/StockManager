using MediatR;
using Microsoft.Extensions.Logging;
using StackExchange.Redis;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Logging.Product;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Extensions.Cache;
using StockManager.Application.Helpers.CQRS.NullResult;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Common;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models.ProductEntity;

namespace StockManager.Application.CQRS.Commands.ProductCommands.DeleteProduct;

public class DeleteProductCommandHandler(
        IProductRepository repository,
        ILogger<DeleteProductCommandHandler> logger,
        IConnectionMultiplexer redis,
        IProductService service,
        IUnitOfWork uow
    ) : ICommandHandler<DeleteProductCommand, Unit>
{
    private readonly IProductRepository _repository = repository;
    private readonly ILogger<DeleteProductCommandHandler> _logger = logger;
    private readonly IConnectionMultiplexer _redis = redis;
    private readonly IProductService _service = service;
    private readonly IUnitOfWork _uow = uow;

    public async Task<Result<Unit>> Handle(DeleteProductCommand command, CancellationToken ct)
    {
        ResultFailureHelper.AgainstDefaultValue(command.Id);

        Product product = await _repository.GetProductByIdAsync(command.Id, ct);

        if (product is not null)
        {
            ProductLogInfo.LogRemovingProductOperation(_logger, command.Id, default);

            _service.SetAsDeleted(product);
            await _uow.SaveChangesAsync(ct);

            ProductLogInfo.LogProductDeletedSuccess(_logger, product.Id, default);

            await _redis.RemoveKeyAsync($"product:{product.Id}:details")
               .ConfigureAwait(false);

            await _redis.RemoveKeyAsync($"product:{product.Id}:views")
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
}
