using MediatR;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.Logging.General;
using StockManager.Application.Common.Logging.StockTransaction;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.StockTransactionEntity;

namespace StockManager.Application.CQRS.Commands.StockTransactionCommands.DeleteStockTransaction;

public sealed class DeleteStockTransactionCommandHandler : ICommandHandler<DeleteStockTransactionCommand, Unit>
{
    private readonly IStockTransactionRepository _repository;
    private readonly ILogger<DeleteStockTransactionCommandHandler> _logger;

    public DeleteStockTransactionCommandHandler(
        IStockTransactionRepository repository,
        ILogger<DeleteStockTransactionCommandHandler> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    public async Task<Result<Unit>> Handle(DeleteStockTransactionCommand command, CancellationToken cancellationToken)
    {
        try
        {
            StockTransaction? stockTransaction = await _repository.GetStockTransactionByIdAsync(command.Id, cancellationToken);
            if (stockTransaction is null)
            {
                StockTransactionLogWarning.LogStockTransactionNotFound(_logger, command.Id, default);
                return Result<Unit>.Failure(
                    new Error($"StockTransaction with id {command.Id} not found", ErrorCodes.StockTransactionNotFound));
            }

            await _repository.DeleteStockTransactionAsync(stockTransaction, cancellationToken);

            StockTransactionLogInfo.LogStockTransactionDeleted(_logger, command.Id, default);
            return Result<Unit>.Success(Unit.Value);
        }
        catch (Exception ex)
        {
            GeneralLogError.UnhandledException(_logger, ex.Message, ex);
            throw;
        }
    }
}
