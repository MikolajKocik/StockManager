using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using StockManager.Application.Common.Logging.General;
using StockManager.Application.Common.Logging.StockTransaction;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.StockTransactionDtos;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.StockTransactionEntity;

namespace StockManager.Application.CQRS.Queries.StockTransactionQueries.GetStockTransactionById;

public class GetStockTransactionByIdQueryHandler : IRequestHandler<GetStockTransactionByIdQuery, Result<StockTransactionDto>>
{
    private readonly IStockTransactionRepository _repository;
    private readonly IMapper _mapper;
    private readonly ILogger<GetStockTransactionByIdQueryHandler> _logger;

    public GetStockTransactionByIdQueryHandler(IStockTransactionRepository repository, IMapper mapper, ILogger<GetStockTransactionByIdQueryHandler> logger)
    {
        _repository = repository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<Result<StockTransactionDto>> Handle(GetStockTransactionByIdQuery query, CancellationToken cancellationToken)
    {
        try
        {
            StockTransaction? transaction = await _repository.GetStockTransactionByIdAsync(query.Id, cancellationToken);

            if (transaction is null)
            {
                StockTransactionLogWarning.LogStockTransactionNotFound(_logger, query.Id, default);

                return Result<StockTransactionDto>.Failure(
                    new Error(
                        $"StockTransaction with id {query.Id} not found", 
                        ErrorCodes.StockTransactionNotFound));
            }

            StockTransactionDto dto = _mapper.Map<StockTransactionDto>(transaction);

            StockTransactionLogInfo.LogStockTransactionFound(_logger, query.Id, default);
            return Result<StockTransactionDto>.Success(dto);
        }
        catch (Exception ex)
        {
            GeneralLogError.UnhandledException(_logger, ex.Message, ex);
            throw;
        }
    }
}
