using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Common.Logging.General;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.MaintenanceDtos;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.MaintenanceIncidentEntity;

namespace StockManager.Application.CQRS.Queries.MaintenanceQueries;

public sealed class GetIncidentsQueryHandler(
        IMaintenanceIncidentRepository repository,
        IMapper mapper,
        ILogger<GetIncidentsQueryHandler> logger
    ) : IQueryHandler<GetIncidentsQuery, IReadOnlyList<MaintenanceIncidentDto>>
{
    private readonly IMaintenanceIncidentRepository _repository = repository;
    private readonly IMapper _mapper = mapper;
    private readonly ILogger<GetIncidentsQueryHandler> _logger = logger;

    public async Task<Result<IReadOnlyList<MaintenanceIncidentDto>>> Handle(GetIncidentsQuery query, CancellationToken ct)
    {
        IQueryable<MaintenanceIncident> incidentsQuery = _repository.GetIncidents();

        if (!string.IsNullOrWhiteSpace(query.Status))
        {
            if (Enum.TryParse<IncidentStatus>(query.Status, true, out IncidentStatus statusEnum))
            {
                incidentsQuery = incidentsQuery.Where(i => i.Status == statusEnum);
            }
            else
            {
                GeneralLogError.InvalidOperationException(
                    _logger,
                    $"Invalid status filter value: {query.Status}.",
                    default
                );

                return Result<IReadOnlyList<MaintenanceIncidentDto>>.Failure(
                    new Error(
                        "Invalid status filter value.",
                        ErrorCodes.GeneralBadRequest
                    )
                );
            }
        }

        if (!string.IsNullOrWhiteSpace(query.Priority))
        {
             if (Enum.TryParse<IncidentPriority>(query.Priority, true, out IncidentPriority priorityEnum))
            {
                incidentsQuery = incidentsQuery.Where(i => i.Priority == priorityEnum);
            }
            else
            {
                GeneralLogError.InvalidOperationException(
                    _logger,
                    $"Invalid priority filter value: {query.Priority}.",
                    default
                );

                return Result<IReadOnlyList<MaintenanceIncidentDto>>.Failure(
                    new Error(
                        "Invalid priority filter value.",
                        ErrorCodes.GeneralBadRequest
                    )
                );
            }
        }

        List<MaintenanceIncident> incidents = await incidentsQuery
            .OrderByDescending(i => i.CreatedAt)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync(ct);

        List<MaintenanceIncidentDto> dtos = _mapper.Map<List<MaintenanceIncidentDto>>(incidents);
        return Result<IReadOnlyList<MaintenanceIncidentDto>>.Success(dtos);
    }
}
