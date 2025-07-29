using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Dtos.ModelsDto.StockTransactionDtos;

namespace StockManager.Application.CQRS.Queries.StockTransactionQueries.GetStockTransactionById;

public sealed record GetStockTransactionByIdQuery(
    int Id
    ) : IQuery<StockTransactionDto>;
