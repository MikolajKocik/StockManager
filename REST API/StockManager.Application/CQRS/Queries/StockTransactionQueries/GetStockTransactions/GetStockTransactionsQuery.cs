using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Dtos.ModelsDto.StockTransactionDtos;
using System;

namespace StockManager.Application.CQRS.Queries.StockTransactionQueries.GetStockTransactions;

public sealed record GetStockTransactionsQuery(
    int? InventoryItemId = null,
    string? Type = null,
    DateTime? DateFrom = null,
    DateTime? DateTo = null,
    int Page = 1,
    int PageSize = 10
) : IQuery<IEnumerable<StockTransactionDto>>;
