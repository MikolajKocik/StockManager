using AutoMapper;
using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Mvc;
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
using StockManager.Application.Dtos.ModelsDto.SupplierDtos;
using StockManager.Application.Extensions.Redis;
using StockManager.Application.Helpers.Error;
using StockManager.Application.Validations;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.SupplierEntity;

namespace StockManager.Application.CQRS.Commands.SupplierCommands.AddSupplier;

public sealed class AddSupplierCommandHandler : ICommandHandler<AddSupplierCommand, SupplierDto>
{
    private readonly IMapper _mapper;
    private readonly ISupplierRepository _supplierRepository;
    private readonly ILogger<AddSupplierCommandHandler> _logger;
    private readonly IConnectionMultiplexer _redis;
    private readonly IEventBus _eventBus;
    private readonly IValidator<SupplierCreateDto> _validator;

    public AddSupplierCommandHandler(
        IMapper mapper,
        ISupplierRepository supplierRepository,
        ILogger<AddSupplierCommandHandler> logger,
        IConnectionMultiplexer redis,
        IEventBus eventBus,
        IValidator<SupplierCreateDto> validator
        )
    {
        _mapper = mapper;
        _supplierRepository = supplierRepository;
        _logger = logger;
        _redis = redis;
        _eventBus = eventBus;
        _validator = validator;
    }

    public async Task<Result<SupplierDto>> Handle(AddSupplierCommand command, CancellationToken cancellationToken)
    {
        ValidationResult validationResult = await _validator.ValidateAsync(command.Supplier, cancellationToken);

        if (!validationResult.IsValid)
        {
            SupplierLogWarning.LogSupplierValidationFailed(_logger, validationResult.Errors, default);

            var error = new Error(
                string.Join(", ", validationResult.Errors.Select(e => e.ErrorMessage)),
                ErrorCodes.SupplierValidation);

            return Result<SupplierDto>.Failure(error);
        }

        try
        {
            await using IDbContextTransaction transaction = await _supplierRepository.BeginTransactionAsync();

            Supplier existingSupplier = await _supplierRepository.FindByNameAsync(command.Supplier.Name, cancellationToken);

            if (existingSupplier is not null)
            {
                SupplierLogWarning.LogSupplierAlreadyExists(_logger, existingSupplier.Id, default);

                var error = new Error(
                string.Join(", ", validationResult.Errors.Select(e => e.ErrorMessage)),
                ErrorCodes.SupplierConflict);

                await transaction.RollbackAsync(cancellationToken);

                return Result<SupplierDto>.Failure(error);
            }

            Supplier newSupplier = _mapper.Map<Supplier>(command.Supplier);

            SupplierLogInfo.LogSupplierAddedSuccesfull(_logger, newSupplier, default);

            Supplier addSupplier = await _supplierRepository.AddSupplierAsync(newSupplier, cancellationToken);

            await transaction.CommitAsync(cancellationToken);

            string key = $"supplier:{newSupplier.Id}:views";

            await _redis.IncrementKeyAsync(
                key,
                TimeSpan.FromHours(24),
                cancellationToken)
                .ConfigureAwait(false);

            SupplierDto dto = _mapper.Map<SupplierDto>(addSupplier);

            await _eventBus.PublishAsync(new SupplierAddedIntegrationEvent(
                dto.Id,
                dto.Name,
                dto.Address,
                dto.AddressId)
                ).ConfigureAwait(false);

            return Result<SupplierDto>.Success(dto);

        }
        catch (Exception ex)
        {
            GeneralLogError.UnhandledException(_logger, ex.Message, ex);
            throw;
        }
    }
}
