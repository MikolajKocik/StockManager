using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using StackExchange.Redis;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Logging.Supplier;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Extensions.Cache;
using StockManager.Application.Helpers.CQRS.NullResult;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Common;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.SupplierEntity;

namespace StockManager.Application.CQRS.Commands.SupplierCommands.DeleteSupplier;

public sealed class DeleteSupplierCommandHandler(
        ISupplierRepository repository,
        ILogger<DeleteSupplierCommandHandler> logger,
        IConnectionMultiplexer redis,
        IUnitOfWork uow
    ) : ICommandHandler<DeleteSupplierCommand, Unit>
{
    private readonly ISupplierRepository _supplierRepository = repository;
    private readonly ILogger<DeleteSupplierCommandHandler> _logger = logger;
    private readonly IConnectionMultiplexer _redis = redis;
    private readonly IUnitOfWork _uow = uow;

    public async Task<Result<Unit>> Handle(DeleteSupplierCommand command, CancellationToken ct)
    {
        ResultFailureHelper.AgainstDefaultValue(command.Id);

        Supplier? supplier = await _supplierRepository.GetSupplierByIdAsync(command.Id, ct);

        if (supplier is not null)
        {
            SupplierLogInfo.LogRemovingSupplier(_logger, command.Id, default);
            await _supplierRepository.DeleteSupplierAsync(command.Id, ct);
            await _uow.SaveChangesAsync(ct);

            await _redis.RemoveKeyAsync($"supplier:{command.Id}:views")
                .ConfigureAwait(false);

            await _redis.RemoveKeyAsync($"supplier:{command.Id}:details")
                .ConfigureAwait(false);

            return Result<Unit>.Success(Unit.Value);
        }

        SupplierLogWarning.LogSupplierNotFound(_logger, command.Id, default);

        var error = new Error(
            $"Supplier with id {command.Id} not found",
            ErrorCodes.SupplierNotFound
        );

        return Result<Unit>.Failure(error);
    }
}
