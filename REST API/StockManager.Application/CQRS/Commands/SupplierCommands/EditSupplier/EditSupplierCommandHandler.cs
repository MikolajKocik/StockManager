using AutoMapper;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common;
using StockManager.Application.Dtos.ModelsDto.Supplier;
using StockManager.Application.Validations;
using StockManager.Core.Domain.Interfaces.Repositories;

namespace StockManager.Application.CQRS.Commands.SupplierCommands.EditSupplier
{
    public sealed class EditSupplierCommandHandler : ICommandHandler<EditSupplierCommand, SupplierDto>
    {
        private readonly ISupplierRepository _supplierRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<EditSupplierCommandHandler> _logger;

        public EditSupplierCommandHandler(
            ISupplierRepository supplierRepository,
            IMapper mapper,
            ILogger<EditSupplierCommandHandler> logger)
        {
            _supplierRepository = supplierRepository;
            _mapper = mapper;
            _logger = logger;
        }

        public async Task<Result<SupplierDto>> Handle(EditSupplierCommand command, CancellationToken cancellationToken)
        {
            cancellationToken.ThrowIfCancellationRequested();

            try
            {
                await using var transaction = await _supplierRepository.BeginTransactionAsync();

                var supplier = await _supplierRepository.GetSupplierByIdAsync(command.Id, cancellationToken);

               if(supplier is not null)
               {
                    _logger.LogError("Modyfing the provided supplier: {@supplierId} with modified {@modifiedSupplier}", command.Id, command.Supplier);

                    var updateSupplier = await _supplierRepository.UpdateSupplierAsync(supplier, cancellationToken);

                    var supplierModified = _mapper.Map<SupplierDto>(updateSupplier);

                    var validate = new SupplierValidator();
                    var validationResult = validate.Validate(supplierModified);

                    if(validationResult.IsValid)
                    {
                        await transaction.CommitAsync();

                        return Result<SupplierDto>.Success(supplierModified);
                    }
                    else
                    {
                        _logger.LogWarning("Validation failed for supplier:{@supplier}. Errors: {Errors}. Rolling back transaction",
                             supplier, string.Join(", ", validationResult.Errors.Select(e => e.ErrorMessage)));

                        var error = new Error(
                            string.Join(", ", validationResult.Errors.Select(e => e.ErrorMessage)),
                            code: $"Validation.Badcommand"
                        );

                        return Result<SupplierDto>.Failure(error);
                    }
                }
                else
                {
                    _logger.LogWarning("Product with id:{@productId} not found. Rolling back transaction", command.Id);
                    await transaction.RollbackAsync();

                    var error = new Error(
                        $"Product with id {command.Id} not found",
                        code: "Product.NotFound"
                    );

                    return Result<SupplierDto>.Failure(error);
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
