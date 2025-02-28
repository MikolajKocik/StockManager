using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using StockManager.Application.Dtos;
using StockManager.Core.Domain.Exceptions;
using StockManager.Core.Domain.Interfaces.Repositories;

namespace StockManager.Application.CQRS.Commands.ProductCommands.DeleteProduct
{
    public class DeleteProductCommandHandler : IRequestHandler<DeleteProductCommand, ProductDto>
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

        public async Task<ProductDto> Handle(DeleteProductCommand request, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            await using var transaction = await _repository.BeginTransactionAsync();

            try
            {
                var product = await _repository.GetProductByIdAsync(request.Id, cancellationToken);

                if (product != null)
                {
                    _logger.LogInformation("Removing the provided product:{@Product}", request);
                    var remove = await _repository.DeleteProductAsync(product, cancellationToken);

                    var dto = _mapper.Map<ProductDto>(remove);

                    await transaction.CommitAsync();
                    return dto;
                }
                else
                {
                    _logger.LogWarning("Product with id:{request.Id} not found. Rolling back transaction", request.Id);
                    await transaction.RollbackAsync();
                    throw new NotFoundException(nameof(ProductDto), request.Id.ToString());
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
