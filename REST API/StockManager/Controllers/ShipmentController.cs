using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using StockManager.Application.Common.Logging.General;
using StockManager.Application.Common.Logging.Shipment;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.CQRS.Commands.ShipmentCommands.AddShipment;
using StockManager.Application.CQRS.Commands.ShipmentCommands.CancelShipment;
using StockManager.Application.CQRS.Commands.ShipmentCommands.DeleteShipment;
using StockManager.Application.CQRS.Commands.ShipmentCommands.EditShipment;
using StockManager.Application.CQRS.Commands.ShipmentCommands.MarkAsDelivered;
using StockManager.Application.CQRS.Commands.ShipmentCommands.MarkAsReturned;
using StockManager.Application.CQRS.Queries.ShipmentQueries;
using StockManager.Application.CQRS.Queries.ShipmentQueries.GetShipmentById;
using StockManager.Application.CQRS.Queries.ShipmentQueries.GetShipments;
using StockManager.Application.Dtos.ModelsDto.ShipmentDtos;
using StockManager.Application.Extensions.ErrorExtensions;

namespace StockManager.Controllers;

[Authorize]
[ApiController]
[Route("api/shipments")]
[EnableRateLimiting("fixed")]
[ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
[ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status429TooManyRequests)]
public class ShipmentController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<ShipmentController> _logger;

    public ShipmentController(IMediator mediator, ILogger<ShipmentController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    /// <summary>
    /// Retrieves a list of shipments.
    /// </summary>
    /// <remarks>This method sends a query to retrieve shipment data and returns the result as an HTTP
    /// response.</remarks>
    /// <param name="cancellationToken">A token to monitor for cancellation requests, allowing the operation to be cancelled.</param>
    /// <returns>An <see cref="IActionResult"/> containing the list of shipments.</returns>
    [HttpGet]
    public async Task<IActionResult> GetShipments(
        [FromQuery] int? salesOrderId = null,
        [FromQuery] string? trackingNumber = null,
        [FromQuery] string? status = null,
        [FromQuery] DateTime? shippedDate = null,
        [FromQuery] DateTime? deliveredDate = null, 
        CancellationToken cancellationToken = default
        )
    {
        var query = new GetShipmentsQuery(
            salesOrderId,
            trackingNumber,
            status,
            shippedDate,
            deliveredDate);

        Result<IEnumerable<ShipmentDto>> result = await _mediator.Send(query, cancellationToken);

        ShipmentLogInfo.LogReturnedListOfShipments(_logger, result, default);

        return Ok(new ShipmentDtoCollection 
        {
            Data = result.Value! 
        });
    }

    /// <summary>
    /// Retrieves the shipment details for the specified shipment ID.
    /// </summary>
    /// <param name="id">The unique identifier of the shipment to retrieve.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>An <see cref="IActionResult"/> containing the shipment details if found; otherwise, a NotFound result.</returns>
    [HttpGet("{id}")]
    public async Task<ActionResult<IEnumerable<ShipmentDto>>> GetShipmentById(int id, CancellationToken cancellationToken)
    {
        Result<ShipmentDto> result = await _mediator.Send(new GetShipmentByIdQuery(id), cancellationToken);

        if (result.IsSuccess)
        {
            ShipmentLogInfo.LogShipmentFound(_logger, id, default);
            return Ok(result);
        }

        var problem = ErrorExtension.ToProblemDetails(result.Error!, 404);

        return new ObjectResult(problem)
        {
            StatusCode = problem.Status
        };

    }

    /// <summary>
    /// Creates a new shipment based on the provided command.
    /// </summary>
    /// <param name="command">The command containing the details required to create a shipment. Cannot be <see langword="null"/>.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>An <see cref="IActionResult"/> indicating the result of the operation. Returns a 201 Created response with the
    /// shipment details if successful, or a 400 Bad Request if the command is <see langword="null"/>.</returns>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateShipment([FromBody] ShipmentCreateDto createDto, CancellationToken cancellationToken)
    {
        Result<ShipmentDto> result = await _mediator.Send(new AddShipmentCommand(createDto), cancellationToken);

        if (result.IsSuccess)
        {
            ShipmentLogInfo.LogShipmentCreated(_logger, result.Value!.Id, default);
            return CreatedAtAction(nameof(GetShipmentById), new { id = result.Value.Id }, result);
        }

        return result.Error!.ToActionResult();
    }

    /// <summary>
    /// Updates the shipment details for the specified shipment ID.
    /// </summary>
    /// <param name="id">The unique identifier of the shipment to update.</param>
    /// <param name="command">The command containing the updated shipment details. Must not be null and the ID must match the specified
    /// shipment ID.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>An <see cref="IActionResult"/> indicating the result of the operation. Returns <see cref="NoContentResult"/> if
    /// the update is successful; otherwise, returns <see cref="NotFoundResult"/> if the shipment is not found, or <see
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateShipment([FromRoute] int id, [FromBody] ShipmentUpdateDto shipmentUpdate, CancellationToken cancellationToken)
    {      
        Result<Unit> result = await _mediator.Send(new EditShipmentCommand(id, shipmentUpdate), cancellationToken);

        if (result.IsSuccess)
        {
            ShipmentLogInfo.LogShipmentUpdated(_logger, id, default);
            return NoContent();
        }

        return result.Error!.ToActionResult();
    }

    /// <summary>
    /// Deletes the shipment with the specified identifier.
    /// </summary>
    /// <remarks>This operation is idempotent. If the shipment with the specified identifier does not exist,
    /// the method returns <see cref="NotFoundResult"/> without making any changes.</remarks>
    /// <param name="id">The unique identifier of the shipment to delete.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>An <see cref="IActionResult"/> indicating the result of the operation. Returns <see cref="NoContentResult"/> if
    /// the shipment is successfully deleted; otherwise, <see cref="NotFoundResult"/> if the shipment does not exist.</returns>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteShipment([FromRoute] int id, CancellationToken cancellationToken)
    {
        Result<Unit> result = await _mediator.Send(new DeleteShipmentCommand(id), cancellationToken);

        if (result.IsSuccess)
        {
            ShipmentLogInfo.LogShipmentDeleted(_logger, id, default);
            return NoContent();
        }

        return result.Error!.ToActionResult();
    }

    /// <summary>
    /// Cancels the shipment with the specified identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the shipment to be canceled.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>An <see cref="IActionResult"/> indicating the result of the operation. Returns <see cref="NoContentResult"/> if
    /// the shipment is successfully canceled; otherwise, <see cref="NotFoundResult"/> if the shipment with the
    /// specified identifier does not exist.</returns>
    [HttpPost("{id}/cancel")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> CancelShipment([FromRoute] int id, CancellationToken cancellationToken)
    {
        Result<Unit> result = await _mediator.Send(new CancelShipmentCommand(id), cancellationToken);

        if (result.IsSuccess)
        {
            ShipmentLogInfo.LogShipmentCancelled(_logger, id, default);
            return NoContent();
        }

        return result.Error!.ToActionResult();
    }

    /// <summary>
    /// Marks a shipment as delivered based on the provided command.
    /// </summary>
    /// <param name="id">The identifier of the shipment to be marked as delivered.</param>
    /// <param name="command">The command containing the details required to mark the shipment as delivered. Must not be null and the ID must
    /// match the shipment ID.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>An <see cref="IActionResult"/> indicating the result of the operation. Returns <see cref="NoContentResult"/> if
    /// the operation is successful, or <see cref="NotFoundResult"/> if the shipment is not found.</returns>
    [HttpPost("{id}/mark-delivered")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> MarkShipmentAsDelivered([FromRoute] int id, CancellationToken cancellationToken)
    {
        Result<Unit> result = await _mediator.Send(new MarkShipmentAsDeliveredCommand(id), cancellationToken);

        if (result.IsSuccess)
        {
            ShipmentLogInfo.LogShipmentMarkedDelivered(_logger, id, default);
            return NoContent();
        }

        return result.Error!.ToActionResult();
    }

    /// <summary>
    /// Marks the specified shipment as returned.
    /// </summary>
    /// <remarks>This method sends a command to mark the shipment as returned. Ensure that the shipment ID is
    /// valid and exists in the system.</remarks>
    /// <param name="id">The unique identifier of the shipment to be marked as returned.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>An <see cref="IActionResult"/> indicating the result of the operation. Returns <see cref="NoContentResult"/> if
    /// the shipment is successfully marked as returned; otherwise, <see cref="NotFoundResult"/> if the shipment does
    /// not exist.</returns>
    [HttpPost("{id}/mark-returned")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> MarkShipmentAsReturned([FromRoute] int id, CancellationToken cancellationToken)
    {
        Result<Unit> result = await _mediator.Send(new MarkShipmentAsReturnedCommand(id), cancellationToken);

        if (result.IsSuccess)
        {
            ShipmentLogInfo.LogShipmentMarkedReturned(_logger, id, default);
            return NoContent();
        }

        return result.Error!.ToActionResult();
    }
}
