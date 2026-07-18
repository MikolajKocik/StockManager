using MediatR;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Logging.StockTransaction;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Helpers.CQRS.NullResult;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Common;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.StockTransactionEntity;

namespace StockManager.Application.CQRS.Commands.StockTransactionCommands.DeleteStockTransaction;

public sealed class DeleteStockTransactionCommandHandler(
        IStockTransactionRepository repository,
        ILogger<DeleteStockTransactionCommandHandler> logger,
        IUnitOfWork uow
    ) : ICommandHandler<DeleteStockTransactionCommand, Unit>
{
    private readonly IStockTransactionRepository _repository = repository;
    private readonly ILogger<DeleteStockTransactionCommandHandler> _logger = logger;
    private readonly IUnitOfWork _uow = uow;

    public async Task<Result<Unit>> Handle(DeleteStockTransactionCommand command, CancellationToken ct)
    {
        ResultFailureHelper.AgainstDefaultValue(command.Id);

        StockTransaction? stockTransaction = await _repository.GetStockTransactionByIdAsync(command.Id, ct);
        if (stockTransaction is null)
        {
            StockTransactionLogWarning.LogStockTransactionNotFound(_logger, command.Id, default);
            return Result<Unit>.Failure(
                new Error($"StockTransaction with id {command.Id} not found", ErrorCodes.StockTransactionNotFound));
        }

        await _repository.DeleteStockTransactionAsync(stockTransaction.Id, ct);
        await _uow.SaveChangesAsync(ct);

        StockTransactionLogInfo.LogStockTransactionDeleted(_logger, command.Id, default);
        return Result<Unit>.Success(Unit.Value);
    }
}
