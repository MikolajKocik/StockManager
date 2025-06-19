using AutoMapper;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.Product;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Repositories;

namespace StockManager.Application.CQRS.Commands.ProductCommands.DeleteProduct
{
    public class DeleteProductCommandHandler : ICommandHandler<DeleteProductCommand, ProductDto>
    {
        private readonly IMapper _mapper;
        private readonly IProductRepository _repository;
        private readonly ILogger<DeleteProductCommandHandler> _logger;

        public DeleteProductCommandHandler(IMapper mapper, IProductRepository repository,
            ILogger<DeleteProductCommandHandler> logger)
        {
            _mapper = mapper;
            _repository = repository;
            _logger = logger;
        }

        public async Task<Result<ProductDto>> Handle(DeleteProductCommand command, CancellationToken cancellationToken)
        {
            try
            {
                await using var transaction = await _repository.BeginTransactionAsync();

                var product = await _repository.GetProductByIdAsync(command.Id, cancellationToken);

                if (product is not null)
                {
                    _logger.LogInformation("Removing the provided product:{@product}", command);
                    var remove = await _repository.DeleteProductAsync(product, cancellationToken);

                    var dto = _mapper.Map<ProductDto>(remove);

                    await transaction.CommitAsync();

                    return Result<ProductDto>.Success(dto);
                }
                else
                {
                    _logger.LogWarning("Product with id:{@productId} not found. Rolling back transaction", command.Id);
                    await transaction.RollbackAsync();

                    var error = new Error(
                        $"Product with id {command.Id} not found",
                        ErrorCodes.ProductNotFound
                    );

                    return Result<ProductDto>.Failure(error);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occured while removing data");
                throw;
            }
        }
    }
}
