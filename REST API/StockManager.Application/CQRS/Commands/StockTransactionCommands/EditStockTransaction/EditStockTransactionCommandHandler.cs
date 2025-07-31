using AutoMapper;
using MediatR;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StockManager.Application.Common.Logging.General;
using StockManager.Application.Common.Logging.StockTransaction;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.StockTransactionDtos;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.StockTransactionEntity;

namespace StockManager.Application.CQRS.Commands.StockTransactionCommands.EditStockTransaction;

public class EditStockTransactionCommandHandler : IRequestHandler<EditStockTransactionCommand, Result<Unit>>
{
    private readonly IStockTransactionRepository _repository;
    private readonly IMapper _mapper;
    private readonly ILogger<EditStockTransactionCommandHandler> _logger;

    public EditStockTransactionCommandHandler(
        IStockTransactionRepository repository, 
        IMapper mapper,
        ILogger<EditStockTransactionCommandHandler> logger)
    {
        _repository = repository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<Result<Unit>> Handle(EditStockTransactionCommand command, CancellationToken cancellationToken)
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

            _mapper.Map(command.UpdateDto, stockTransaction);

            StockTransaction? updated = await _repository.UpdateStockTransactionAsync(stockTransaction, cancellationToken);

            StockTransactionDto dto = _mapper.Map<StockTransactionDto>(updated);

            StockTransactionLogInfo.LogStockTransactionUpdated(_logger, command.Id, default);
            return Result<Unit>.Success(Unit.Value);
        }
        catch (DbUpdateException ex) when (ex.InnerException is SqlException { Number: 2601 or 2627 })
        {
            StockTransactionLogWarning.LogStockTransactionAlreadyExists(_logger, default, command.UpdateDto, default);
            return Result<Unit>.Failure(
                new Error(
                    "StockTransaction violates unique constraints.",
                    ErrorCodes.StockTransactionConflict));
        }
        catch (Exception ex)
        {
            GeneralLogError.UnhandledException(_logger, ex.Message, ex);
            throw;
        }
    }
}
