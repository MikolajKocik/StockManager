using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using StockManager.Application.Common.Logging.StockTransaction;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.CQRS.Commands.StockTransactionCommands;
using StockManager.Application.CQRS.Commands.StockTransactionCommands.AddStockTransaction;
using StockManager.Application.CQRS.Commands.StockTransactionCommands.DeleteStockTransaction;
using StockManager.Application.CQRS.Commands.StockTransactionCommands.EditStockTransaction;
using StockManager.Application.CQRS.Queries.StockTransactionQueries.GetStockTransactionById;
using StockManager.Application.CQRS.Queries.StockTransactionQueries.GetStockTransactions;
using StockManager.Application.Dtos.ModelsDto.StockTransactionDtos;
using StockManager.Application.Extensions.ErrorExtensions;


namespace StockManager.Controllers;

[Authorize]
[ApiController]
[EnableRateLimiting("fixed")]
[Route("api/stock-transactions")]
[ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
[ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status429TooManyRequests)]
public sealed class StockTransactionController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<StockTransactionController> _logger;

    public StockTransactionController(IMediator mediator, ILogger<StockTransactionController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    /// <summary>
    /// Retrieves a list of stock transactions based on the specified filter criteria.
    /// </summary>
    /// <remarks>This method supports filtering by inventory item ID, transaction type, and date range. If no
    /// filters are provided, all stock transactions are returned.</remarks>
    /// <param name="inventoryItemId">The optional ID of the inventory item to filter transactions. If null, transactions for all items are returned.</param>
    /// <param name="type">The optional type of transaction to filter by. If null, all transaction types are included.</param>
    /// <param name="dateFrom">The optional start date to filter transactions. Transactions occurring on or after this date are included.</param>
    /// <param name="dateTo">The optional end date to filter transactions. Transactions occurring on or before this date are included.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>An <see cref="ActionResult{T}"/> containing an <see cref="IEnumerable{T}"/> of <see cref="StockTransactionDto"/>
    /// objects that match the specified criteria.</returns>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<IEnumerable<StockTransactionDto>>> GetStockTransactions(
        [FromQuery] int? inventoryItemId = null,
        [FromQuery] string? type = null,
        [FromQuery] DateTime? dateFrom = null,
        [FromQuery] DateTime? dateTo = null,
        CancellationToken cancellationToken = default)
    {

        var query = new GetStockTransactionsQuery(inventoryItemId, type, dateFrom, dateTo);

        Result<IEnumerable<StockTransactionDto>> result = await _mediator.Send(query, cancellationToken);

        StockTransactionLogInfo.LogReturnedListOfStockTransactions(_logger, default);

        return Ok(new StockTransactionDtoCollection 
        { 
            Data = result.Value!.ToList().AsReadOnly()
        });
    }

    /// <summary>
    /// Retrieves a stock transaction by its unique identifier.
    /// </summary>
    /// <remarks>This method returns a 200 OK response if the stock transaction is found, or a 404 Not Found
    /// response if it is not.</remarks>
    /// <param name="id">The unique identifier of the stock transaction to retrieve.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>An <see cref="ActionResult{T}"/> containing a <see cref="StockTransactionDto"/> if the transaction is found;
    /// otherwise, a <see cref="ProblemDetails"/> with a 404 status code if the transaction does not exist.</returns>
    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<StockTransactionDto?>> GetStockTransactionById([FromRoute] int id, CancellationToken cancellationToken)
    {
        
        Result<StockTransactionDto> result = await _mediator.Send(new GetStockTransactionByIdQuery(id), cancellationToken);

        if (result.IsSuccess)
        {
            StockTransactionLogInfo.LogStockTransactionFound(_logger, id, default);
            return Ok(result.Value);
        }

        var problem = ErrorExtension.ToProblemDetails(result.Error!, 404);

        return new ObjectResult(problem) 
        { 
            StatusCode = problem.Status 
        };
    }

    /// <summary>
    /// Creates a new stock transaction and returns the created transaction details.
    /// </summary>
    /// <remarks>This method uses the mediator pattern to send a command for adding a new stock transaction.
    /// If the transaction is successfully created, it logs the transaction and returns a 201 Created
    /// response.</remarks>
    /// <param name="createDto">The data transfer object containing the details of the stock transaction to be created.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>An <see cref="ActionResult{T}"/> containing the created <see cref="StockTransactionDto"/> if successful. Returns
    /// a <see cref="ProblemDetails"/> object with a 400 status code if the creation fails.</returns>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<StockTransactionDto>> CreateStockTransaction([FromBody] StockTransactionCreateDto createDto, CancellationToken cancellationToken)
    {

        Result<StockTransactionDto> result = await _mediator.Send(new AddStockTransactionCommand(createDto), cancellationToken);

        if (result.IsSuccess)
        {
            StockTransactionDto createdTransaction = result.Value!;
            StockTransactionLogInfo.LogStockTransactionAdjusted(_logger, createdTransaction.Id, default);

            return CreatedAtAction(nameof(GetStockTransactionById), new { id = createdTransaction.Id }, createdTransaction);
        }

        var problem = ErrorExtension.ToProblemDetails(result.Error!, 400);

        return new ObjectResult(problem) 
        { 
            StatusCode = problem.Status
        };
    }

    /// <summary>
    /// Updates an existing stock transaction with the specified details.
    /// </summary>
    /// <param name="id">The unique identifier of the stock transaction to update.</param>
    /// <param name="updateDto">The data transfer object containing the updated transaction details.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>An <see cref="IActionResult"/> indicating the result of the operation. Returns <see
    /// cref="StatusCodes.Status200OK"/> if the update is successful, <see cref="StatusCodes.Status400BadRequest"/> if
    /// the request is invalid, or <see cref="StatusCodes.Status404NotFound"/> if the transaction is not found.</returns>
    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateStockTransaction([FromRoute] int id, [FromBody] StockTransactionUpdateDto updateDto, CancellationToken cancellationToken)
    {
        Result<Unit> result = await _mediator.Send(new EditStockTransactionCommand(id, updateDto), cancellationToken);

        if (result.IsSuccess)
        {
            StockTransactionLogInfo.LogStockTransactionUpdated(_logger, id, default);
            return NoContent();
        }

        return result.Error!.ToActionResult();
    }

    /// <summary>
    /// Deletes a stock transaction identified by the specified ID.
    /// </summary>
    /// <remarks>This method deletes a stock transaction and logs the deletion event. Ensure that the
    /// transaction ID is valid and exists in the system before calling this method.</remarks>
    /// <param name="id">The unique identifier of the stock transaction to delete.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>An <see cref="IActionResult"/> indicating the result of the operation. Returns <see
    /// cref="StatusCodes.Status200OK"/> if the deletion is successful; otherwise, returns <see
    /// cref="StatusCodes.Status404NotFound"/> if the transaction is not found.</returns>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteStockTransaction([FromRoute] int id, CancellationToken cancellationToken)
    {  
        Result<Unit> result = await _mediator.Send(new DeleteStockTransactionCommand(id), cancellationToken);

        if (result.IsSuccess)
        {
            StockTransactionLogInfo.LogStockTransactionDeleted(_logger, id, default);
            return NoContent();
        }

        return result.Error!.ToActionResult();
    }
}
