using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StockManager.Application.Common.Logging.StockTransaction;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.ShipmentDtos;
using StockManager.Application.Dtos.ModelsDto.StockTransactionDtos;
using StockManager.Application.Extensions.CQRS.Query;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.ShipmentEntity;
using StockManager.Core.Domain.Models.StockTransactionEntity;

namespace StockManager.Application.CQRS.Queries.StockTransactionQueries.GetStockTransactions;

public class GetStockTransactionsQueryHandler : IRequestHandler<GetStockTransactionsQuery, Result<IEnumerable<StockTransactionDto>>>
{
    private readonly IStockTransactionRepository _repository;
    private readonly IMapper _mapper;
    private readonly ILogger<GetStockTransactionsQueryHandler> _logger;

    public GetStockTransactionsQueryHandler(IStockTransactionRepository repository, IMapper mapper, ILogger<GetStockTransactionsQueryHandler> logger)
    {
        _repository = repository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<Result<IEnumerable<StockTransactionDto>>> Handle(GetStockTransactionsQuery query, CancellationToken cancellationToken)
    {
        IQueryable<StockTransaction> stockTransactions = _repository.GetStockTransactions()
            .IfHasValue(
                !Equals(query.InventoryItemId, default),
                s => s.InventoryItemId == query.InventoryItemId);

        if (!string.IsNullOrWhiteSpace(query.Type))
        {
            if (Enum.TryParse(query.Type, true, out TransactionType type))
            {
                stockTransactions = stockTransactions.Where(s => s.Type == type);
            }
        }

        if (query.DateFrom.HasValue)
        {
            DateTime from = query.DateFrom.Value.Date;
            stockTransactions = stockTransactions.Where(s => s.Date >= from);
        }

        if (query.DateTo.HasValue)
        {
            DateTime to = query.DateTo.Value.Date.AddDays(1);
            stockTransactions = stockTransactions.Where(s => s.Date < to);
        }

        StockTransactionLogInfo.LogReturnedListOfStockTransactions(_logger, default);

        stockTransactions = stockTransactions.OrderByDescending(s => s.Date).ThenBy(s => s.Id);

        IEnumerable<StockTransactionDto> dtos = await stockTransactions
               .ProjectTo<StockTransactionDto>(_mapper.ConfigurationProvider)
               .Skip((query.Page - 1) * query.PageSize)
               .Take(query.PageSize)
               .ToListAsync(cancellationToken);

        return Result<IEnumerable<StockTransactionDto>>.Success(
            dtos.Any()
            ? dtos
            : Enumerable.Empty<StockTransactionDto>());

    }
}
