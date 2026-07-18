using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using StackExchange.Redis;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Logging.Product;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.ProductDtos;
using StockManager.Application.Extensions.Cache;
using StockManager.Application.Helpers.CQRS.NullResult;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Common;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.ProductEntity;

namespace StockManager.Application.CQRS.Commands.ProductCommands.EditProduct;

public class EditProductCommandHandler(
        IMapper mapper,
        IProductRepository repository,
        ILogger<EditProductCommandHandler> logger,
        IConnectionMultiplexer redis,
        IUnitOfWork uow
    ) : ICommandHandler<EditProductCommand, Unit>
{
    private readonly IMapper _mapper = mapper;
    private readonly IProductRepository _repository = repository;
    private readonly ILogger<EditProductCommandHandler> _logger = logger;
    private readonly IConnectionMultiplexer _redis = redis;
    private readonly IUnitOfWork _uow = uow;

    public async Task<Result<Unit>> Handle(EditProductCommand command, CancellationToken ct)
    {
        ResultFailureHelper.AgainstDefaultValue(command.Id);

        Product product = await _repository.GetProductByIdAsync(command.Id, ct);

        if (product is not null)
        {
            ProductLogInfo.LogModyfingProduct(_logger, command.Id, command.Product, default);

            _mapper.Map(command.Product, product);
            await _uow.SaveChangesAsync(ct);

            _mapper.Map<ProductDto>(product);

            await _redis.RemoveKeyAsync($"product:{command.Id}:details");

            return Result<Unit>.Success(Unit.Value);
        }

        ProductLogWarning.LogProductNotFound(_logger, command.Id, default);

        var error = new Error(
            $"Product with id {command.Id} not found",
            ErrorCodes.ProductNotFound
        );

        return Result<Unit>.Failure(error);
    }
}
