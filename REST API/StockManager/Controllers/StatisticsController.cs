using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StockManager.Application.CQRS.Queries.StatisticsQueries;
using StockManager.Application.Dtos.StatisticsDtos;
using StockManager.Core.Domain.Interfaces.Services;
using MediatR;

namespace StockManager.Controllers;

[ApiController]
[Authorize]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/statistics")]
[ProducesResponseType(StatusCodes.Status200OK)]
public sealed class StatisticsController : ControllerBase
{
    private readonly ISystemStatisticsService _statisticsService;
    private readonly IMediator _mediator;

    public StatisticsController(ISystemStatisticsService statisticsService, IMediator mediator)
    {
        _statisticsService = statisticsService;
        _mediator = mediator;
    }

    [HttpGet("summary")]
    public IActionResult GetSummary()
    {
        return Ok(new
        {
            totalApiRequests = _statisticsService.TotalApiRequests,
            processedOperations = _statisticsService.ProcessedOperations,
            timestamp = DateTime.UtcNow
        });
    }

    [HttpGet("operations-trend")]
    public async Task<IActionResult> GetOperationsTrend([FromQuery] int days = 30, CancellationToken ct = default)
    {
        var result = await _mediator.Send(new GetOperationsTrendQuery(days), ct);
        return Ok(result.Value);
    }

    [HttpGet("stock-distribution")]
    public async Task<IActionResult> GetStockDistribution(CancellationToken ct = default)
    {
        var result = await _mediator.Send(new GetStockDistributionQuery(), ct);
        return Ok(result.Value);
    }
}
