using System;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Dtos.ModelsDto.MaintenanceDtos;

namespace StockManager.Application.CQRS.Queries.MaintenanceQueries;

public sealed record GetAssetByIdQuery(Guid Id) : IQuery<MaintenanceAssetDto>;
