using AutoMapper;
using FluentValidation;
using FluentValidation.Results;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Logging;
using StackExchange.Redis;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Events;
using StockManager.Application.Common.Events.Supplier;
using StockManager.Application.Common.Logging.General;
using StockManager.Application.Common.Logging.Supplier;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.SupplierDtos;
using StockManager.Application.Extensions.Redis;
using StockManager.Application.Helpers.CQRS.NullResult;
using StockManager.Application.Helpers.Error;
using StockManager.Application.Validations;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Core.Domain.Models.SupplierEntity;

namespace StockManager.Application.CQRS.Commands.SupplierCommands.EditSupplier;

public sealed class EditSupplierCommandHandler : ICommandHandler<EditSupplierCommand, SupplierDto>
{
    private readonly ISupplierRepository _supplierRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<EditSupplierCommandHandler> _logger;
    private readonly IConnectionMultiplexer _redis;
    private readonly IEventBus _eventBus;
    private readonly ISupplierService _supplierService;

    public EditSupplierCommandHandler(
        ISupplierRepository supplierRepository,
        IMapper mapper,
        ILogger<EditSupplierCommandHandler> logger,
        IConnectionMultiplexer redis,
        IEventBus eventBus,
        ISupplierService supplierService
        )
    {
        _supplierRepository = supplierRepository;
        _mapper = mapper;
        _logger = logger;
        _redis = redis;
        _eventBus = eventBus;
        _supplierService = supplierService;
    }

    public async Task<Result<SupplierDto>> Handle(EditSupplierCommand command, CancellationToken cancellationToken)
    {
        try
        {
            ResultFailureHelper.IfProvidedNullArgument(command.Id);

            Supplier? supplier = await _supplierRepository.GetSupplierByIdAsync(command.Id, cancellationToken);

            if (supplier is not null)
            {
                SupplierLogInfo.LogModyfingSupplier(_logger, command.Id, command.Supplier, default);

                Supplier? updateSupplier = await _supplierRepository.UpdateSupplierAsync(supplier, _supplierService, cancellationToken);

                SupplierDto supplierModified = _mapper.Map<SupplierDto>(updateSupplier);

                await _redis.RemoveKeyAsync(
                    $"supplier:{command.Id}:details")
                    .ConfigureAwait(false);

                await _eventBus.PublishAsync(new SupplierUpdatedIntegrationEvent(
                    supplierModified.Id,
                    supplierModified.Name,
                    supplierModified.Address,
                    supplierModified.AddressId)
                    ).ConfigureAwait(false);

                return Result<SupplierDto>.Success(supplierModified);

            }

            SupplierLogWarning.LogSupplierNotFound(_logger, command.Id, default);

            var error = new Error(
                $"Supplier with id {command.Id} not found",
                ErrorCodes.SupplierNotFound
            );

            return Result<SupplierDto>.Failure(error);
        }
        catch (Exception ex)
        {
            GeneralLogError.UnhandledException(_logger, ex.Message, ex);
            throw;
        }
    }
}
