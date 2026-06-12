using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Dtos.ModelsDto.MaintenanceDtos;

namespace StockManager.Application.CQRS.Queries.MaintenanceQueries;

public sealed record GetIncidentsQuery(string? Status = null, string? Priority = null) : IQuery<List<MaintenanceIncidentDto>>;
