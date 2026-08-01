using AutoMapper;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Common.Logging.StockTransaction;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.StockTransactionDtos;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.StockTransactionEntity;

namespace StockManager.Application.CQRS.Queries.StockTransactionQueries.GetStockTransactionById;

public sealed class GetStockTransactionByIdQueryHandler(
        IStockTransactionRepository repository,
        IMapper mapper,
        ILogger<GetStockTransactionByIdQueryHandler> logger
    ) : IQueryHandler<GetStockTransactionByIdQuery, StockTransactionDto>
{
    private readonly IStockTransactionRepository _repository = repository;
    private readonly IMapper _mapper = mapper;
    private readonly ILogger<GetStockTransactionByIdQueryHandler> _logger = logger;

    public async Task<Result<StockTransactionDto>> Handle(GetStockTransactionByIdQuery query, CancellationToken ct)
    {
        StockTransaction? transaction = await _repository.GetStockTransactionByIdAsync(query.Id, ct);

        if (transaction is null)
        {
            StockTransactionLogWarning.LogStockTransactionNotFound(_logger, query.Id, default);

            return Result<StockTransactionDto>.Failure(
                new Error(
                    $"StockTransaction with id {query.Id} not found",
                    ErrorCodes.StockTransactionNotFound
                )
            );
        }

        StockTransactionDto dto = _mapper.Map<StockTransactionDto>(transaction);

        StockTransactionLogInfo.LogStockTransactionFound(_logger, query.Id, default);
        return Result<StockTransactionDto>.Success(dto);
    }
}
