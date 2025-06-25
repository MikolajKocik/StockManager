using AutoMapper;
using FluentValidation.Results;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Events;
using StockManager.Application.Common.Events.Product;
using StockManager.Application.Common.Logging.General;
using StockManager.Application.Common.Logging.Product;
using StockManager.Application.Common.Logging.Supplier;
using StockManager.Application.Common.PipelineBehavior;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.Product;
using StockManager.Application.Helpers.Error;
using StockManager.Application.Validations;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Models;

namespace StockManager.Application.CQRS.Commands.ProductCommands.AddProduct;

public class AddProductCommandHandler : ICommandHandler<AddProductCommand, ProductDto>
{
    private readonly IMapper _mapper;
    private readonly IProductRepository _productRepository;
    private readonly ISupplierRepository _supplierRepository;
    private readonly ILogger<AddProductCommandHandler> _logger;
    private readonly IEventBus _eventBus;

    public AddProductCommandHandler(
        IMapper mapper, IProductRepository productRepository,
        ISupplierRepository supplierRepository,
        ILogger<AddProductCommandHandler> logger,
        IEventBus eventBus)
    {
        _mapper = mapper;
        _productRepository = productRepository;
        _supplierRepository = supplierRepository;
        _logger = logger;
        _eventBus = eventBus;
    }

    public async Task<Result<ProductDto>> Handle(AddProductCommand command, CancellationToken cancellationToken)
    {
        try
        {
            await using IDbContextTransaction transaction = await _productRepository.BeginTransactionAsync();

            var validate = new ProductValidator();
            ValidationResult validationResult = await validate.ValidateAsync(command.Product, cancellationToken);

            if (validationResult.IsValid)
            {
                Supplier supplier = await _supplierRepository.GetSupplierByIdAsync(command.Product.SupplierId, cancellationToken);

                if (supplier is not null)
                {
                    SupplierLogWarning.LogSupplierAlreadyExists(_logger, supplier.Id, default);
                    _supplierRepository.AttachSupplier(supplier);
                }
                else
                {
                    SupplierLogWarning.LogSupplierNotExists(_logger, command.Product.SupplierId, default);
                    supplier = _mapper.Map<Supplier>(command.Product.Supplier);
                    await _supplierRepository.AddSupplierAsync(supplier, cancellationToken);
                }

                Product product = _mapper.Map<Product>(command.Product);
                product.SetSupplier(supplier);

                ProductLogInfo.LogAddProductSuccesfull(_logger, command.Product, default);

                Product newProduct = await _productRepository.AddProductAsync(product, cancellationToken);

                await transaction.CommitAsync(cancellationToken);

                await _eventBus.PublishAsync(new ProductAddedIntegrationEvent(
                    newProduct.Id, newProduct.Name, supplier.Id)).ConfigureAwait(false);             

                ProductDto dto = _mapper.Map<ProductDto>(newProduct);

                return Result<ProductDto>.Success(dto);
            }
            else
            {
                ProductLogWarning.LogProductValidationFailed(_logger, command.Product, default);
                await transaction.RollbackAsync(cancellationToken);

                var error = new Error(
                    string.Join(", ", validationResult.Errors.Select(e => e.ErrorMessage)),
                    ErrorCodes.SupplierValidation
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
