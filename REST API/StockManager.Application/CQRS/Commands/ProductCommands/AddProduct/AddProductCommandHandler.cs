using AutoMapper;
using Microsoft.Extensions.Logging;
using StackExchange.Redis;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Logging.Product;
using StockManager.Application.Common.Logging.Supplier;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.ProductDtos;
using StockManager.Application.Extensions.Cache;
using StockManager.Application.Helpers.CQRS.NullResult;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Common;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models.ProductEntity;
using StockManager.Core.Domain.Models.SupplierEntity;

namespace StockManager.Application.CQRS.Commands.ProductCommands.AddProduct;

public sealed class AddProductCommandHandler(
        IMapper mapper,
        IProductRepository productRepository,
        ISupplierRepository supplierRepository,
        ILogger<AddProductCommandHandler> logger,
        IConnectionMultiplexer redis,
        IProductService productService,
        IUnitOfWork uow
    ) : ICommandHandler<AddProductCommand, ProductDto>
{
    private readonly IMapper _mapper = mapper;
    private readonly IProductRepository _productRepository = productRepository;
    private readonly ISupplierRepository _supplierRepository = supplierRepository;
    private readonly ILogger<AddProductCommandHandler> _logger = logger;
    private readonly IConnectionMultiplexer _redis = redis;
    private readonly IProductService _productService = productService;
    private readonly IUnitOfWork _uow = uow;

    public async Task<Result<ProductDto>> Handle(AddProductCommand command, CancellationToken ct)
    {
        ResultFailureHelper.IfProvidedNullArgument(command.Product.Name);

        Product productExist = await _productRepository.FindProductByNameAsync(command.Product.Name, ct);

        if (productExist is not null)
        {
            ProductLogWarning.LogProductAlreadyExists(_logger, command.Product.Name, default);
            var error = new Error(
                $"Product with name {command.Product.Name} already exists.",
                ErrorCodes.ProductConflict
            );
            return Result<ProductDto>.Failure(error);
        }

        Supplier supplier = await _supplierRepository.GetSupplierByIdAsync(command.Product.SupplierId, ct);

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

        _productRepository.AddProduct(product);
        await _uow.SaveChangesAsync(ct);

        ProductLogInfo.LogAddProductSuccesfull(_logger, product.Id, product.Name, default);

        string key = $"product:{product.Id}:views";

        await _redis.IncrementKeyAsync(
            key,
            TimeSpan.FromHours(24),
            ct)
            .ConfigureAwait(false);

        ProductDto dto = _mapper.Map<ProductDto>(product);

        return Result<ProductDto>.Success(dto);
    }
}
