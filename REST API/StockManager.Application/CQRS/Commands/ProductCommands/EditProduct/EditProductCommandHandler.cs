using AutoMapper;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using StockManager.Application.Dtos;
using StockManager.Application.Validations;
using StockManager.Core.Domain.Interfaces;

namespace StockManager.Application.CQRS.Commands.ProductCommands.EditProduct
{
    public class EditProductCommandHandler : IRequestHandler<EditProductCommand, ProductDto?>
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

        public async Task<ProductDto?> Handle(EditProductCommand request, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            await using var transaction = await _repository.BeginTransactionAsync();

            try
            {
                var product = await _repository.GetProductByIdAsync(request.Id, cancellationToken);

                if (product != null)
                { 
                    _logger.LogInformation("Modifying the provided product:{request.Id} with {@ModifiedProduct}", request.Id, request);
                    var updateProduct = await _repository.UpdateProductAsync(product, cancellationToken);

                    var productModified = _mapper.Map<ProductDto>(updateProduct);

                    var validate = new ProductValidator();
                    var validationResult = validate.Validate(productModified);

                    if (validationResult.IsValid)
                    {
                        await transaction.CommitAsync();
                        return productModified;
                    }
                    else
                    {
                        _logger.LogWarning("Validation failed for product:{product}. Errors: {Errors}. Rolling back transaction",
                            product, string.Join(", ", validationResult.Errors.Select(e => e.ErrorMessage)));
                        throw new ValidationException(string.Join(", ", validationResult.Errors.Select(e => e.ErrorMessage)));
                    }
                }
                else
                {
                    _logger.LogWarning("Product with id:{request.Id} not found. Rolling back transaction", request.Id);
                    await transaction.RollbackAsync();
                    return null;
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
