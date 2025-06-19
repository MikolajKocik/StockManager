using AutoMapper;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.Supplier;
using StockManager.Application.Helpers.Error;
using StockManager.Application.Validations;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Models;

namespace StockManager.Application.CQRS.Commands.SupplierCommands.AddSupplier
{
    public sealed class AddSupplierCommandHandler : ICommandHandler<AddSupplierCommand, SupplierDto>
    {
        private readonly IMapper _mapper;
        private readonly ISupplierRepository _supplierRepository;
        private readonly ILogger<AddSupplierCommandHandler> _logger;

        public AddSupplierCommandHandler(
            IMapper mapper,
            ISupplierRepository supplierRepository,
            ILogger<AddSupplierCommandHandler> logger)
        {
            _mapper = mapper;
            _supplierRepository = supplierRepository;
            _logger = logger;
        }

        public async Task<Result<SupplierDto>> Handle(AddSupplierCommand command, CancellationToken cancellationToken)
        {
            try
            {
                await using var transaction = await _supplierRepository.BeginTransactionAsync();

                var validate = new SupplierValidator();
                var validationResult = validate.Validate(command.Supplier);

                if(validationResult.IsValid)
                {
                    var existingSupplier = await _supplierRepository.GetSupplierByIdAsync(command.Supplier.Id, cancellationToken);

                    if (existingSupplier is not null)
                    {
                        _logger.LogInformation("Supplier {SupplierName} already exists. Returning existing supplier.", existingSupplier.Name);

                        var dto = _mapper.Map<SupplierDto>(existingSupplier);

                        return Result<SupplierDto>.Success(dto);
                    }
                    else
                    {
                        var newSupplier = _mapper.Map<Supplier>(command.Supplier);

                        _logger.LogInformation("Adding a new supplier {NewSupplier}", newSupplier);

                        var addSupplier = await _supplierRepository.AddSupplierAsync(newSupplier, cancellationToken);

                        await transaction.CommitAsync(cancellationToken);

                        var dto = _mapper.Map<SupplierDto>(addSupplier);

                        return Result<SupplierDto>.Success(dto);
                    }               
                }
                else
                {
                    _logger.LogWarning("Validation failed for supplier: {ValidationErrors}", validationResult.Errors);

                    await transaction.RollbackAsync(cancellationToken);

                    var error = new Error(
                        string.Join(", ", validationResult.Errors.Select(e => e.ErrorMessage)),
                        ErrorCodes.SupplierValidation);

                    return Result<SupplierDto>.Failure(error);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while handling AddSupplierCommand");
                throw;
            }
        }
    }
}
