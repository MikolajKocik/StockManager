using AutoMapper;
using FluentValidation;
using FluentValidation.Results;
using MediatR;
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
using StockManager.Application.Helpers.CQRS.NullResult;
using StockManager.Application.Helpers.Error;
using StockManager.Application.Validations;
using StockManager.Application.Validations.ProductValidation;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models.ProductEntity;

namespace StockManager.Application.CQRS.Commands.ProductCommands.EditProduct;

public class EditProductCommandHandler : ICommandHandler<EditProductCommand, Unit>
{
    private readonly IMapper _mapper;
    private readonly IProductRepository _repository;
    private readonly ILogger<EditProductCommandHandler> _logger;
    private readonly IConnectionMultiplexer _redis;
    private readonly IEventBus _eventBus;
    private readonly IProductService _productService;
    private readonly ISupplierService _supplierService;

    public EditProductCommandHandler(
        IMapper mapper,
        IProductRepository repository,
        ILogger<EditProductCommandHandler> logger,
        IConnectionMultiplexer redis,
        IEventBus eventBus,
        IProductService productService,
        ISupplierService supplierService
        )
    {
        _mapper = mapper;
        _repository = repository;
        _logger = logger;
        _redis = redis;
        _eventBus = eventBus;
        _productService = productService;
        _supplierService = supplierService;
    }

    public async Task<Result<Unit>> Handle(EditProductCommand command, CancellationToken cancellationToken)
    {
        try
        {
            ResultFailureHelper.IfProvidedNullArgument(command.Id);

            Product product = await _repository.GetProductByIdAsync(command.Id, cancellationToken);

            if (product is not null)
            {
                ProductLogInfo.LogModyfingProduct(_logger, command.Id, command.Product, default);

                Product updateProduct = await _repository.UpdateProductAsync(
                    _productService,
                    product,
                    _supplierService,
                    cancellationToken);

                ProductDto productModified = _mapper.Map<ProductDto>(updateProduct);

                await _redis.RemoveKeyAsync(
                    $"product:{command.Id}:details")
                    .ConfigureAwait(false);

                await _eventBus.PublishAsync(new ProductUpdatedIntegrationEvent(
                    productModified.Id, productModified.Name, productModified.SupplierId))
                    .ConfigureAwait(false);

                return Result<Unit>.Success(Unit.Value);
            }

            ProductLogWarning.LogProductNotFound(_logger, command.Id, default);

            var error = new Error(
                $"Product with id {command.Id} not found",
                ErrorCodes.ProductNotFound
            );

            return Result<Unit>.Failure(error);
        }
        catch (Exception ex)
        {
            GeneralLogError.UnhandledException(_logger, ex.Message, ex);
            throw;
        }
    }
}
