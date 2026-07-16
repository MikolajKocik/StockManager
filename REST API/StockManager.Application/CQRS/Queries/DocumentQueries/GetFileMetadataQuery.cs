using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Core.Domain.Models.WarehouseOperationEntity;

namespace StockManager.Application.CQRS.Queries.DocumentQueries;

public sealed record GetFileMetadataQuery(int Page = 1, int PageSize = 50) 
    : IQuery<IReadOnlyList<FileMetadata>>;
