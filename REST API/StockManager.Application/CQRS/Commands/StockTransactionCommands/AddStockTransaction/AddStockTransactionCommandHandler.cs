using AutoMapper;
using MediatR;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StockManager.Application.Common.Logging.StockTransaction;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.StockTransactionDtos;
using StockManager.Application.Helpers.CQRS.NullResult;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.StockTransactionEntity;

namespace StockManager.Application.CQRS.Commands.StockTransactionCommands.AddStockTransaction;

public class AddStockTransactionCommandHandler : IRequestHandler<AddStockTransactionCommand, Result<StockTransactionDto>>
{
    private readonly IStockTransactionRepository _repository;
    private readonly IMapper _mapper;
    private readonly ILogger<AddStockTransactionCommandHandler> _logger;

    public AddStockTransactionCommandHandler(
        IStockTransactionRepository repository, 
        IMapper mapper, 
        ILogger<AddStockTransactionCommandHandler> logger)
    {
        _repository = repository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<Result<StockTransactionDto>> Handle(AddStockTransactionCommand command, CancellationToken cancellationToken)
    {
        try
        {
            ResultFailureHelper.IfProvidedNullArgument(command.CreateDto);

            StockTransaction stockTransaction = _mapper.Map<StockTransaction>(command.CreateDto);
            StockTransaction created = await _repository.AddStockTransactionAsync(stockTransaction, cancellationToken);

            StockTransactionLogInfo.LogStockTransactionCreated(_logger, command.CreateDto, default);

            return Result<StockTransactionDto>.Success(
                _mapper.Map<StockTransactionDto>(created));
        }
        catch (DbUpdateException ex) when (ex.InnerException is SqlException { Number: 2601 or 2627 })
        {
            return Result<StockTransactionDto>.Failure(
                new Error(
                    "StockTransaction: {command.CreateDto} already exists",
                    ErrorCodes.StockTransactionConflict));
        }
    }
}
