using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.CQRS.Queries.ShipmentQueries;
using StockManager.Application.CQRS.Queries.ShipmentQueries.GetShipments;
using StockManager.Application.Dtos.ModelsDto.ShipmentDtos;
using StockManager.Application.Extensions.ErrorExtensions;

namespace StockManager.Controllers;

[Authorize]
[ApiController]
[Route("api/shipments")]
[EnableRateLimiting("fixed")]
[ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
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

        return Ok(result);
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
        Result<IEnumerable<ShipmentDto>>? result = await _mediator.Send(new GetShipmentByIdQuery(id), cancellationToken);

        if (result.IsSuccess)
        {
            // log
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
    public async Task<IActionResult> CreateShipment([FromBody] CreateShipmentCommand command, CancellationToken cancellationToken)
    {
        if (command is null)
        {
            _logger.LogError("CreateShipment command is null.");
            return BadRequest(new ProblemDetails { Title = "Invalid request", Detail = "Command cannot be null." });
        }
        var result = await _mediator.Send(command, cancellationToken);
        return CreatedAtAction(nameof(GetShipmentById), new { id = result.Id }, result);
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
    /// cref="BadRequestResult"/> if the command is invalid.</returns>
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateShipment(int id, [FromBody] UpdateShipmentCommand command, CancellationToken cancellationToken)
    {
        if (command is null || command.Id != id)
        {
            _logger.LogError("UpdateShipment command is null or ID mismatch.");
            return BadRequest(new ProblemDetails { Title = "Invalid request", Detail = "Command cannot be null and ID must match." });
        }
        var result = await _mediator.Send(command, cancellationToken);
        return result ? NoContent() : NotFound();
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
    public async Task<IActionResult> DeleteShipment(int id, CancellationToken cancellationToken)
    {
        var command = new DeleteShipmentCommand(id);
        var result = await _mediator.Send(command, cancellationToken);
        return result ? NoContent() : NotFound();
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
    public async Task<IActionResult> CancelShipment(int id, CancellationToken cancellationToken)
    {
        var command = new CancelShipmentCommand(id);
        var result = await _mediator.Send(command, cancellationToken);
        return result ? NoContent() : NotFound();
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
    public async Task<IActionResult> MarkShipmentAsDelivered(int id, [FromBody] MarkShipmentAsDeliveredCommand command, CancellationToken cancellationToken)
    {
        if (command is null || command.Id != id)
        {
            _logger.LogError("MarkShipmentAsDelivered command is null or ID mismatch.");
            return BadRequest(new ProblemDetails { Title = "Invalid request", Detail = "Command cannot be null and ID must match." });
        }
        var result = await _mediator.Send(command, cancellationToken);
        return result ? NoContent() : NotFound();
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
    public async Task<IActionResult> MarkShipmentAsReturned(int id, CancellationToken cancellationToken)
    {
        var command = new MarkShipmentAsReturnedCommand(id);
        var result = await _mediator.Send(command, cancellationToken);
        return result ? NoContent() : NotFound();
    }
}
