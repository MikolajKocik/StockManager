﻿using AutoMapper;
using FluentValidation.Results;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.Supplier;
using StockManager.Application.Validations;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Models;

namespace StockManager.Application.CQRS.Commands.SupplierCommands.EditSupplier;

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
        try
        {
            await using IDbContextTransaction transaction = await _supplierRepository.BeginTransactionAsync();

            Supplier? supplier = await _supplierRepository.GetSupplierByIdAsync(command.Id, cancellationToken);

           if(supplier is not null)
           {
                _logger.LogError("Modyfing the provided supplier: {@supplierId} with modified {@modifiedSupplier}", command.Id, command.Supplier);

                Supplier? updateSupplier = await _supplierRepository.UpdateSupplierAsync(supplier, cancellationToken);

                SupplierDto supplierModified = _mapper.Map<SupplierDto>(updateSupplier);

                var validate = new SupplierValidator();
                ValidationResult validationResult = await validate.ValidateAsync(supplierModified, cancellationToken);

                if(validationResult.IsValid)
                {
                    await transaction.CommitAsync(cancellationToken);

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
                await transaction.RollbackAsync(cancellationToken);

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
