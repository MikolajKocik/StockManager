using AutoMapper;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.MaintenanceDtos;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.MaintenanceIncidentEntity;


namespace StockManager.Application.CQRS.Queries.MaintenanceQueries;

public sealed class GetIncidentByIdQueryHandler : IQueryHandler<GetIncidentByIdQuery, MaintenanceIncidentDto>
{
    private readonly IMaintenanceIncidentRepository _incidentRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<GetIncidentByIdQueryHandler> _logger;

    public GetIncidentByIdQueryHandler(
        IMaintenanceIncidentRepository incidentRepository,
        IMapper mapper,
        ILogger<GetIncidentByIdQueryHandler> logger)
    {
        _incidentRepository = incidentRepository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<Result<MaintenanceIncidentDto>> Handle(GetIncidentByIdQuery query, CancellationToken cancellationToken)
    {
        try
        {
            MaintenanceIncident incident = await _incidentRepository.GetIncidentWithDetailsByIdAsync(query.Id, cancellationToken);

            if (incident == null)
            {
                return Result<MaintenanceIncidentDto>.Failure(
                    new Error($"Maintenance incident with ID {query.Id} was not found.", ErrorCodes.MaintenanceIncidentNotFound));
            }

            MaintenanceIncidentDto dto = _mapper.Map<MaintenanceIncidentDto>(incident);
            return Result<MaintenanceIncidentDto>.Success(dto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to retrieve maintenance incident {IncidentId}: {Message}", query.Id, ex.Message);
            throw;
        }
    }
}
