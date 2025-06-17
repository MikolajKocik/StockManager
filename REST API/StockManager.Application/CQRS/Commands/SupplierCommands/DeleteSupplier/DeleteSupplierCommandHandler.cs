using AutoMapper;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common;
using StockManager.Application.Dtos.ModelsDto.Supplier;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Repositories;

namespace StockManager.Application.CQRS.Commands.SupplierCommands.DeleteSupplier
{
    public sealed class DeleteSupplierCommandHandler : ICommandHandler<DeleteSupplierCommand, SupplierDto>
    {
        private readonly IMapper _mapper;
        private readonly ISupplierRepository _supplierRepository;
        private readonly ILogger<DeleteSupplierCommandHandler> _logger;

        public DeleteSupplierCommandHandler(IMapper mapper, ISupplierRepository repository,
            ILogger<DeleteSupplierCommandHandler> logger)
        {
            _mapper = mapper;
            _supplierRepository = repository;
            _logger = logger;
        }

        public async Task<Result<SupplierDto>> Handle(DeleteSupplierCommand command, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            try
            {
                await using var transaction = await _supplierRepository.BeginTransactionAsync();

                var supplier = await _supplierRepository.GetSupplierByIdAsync(command.Id, cancellationToken);

                if (supplier is not null)
                {
                    _logger.LogInformation("Removing the provided supplier:{@supplier}", command);
                    var remove = await _supplierRepository.DeleteSupplierAsync(supplier, cancellationToken);

                    var dto = _mapper.Map<SupplierDto>(remove);

                    await transaction.CommitAsync();

                    return Result<SupplierDto>.Success(dto);
                }
                else
                {
                    _logger.LogWarning("Supplier with id:{@supplierId} not found. Rolling back transaction", command.Id);
                    await transaction.RollbackAsync();

                    var error = new Error(
                        $"Supplier with id {command.Id} not found",
                        ErrorCodes.SupplierNotFound
                    );

                    return Result<SupplierDto>.Failure(error);
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
