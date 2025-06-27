using AutoMapper;
using FluentValidation.Results;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Logging;
using StackExchange.Redis;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Events;
using StockManager.Application.Common.Events.Supplier;
using StockManager.Application.Common.Logging.General;
using StockManager.Application.Common.Logging.Supplier;
using StockManager.Application.Common.PipelineBehavior;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.Supplier;
using StockManager.Application.Extensions.Redis;
using StockManager.Application.Helpers.Error;
using StockManager.Application.Validations;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Models;

namespace StockManager.Application.CQRS.Commands.SupplierCommands.AddSupplier;

public sealed class AddSupplierCommandHandler : ICommandHandler<AddSupplierCommand, SupplierDto>
{
    private readonly IMapper _mapper;
    private readonly ISupplierRepository _supplierRepository;
    private readonly ILogger<AddSupplierCommandHandler> _logger;
    private readonly IConnectionMultiplexer _redis;
    private readonly IEventBus _eventBus;

    public AddSupplierCommandHandler(
        IMapper mapper,
        ISupplierRepository supplierRepository,
        ILogger<AddSupplierCommandHandler> logger,
        IConnectionMultiplexer redis,
        IEventBus eventBus)
    {
        _mapper = mapper;
        _supplierRepository = supplierRepository;
        _logger = logger;
        _redis = redis;
        _eventBus = eventBus;
    }

    public async Task<Result<SupplierDto>> Handle(AddSupplierCommand command, CancellationToken cancellationToken)
    {
        try
        {
            string key = $"supplier:{command.Supplier.Id}:views";

            await _redis.IncrementKeyAsync(
                key,
                TimeSpan.FromHours(24),
                cancellationToken)
                .ConfigureAwait(false);

            await using IDbContextTransaction transaction = await _supplierRepository.BeginTransactionAsync();

            var validate = new SupplierValidator();
            ValidationResult validationResult = await validate.ValidateAsync(command.Supplier, cancellationToken);

            if(validationResult.IsValid)
            {
                Supplier existingSupplier = await _supplierRepository.GetSupplierByIdAsync(command.Supplier.Id, cancellationToken);

                if (existingSupplier is not null)
                {
                    SupplierLogWarning.LogSupplierAlreadyExists(_logger, existingSupplier.Id, default);

                    SupplierDto dto = _mapper.Map<SupplierDto>(existingSupplier);

                    return Result<SupplierDto>.Success(dto);
                }
                else
                {
                    Supplier newSupplier = _mapper.Map<Supplier>(command.Supplier);

                    SupplierLogInfo.LogSupplierAddedSuccesfull(_logger, newSupplier, default);

                    Supplier addSupplier = await _supplierRepository.AddSupplierAsync(newSupplier, cancellationToken);

                    await transaction.CommitAsync(cancellationToken);

                    SupplierDto dto = _mapper.Map<SupplierDto>(addSupplier);

                    await _eventBus.PublishAsync(new SupplierAddedIntegrationEvent(
                        command.Supplier.Id,
                        command.Supplier.Name,
                        command.Supplier.Address,
                        command.Supplier.AddressId,
                        command.Supplier.Products)
                        ).ConfigureAwait(false);

                    return Result<SupplierDto>.Success(dto);
                }               
            }
            else
            {
                SupplierLogWarning.LogSupplierValidationFailed(_logger, validationResult.Errors, default);

                await transaction.RollbackAsync(cancellationToken);

                var error = new Error(
                    string.Join(", ", validationResult.Errors.Select(e => e.ErrorMessage)),
                    ErrorCodes.SupplierValidation);

                return Result<SupplierDto>.Failure(error);
            }
        }
        catch (Exception ex)
        {
            GeneralLogError.UnhandledException(_logger, ex.Message, ex);
            throw;
        }
    }
}
