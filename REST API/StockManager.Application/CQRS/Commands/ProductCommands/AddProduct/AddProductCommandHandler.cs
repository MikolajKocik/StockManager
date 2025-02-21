using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using StockManager.Application.Dtos;
using StockManager.Application.Validations;
using StockManager.Core.Domain.Interfaces;
using StockManager.Models;
using System.ComponentModel.DataAnnotations;

namespace StockManager.Application.CQRS.Commands.ProductCommands.AddProduct
{
    public class AddProductCommandHandler : IRequestHandler<AddProductCommand, ProductDto>
    {
        private readonly IMapper _mapper;
        private readonly IProductRepository _productRepository;
        private readonly ISupplierRepository _supplierRepository;
        public readonly ILogger<AddProductCommandHandler> _logger;

        public AddProductCommandHandler(IMapper mapper, IProductRepository productRepository,
            ISupplierRepository supplierRepository, ILogger<AddProductCommandHandler> logger)
        {
            _mapper = mapper;
            _productRepository = productRepository;
            _supplierRepository = supplierRepository;
            _logger = logger;
        }

        public async Task<ProductDto> Handle(AddProductCommand request, CancellationToken cancellationToken)
        {
            try
            {
                cancellationToken.ThrowIfCancellationRequested();

                await using var transaction = await _productRepository.BeginTransactionAsync();


                var validate = new ProductValidator();
                var validationResult = validate.Validate(request.Product);

                if (validationResult.IsValid)
                {
                    var supplier = await _supplierRepository.GetSupplierByIdAsync(request.Product.SupplierId, cancellationToken);

                    if (supplier != null)
                    {
                        _logger.LogInformation("Supplier {SupplierId} already exists. Assigning the product to the existing supplier.", supplier.Id);
                    }
                    else
                    {
                        _logger.LogWarning("Supplier with ID {SupplierId} does not exist. Creating a new supplier.", request.Product.SupplierId);
                        supplier = _mapper.Map<Supplier>(request.Product.Supplier);
                        await _supplierRepository.AddSupplierAsync(supplier, cancellationToken);
                    }

                    var product = _mapper.Map<Product>(request.Product);
                    product.Supplier = supplier;

                    _logger.LogInformation("Adding a new product {request.Product} to database", request.Product);
                    var newProduct = await _productRepository.AddProductAsync(product, cancellationToken);

                    await transaction.CommitAsync();

                    var dto = _mapper.Map<ProductDto>(newProduct);

                    return dto;
                }
                else
                {
                    _logger.LogError("Validation failed for product. Rolling back transaction");
                    await transaction.RollbackAsync();
                    throw new ValidationException(
                        string.Join(", ", validationResult.Errors.Select(e => e.ErrorMessage)));
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error ocurred while adding a new product");
                throw;
            }
        }
    }
}
