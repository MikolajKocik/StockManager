using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.Extensions.Logging;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.CQRS.Commands.MaintenanceCommands;
using StockManager.Application.CQRS.Queries.MaintenanceQueries;
using StockManager.Application.Dtos.ModelsDto.MaintenanceDtos;
using StockManager.Application.Extensions.ErrorExtensions;

namespace StockManager.Controllers;

[Authorize]
[ApiController]
[EnableRateLimiting("fixed")]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/maintenance")]
[ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
[ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status429TooManyRequests)]
public sealed class MaintenanceController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<MaintenanceController> _logger;

    public MaintenanceController(IMediator mediator, ILogger<MaintenanceController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    [HttpGet("assets")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetAssets(
        [FromQuery] string? type = null,
        [FromQuery] string? status = null,
        CancellationToken cancellationToken = default)
    {
        var query = new GetAssetsQuery(type, status);
        Result<List<MaintenanceAssetDto>> result = await _mediator.Send(query, cancellationToken);

        if (result.IsSuccess)
        {
            return Ok(result.Value);
        }

        return result.Error!.ToActionResult();
    }

    [HttpGet("assets/{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetAssetById(
        [FromRoute] Guid id,
        CancellationToken cancellationToken = default)
    {
        var query = new GetAssetByIdQuery(id);
        Result<MaintenanceAssetDto> result = await _mediator.Send(query, cancellationToken);

        if (result.IsSuccess)
        {
            return Ok(result.Value);
        }

        return result.Error!.ToActionResult();
    }

    [HttpGet("incidents")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GetIncidents(
        [FromQuery] string? status = null,
        [FromQuery] string? priority = null,
        CancellationToken cancellationToken = default)
    {
        var query = new GetIncidentsQuery(status, priority);
        Result<List<MaintenanceIncidentDto>> result = await _mediator.Send(query, cancellationToken);

        if (result.IsSuccess)
        {
            return Ok(result.Value);
        }

        return result.Error!.ToActionResult();
    }

    [HttpGet("incidents/{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetIncidentById(
        [FromRoute] int id,
        CancellationToken cancellationToken = default)
    {
        var query = new GetIncidentByIdQuery(id);
        Result<MaintenanceIncidentDto> result = await _mediator.Send(query, cancellationToken);

        if (result.IsSuccess)
        {
            return Ok(result.Value);
        }

        return result.Error!.ToActionResult();
    }

    [HttpPost("incidents")]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> ReportIncident(
        [FromBody] ReportIncidentDto createDto,
        CancellationToken cancellationToken = default)
    {
        string? userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var command = new ReportIncidentCommand(createDto, userId);
        Result<MaintenanceIncidentDto> result = await _mediator.Send(command, cancellationToken);

        if (result.IsSuccess)
        {
            return CreatedAtAction(nameof(GetIncidentById), new { id = result.Value!.Id }, result.Value);
        }

        return result.Error!.ToActionResult();
    }

    [HttpPost("incidents/{id:int}/assign")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> AssignIncident(
        [FromRoute] int id,
        [FromBody] AssignIncidentDto assignDto,
        CancellationToken cancellationToken = default)
    {
        var command = new AssignIncidentCommand(id, assignDto.AssignedToId);
        Result<MaintenanceIncidentDto> result = await _mediator.Send(command, cancellationToken);

        if (result.IsSuccess)
        {
            return Ok(result.Value);
        }

        return result.Error!.ToActionResult();
    }

    [HttpPost("incidents/{id:int}/resolve")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> ResolveIncident(
        [FromRoute] int id,
        [FromBody] ResolveIncidentDto resolveDto,
        CancellationToken cancellationToken = default)
    {
        var command = new ResolveIncidentCommand(id, resolveDto);
        Result<MaintenanceIncidentDto> result = await _mediator.Send(command, cancellationToken);

        if (result.IsSuccess)
        {
            return Ok(result.Value);
        }

        return result.Error!.ToActionResult();
    }
}
