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
        private readonly IProductRepository _repository;
        public readonly ILogger<AddProductCommandHandler> _logger;

        public AddProductCommandHandler(IMapper mapper, IProductRepository repository,
            ILogger<AddProductCommandHandler> logger)
        {
            _mapper = mapper;
            _repository = repository;
            _logger = logger;
        }

        public async Task<ProductDto> Handle(AddProductCommand request, CancellationToken cancellationToken)
        {
            try
            {
                cancellationToken.ThrowIfCancellationRequested();

                await using (var transaction = await _repository.BeginTransactionAsync())
                {

                    var validate = new ProductValidator();       
                    var validationResult = validate.Validate(request.Product);

                    if (validationResult.IsValid)
                    {

                        var product = _mapper.Map<Product>(request.Product);

                        var newProduct = await _repository.AddProductAsync(product, cancellationToken);

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
            }
            catch (Exception ex)
            { 
                _logger.LogError(ex, "Error ocurred while adding a new product");
                throw;
            }
        }
    }
}
