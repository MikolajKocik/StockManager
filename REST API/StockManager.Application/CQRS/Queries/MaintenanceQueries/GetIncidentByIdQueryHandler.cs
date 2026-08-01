using AutoMapper;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Common.Logging.General;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.MaintenanceDtos;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.MaintenanceIncidentEntity;

namespace StockManager.Application.CQRS.Queries.MaintenanceQueries;

public sealed class GetIncidentByIdQueryHandler(
        IMaintenanceIncidentRepository incidentRepository,
        IMapper mapper,
        ILogger<GetIncidentByIdQueryHandler> logger
    ) : IQueryHandler<GetIncidentByIdQuery, MaintenanceIncidentDto>
{
    private readonly IMaintenanceIncidentRepository _incidentRepository = incidentRepository;
    private readonly IMapper _mapper = mapper;
    private readonly ILogger<GetIncidentByIdQueryHandler> _logger = logger;

    public async Task<Result<MaintenanceIncidentDto>> Handle(GetIncidentByIdQuery query, CancellationToken ct)
    { 
        MaintenanceIncident incident = await _incidentRepository.GetIncidentWithDetailsByIdAsync(query.Id, ct);

        if (incident == null)
        {
            GeneralLogError.ArgumentException(
                _logger,
                $"Maintenance incident with ID {query.Id} was not found.",
                default
            );

            return Result<MaintenanceIncidentDto>.Failure(
                new Error(
                    $"Maintenance incident with ID {query.Id} was not found.",
                    ErrorCodes.MaintenanceIncidentNotFound
                )
            );
        }

        MaintenanceIncidentDto dto = _mapper.Map<MaintenanceIncidentDto>(incident);
        return Result<MaintenanceIncidentDto>.Success(dto);        
    }
}
