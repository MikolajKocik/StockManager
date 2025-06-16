using AutoMapper;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common;
using StockManager.Application.Validations;
using StockManager.Core.Application.Dtos.ModelsDto;
using StockManager.Core.Domain.Interfaces.Repositories;

namespace StockManager.Application.CQRS.Commands.ProductCommands.EditProduct
{
    public class EditProductCommandHandler : ICommandHandler<EditProductCommand, ProductDto>
    {
        private readonly IMapper _mapper;
        private readonly IProductRepository _repository;
        private readonly ILogger<EditProductCommandHandler> _logger;

        public EditProductCommandHandler(IMapper mapper, IProductRepository repository, 
            ILogger<EditProductCommandHandler> logger)
        {
            _mapper = mapper;
            _repository = repository;
            _logger = logger;
        }

        public async Task<Result<ProductDto>> Handle(EditProductCommand request, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            await using var transaction = await _repository.BeginTransactionAsync();

            try
            {
                var product = await _repository.GetProductByIdAsync(request.Id, cancellationToken);

                if (product is not null)
                { 
                    _logger.LogInformation("Modifying the provided product:{@productId} with {@modifiedProduct}", request.Id, request);

                    product = _mapper.Map(request.Product, product);

                    var updateProduct = await _repository.UpdateProductAsync(product, cancellationToken);

                    var productModified = _mapper.Map<ProductDto>(updateProduct);

                    var validate = new ProductValidator();
                    var validationResult = validate.Validate(productModified);

                    if (validationResult.IsValid)
                    {
                        await transaction.CommitAsync();

                        return Result<ProductDto>.Success(productModified);
                    }
                    else
                    {
                        _logger.LogWarning("Validation failed for product:{@product}. Errors: {Errors}. Rolling back transaction",
                            product, string.Join(", ", validationResult.Errors.Select(e => e.ErrorMessage)));

                        var error = new Error(
                            string.Join(", ", validationResult.Errors.Select(e => e.ErrorMessage)),
                            code: $"Validation.BadRequest"
                        );

                        return Result<ProductDto>.Failure(error);
                    }
                }
                else
                {
                    _logger.LogWarning("Product with id:{@productId} not found. Rolling back transaction", request.Id);
                    await transaction.RollbackAsync();

                    var error = new Error(
                        $"Product with id {request.Id} not found",
                        code: "Product.NotFound"
                    );

                    return Result<ProductDto>.Failure(error);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occured while editing data");
                throw;
            }
        }
    }
}
