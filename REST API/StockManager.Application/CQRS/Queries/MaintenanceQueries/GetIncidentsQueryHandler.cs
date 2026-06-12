using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.MaintenanceDtos;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Enums;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.MaintenanceIncidentEntity;

namespace StockManager.Application.CQRS.Queries.MaintenanceQueries;

public sealed class GetIncidentsQueryHandler : IQueryHandler<GetIncidentsQuery, List<MaintenanceIncidentDto>>
{
    private readonly IMaintenanceIncidentRepository _repository;
    private readonly IMapper _mapper;
    private readonly ILogger<GetIncidentsQueryHandler> _logger;

    public GetIncidentsQueryHandler(
        IMaintenanceIncidentRepository repository,
        IMapper mapper,
        ILogger<GetIncidentsQueryHandler> logger)
    {
        _repository = repository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<Result<List<MaintenanceIncidentDto>>> Handle(GetIncidentsQuery query, CancellationToken cancellationToken)
    {
        try
        {
            IQueryable<MaintenanceIncident> incidentsQuery = _repository.GetIncidents()
                .Include(i => i.ReportedBy)
                .Include(i => i.AssignedTo)
                .Include(i => i.Asset)
                .Include(i => i.BinLocation)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(query.Status))
            {
                if (Enum.TryParse<IncidentStatus>(query.Status, true, out IncidentStatus statusEnum))
                {
                    incidentsQuery = incidentsQuery.Where(i => i.Status == statusEnum);
                }
                else
                {
                    return Result<List<MaintenanceIncidentDto>>.Failure(
                        new Error("Invalid status filter value.", ErrorCodes.GeneralBadRequest));
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
                    return Result<List<MaintenanceIncidentDto>>.Failure(
                        new Error("Invalid priority filter value.", ErrorCodes.GeneralBadRequest));
                }
            }

            List<MaintenanceIncident> incidents = await incidentsQuery
                .OrderByDescending(i => i.CreatedAt)
                .ToListAsync(cancellationToken);

            List<MaintenanceIncidentDto> dtos = _mapper.Map<List<MaintenanceIncidentDto>>(incidents);
            return Result<List<MaintenanceIncidentDto>>.Success(dtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while fetching maintenance incidents: {Message}", ex.Message);
            throw;
        }
    }
}
