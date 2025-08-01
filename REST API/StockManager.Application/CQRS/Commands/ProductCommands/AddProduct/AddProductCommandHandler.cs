using AutoMapper;
using FluentValidation;
using FluentValidation.Results;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using StackExchange.Redis;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Events;
using StockManager.Application.Common.Events.Product;
using StockManager.Application.Common.Logging.General;
using StockManager.Application.Common.Logging.Product;
using StockManager.Application.Common.Logging.Supplier;
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
using StockManager.Core.Domain.Models.SupplierEntity;
using IDatabase = StackExchange.Redis.IDatabase;

namespace StockManager.Application.CQRS.Commands.ProductCommands.AddProduct;

public class AddProductCommandHandler : ICommandHandler<AddProductCommand, ProductDto>
{
    private readonly IMapper _mapper;
    private readonly IProductRepository _productRepository;
    private readonly ISupplierRepository _supplierRepository;
    private readonly ILogger<AddProductCommandHandler> _logger;
    private readonly IEventBus _eventBus;
    private readonly IConnectionMultiplexer _redis;
    private readonly IProductService _productService;

    public AddProductCommandHandler(
        IMapper mapper, IProductRepository productRepository,
        ISupplierRepository supplierRepository,
        ILogger<AddProductCommandHandler> logger,
        IEventBus eventBus,
        IConnectionMultiplexer redis,
        IProductService productService
        )
    {
        _mapper = mapper;
        _productRepository = productRepository;
        _supplierRepository = supplierRepository;
        _logger = logger;
        _eventBus = eventBus;
        _redis = redis;
        _productService = productService;
    }

    public async Task<Result<ProductDto>> Handle(AddProductCommand command, CancellationToken cancellationToken)
    {
        try
        {
            ResultFailureHelper.IfProvidedNullArgument(command.Product.Name);

            Product productExist = await _productRepository.FindProductByNameAsync(command.Product.Name, cancellationToken);

            if (productExist is not null)
            {
                ProductLogWarning.LogProductAlreadyExists(_logger, command.Product.Name, default);
                var error = new Error(
                    $"Product with name {command.Product.Name} already exists.",
                    ErrorCodes.ProductConflict
                );
                return Result<ProductDto>.Failure(error);
            }

            Supplier supplier = await _supplierRepository.GetSupplierByIdAsync(command.Product.SupplierId, cancellationToken);

            if (supplier is null)
            {
                SupplierLogWarning.LogSupplierNotExists(_logger, command.Product.SupplierId, default);

                var error = new Error(
                    $"Supplier with ID {command.Product.SupplierId} not found.",
                    ErrorCodes.SupplierNotFound
                );
                return Result<ProductDto>.Failure(error);
            }

            Product product = _mapper.Map<Product>(command.Product);
            _productService.SetSupplier(product, supplier);

            Product newProduct = await _productRepository.AddProductAsync(product, cancellationToken);

            ProductLogInfo.LogAddProductSuccesfull(_logger, newProduct.Id, newProduct.Name, default);

            string key = $"product:{newProduct.Id}:views";

            await _redis.IncrementKeyAsync(
                key,
                TimeSpan.FromHours(24),
                cancellationToken)
                .ConfigureAwait(false);

            ProductDto dto = _mapper.Map<ProductDto>(newProduct);

            await _eventBus.PublishAsync(new ProductAddedIntegrationEvent(
               newProduct.Id, newProduct.Name, supplier.Id)
                ).ConfigureAwait(false);

            return Result<ProductDto>.Success(dto);
        }
        catch (Exception ex)
        {
            GeneralLogError.UnhandledException(_logger, ex.Message, ex);
            throw;
        }
    }
}
