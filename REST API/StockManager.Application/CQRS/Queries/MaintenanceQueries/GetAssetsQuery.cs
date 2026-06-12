using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Dtos.ModelsDto.MaintenanceDtos;

namespace StockManager.Application.CQRS.Queries.MaintenanceQueries;

public sealed record GetAssetsQuery(string? Type = null, string? Status = null) : IQuery<List<MaintenanceAssetDto>>;
