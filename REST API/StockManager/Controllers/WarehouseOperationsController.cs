using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using StockManager.Application.CQRS.Commands.WarehouseOperationCommands;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.WarehouseOperationDtos;
using StockManager.Application.CQRS.Queries.WarehouseOperationQueries;

namespace StockManager.Controllers;

[ApiController]
[Authorize]
[EnableRateLimiting("fixed")]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/warehouse-operations")]
[ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
[ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status429TooManyRequests)]
public sealed class WarehouseOperationsController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<WarehouseOperationsController> _logger;

    public WarehouseOperationsController(IMediator mediator, ILogger<WarehouseOperationsController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    /// <summary>
    /// Creates a new warehouse operation (PZ, WZ, RW, MM).
    /// </summary>
    /// <param name="command">The details of the operation to create.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>The created warehouse operation details.</returns>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] CreateWarehouseOperationCommand command, CancellationToken cancellationToken)
    {
        Result<WarehouseOperationDto> result = await _mediator.Send(command, cancellationToken);

        if (result.IsSuccess)
        {
            return Ok(result.Value);
        }

        return BadRequest(result.Error);
    }

    /// <summary>
    /// Retrieves all warehouse operations.
    /// </summary>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>A list of warehouse operations.</returns>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> Get(CancellationToken cancellationToken)
    {
        Result<List<WarehouseOperationDto>> result = await _mediator.Send(new GetWarehouseOperationsQuery(), cancellationToken);

        if (result.IsSuccess)
        {
            return Ok(result.Value);
        }

        return BadRequest(result.Error);
    }
}
