using AutoMapper;
using MediatR;
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
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.SupplierEntity;

namespace StockManager.Application.CQRS.Commands.SupplierCommands.DeleteSupplier;

public sealed class DeleteSupplierCommandHandler : ICommandHandler<DeleteSupplierCommand, Unit>
{
    private readonly IMapper _mapper;
    private readonly ISupplierRepository _supplierRepository;
    private readonly ILogger<DeleteSupplierCommandHandler> _logger;
    private readonly IConnectionMultiplexer _redis;
    private readonly IEventBus _eventBus;

    public DeleteSupplierCommandHandler(
        IMapper mapper,
        ISupplierRepository repository,
        ILogger<DeleteSupplierCommandHandler> logger,
          IConnectionMultiplexer redis,
          IEventBus eventBus)
    {
        _mapper = mapper;
        _supplierRepository = repository;
        _logger = logger;
        _redis = redis;
        _eventBus = eventBus;
    }

    public async Task<Result<Unit>> Handle(DeleteSupplierCommand command, CancellationToken cancellationToken)
    {
        try
        {
            await using IDbContextTransaction transaction = await _supplierRepository.BeginTransactionAsync(cancellationToken);

            Supplier supplier = await _supplierRepository.GetSupplierByIdAsync(command.Id, cancellationToken);

            if (supplier is not null)
            {
                SupplierLogInfo.LogRemovingSupplier(_logger, command.Id, default);
                Supplier remove = await _supplierRepository.DeleteSupplierAsync(supplier, cancellationToken);

                await transaction.CommitAsync(cancellationToken);

                await _redis.RemoveKeyAsync(
                    $"supplier:{command.Id}:views")
                    .ConfigureAwait(false);

                await _redis.RemoveKeyAsync(
                    $"suppleir:{command.Id}:details")
                    .ConfigureAwait(false);

                await _eventBus.PublishAsync(new SupplierDeletedIntegrationEvent(
                    command.Id)
                    ).ConfigureAwait(false);

                return Result<Unit>.Success(Unit.Value);
            }

            SupplierLogWarning.LogSupplierNotFound(_logger, command.Id, default);
            await transaction.RollbackAsync(cancellationToken);

            var error = new Error(
                $"Supplier with id {command.Id} not found",
                ErrorCodes.SupplierNotFound
            );

            return Result<Unit>.Failure(error);
        }
        catch (Exception ex)
        {
            GeneralLogError.UnhandledException(_logger, ex.Message, ex);
            throw;
        }
    }
}
