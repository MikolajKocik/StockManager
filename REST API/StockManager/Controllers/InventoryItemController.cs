using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using StockManager.Application.Common.Logging.InventoryItem;
using StockManager.Application.Common.Logging.Product;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.CQRS.Commands.InventoryItemCommands.AddInventoryItem;
using StockManager.Application.CQRS.Commands.InventoryItemCommands.AddProductToInventoryItem;
using StockManager.Application.CQRS.Commands.InventoryItemCommands.AssignToBinLocation;
using StockManager.Application.CQRS.Commands.InventoryItemCommands.DecreaseQuantity;
using StockManager.Application.CQRS.Commands.InventoryItemCommands.DeleteInventoryItem;
using StockManager.Application.CQRS.Commands.InventoryItemCommands.EditInventoryItem;
using StockManager.Application.CQRS.Commands.InventoryItemCommands.IncreaseQuantity;
using StockManager.Application.CQRS.Commands.InventoryItemCommands.ReleaseQuantity;
using StockManager.Application.CQRS.Commands.InventoryItemCommands.ReserveQuantity;
using StockManager.Application.CQRS.Commands.ProductCommands.AddProduct;
using StockManager.Application.CQRS.Queries.InventoryItemQueries.GetInventoryItemById;
using StockManager.Application.CQRS.Queries.InventoryItemQueries.GetInventoryItems;
using StockManager.Application.Dtos.ModelsDto.InventoryItemDtos;
using StockManager.Application.Dtos.ModelsDto.ProductDtos;
using StockManager.Application.Extensions.ErrorExtensions;

namespace StockManager.Controllers;

[ApiController]
[Authorize]
[EnableRateLimiting("fixed")]
[Route("api/inventory-items")]
[ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
[ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status429TooManyRequests)]
public sealed class InventoryItemController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<InventoryItemController> _logger;

    public InventoryItemController(IMediator mediator, ILogger<InventoryItemController> logger)
    {
        _logger = logger;
        _mediator = mediator;
    }

    /// <summary>
    /// Retrieves a paginated list of inventory items based on specified filter criteria.
    /// </summary>
    /// <remarks>This method supports filtering by product name, bin location, warehouse, and various quantity
    /// metrics. If no filters are specified, all inventory items are returned. Pagination is supported through the
    /// <paramref name="pageNumber"/> and <paramref name="pageSize"/> parameters.</remarks>
    /// <param name="productName">The name of the product to filter the inventory items. Can be null to include all products.</param>
    /// <param name="binLocationCode">The bin location code to filter the inventory items. Can be null to include all locations.</param>
    /// <param name="warehouse">The warehouse identifier to filter the inventory items. Can be null to include all warehouses.</param>
    /// <param name="quantityAvailable">The minimum quantity available to filter the inventory items. Can be null to include all quantities.</param>
    /// <param name="quantityOnHand">The minimum quantity on hand to filter the inventory items. Can be null to include all quantities.</param>
    /// <param name="quantityReserved">The minimum quantity reserved to filter the inventory items. Can be null to include all quantities.</param>
    /// <param name="pageNumber">The page number for pagination. Must be greater than zero. Defaults to 1.</param>
    /// <param name="pageSize">The number of items per page for pagination. Must be greater than zero. Defaults to 10.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>An <see cref="ActionResult"/> containing a collection of <see cref="InventoryItemDto"/> that match the filter
    /// criteria.</returns>

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<InventoryItemDto>> GetInventoryItems(
        [FromQuery] string? productName = null,
        [FromQuery] string? binLocationCode = null,
        [FromQuery] string? warehouse = null,
        [FromQuery] decimal? quantityAvailable = null,
        [FromQuery] decimal? quantityOnHand = null,
        [FromQuery] decimal? quantityReserved = null,
        CancellationToken cancellationToken = default
        )
    {
        var query = new GetInventoryItemsQuery(
            productName,
            binLocationCode,
            warehouse,
            quantityAvailable,
            quantityOnHand,
            quantityReserved
            );

        Result<IEnumerable<InventoryItemDto>> result = await _mediator.Send(query, cancellationToken);

        InventoryItemLogInfo.LogReturningListOfInventoryItemSuccessfull(_logger, result, default);

        return Ok(new InventoryItemsDtoCollection
        {
            Data = result.Value!
        });
    }

    /// <summary>
    /// Retrieves an inventory item by its unique identifier.
    /// </summary>
    /// <remarks>This method returns a 200 OK response with the inventory item if it exists, or a 404 Not
    /// Found response if the item does not exist.</remarks>
    /// <param name="id">The unique identifier of the inventory item to retrieve.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>An <see cref="ActionResult{T}"/> containing the inventory item if found; otherwise, a 404 Not Found response.</returns>

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [Route("{id}")]
    public async Task<ActionResult<InventoryItemDto>> GetInventoryItemById(
        [FromRoute] int id,
        CancellationToken cancellationToken = default
        )
    {
        Result<InventoryItemDto> result = await _mediator.Send(new GetInventoryItemByIdQuery(id), cancellationToken);

        if (result.IsSuccess)
        {
            InventoryItemLogInfo.LogInventoryItemFoundSuccess(_logger, id, default);
            return Ok(result.Value);
        }

        var problem = ErrorExtension.ToProblemDetails(result.Error!, 404);

        InventoryItemLogWarning.LogInventoryItemNotFound(_logger, id, default);

        return new ObjectResult(problem)
        {
            StatusCode = problem.Status
        };
    }

    /// <summary>
    /// Adds a new product to the inventory.
    /// </summary>
    /// <remarks>This method creates a new inventory item based on the provided <paramref name="createDto"/>
    /// and returns a 201 Created response upon success. If the operation fails, a 400 Bad Request response is returned
    /// with details of the error.</remarks>
    /// <param name="createDto">The data transfer object containing the details of the product to be added.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>An <see cref="ActionResult{T}"/> containing the created <see cref="InventoryItemDto"/> if successful; otherwise,
    /// a <see cref="ProblemDetails"/> object describing the error.</returns>

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<InventoryItemDto>> AddInventoryItem([FromBody] InventoryItemCreateDto createDto, CancellationToken cancellationToken)
    {

        Result<InventoryItemDto> result = await _mediator.Send(new AddInventoryItemCommand(createDto), cancellationToken);

        if (result.IsSuccess)
        {
            InventoryItemDto createdInventoryItem = result.Value!;
            InventoryItemLogInfo.LogAddInventoryItemSuccesfull(
                _logger,
                createdInventoryItem.Id,
                createdInventoryItem.ProductId,
                createdInventoryItem.BinLocationCode!,
                default
                );

            return CreatedAtAction(nameof(GetInventoryItemById), new { id = createdInventoryItem.Id }, createdInventoryItem);
        }

        var problem = ErrorExtension.ToProblemDetails(result.Error!, 400);

        return new ObjectResult(problem)
        {
            StatusCode = problem.Status
        };
    }

    /// <summary>
    /// Edits an existing inventory item.
    /// </summary>
    /// <remarks>This method updates the details of an existing inventory item identified by its unique
    /// <paramref name="id"/>. The updated inventory item is provided in the request body as a
    /// <paramref name="updateDto"/>. Returns a 204 No Content response upon successful update, or a 404 Not
    /// Found response if the inventory item does not exist.</remarks>
    /// <param name="id">The unique identifier of the inventory item to update.</param>
    /// <param name="updateDto">The data transfer object containing the updated details of the inventory item.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>A Task representing the asynchronous operation, with a result of IActionResult indicating the
    /// outcome of the edit operation.</returns>

    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> EditInventoryItem(
        [FromRoute] int id,
        [FromBody] InventoryItemUpdateDto updateDto,
        CancellationToken cancellationToken = default)
    {
        Result<Unit> result = await _mediator.Send(new EditInventoryItemCommand(id, updateDto), cancellationToken);
        if (result.IsSuccess)
        {
            InventoryItemLogInfo.LogInventoryItemModifiedSuccess(_logger, id, default);
            return NoContent();
        }
        return result.Error!.ToActionResult();
    }

    /// <summary>
    /// Deletes an inventory item by its unique identifier.
    /// </summary>
    /// <remarks>This method removes an inventory item from the system. A 204 No Content response is returned upon
    /// successful deletion. If the inventory item does not exist, a 404 Not Found response is returned.</remarks>
    /// <param name="id">The unique identifier of the inventory item to delete.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>A Task representing the asynchronous operation, with a result of IActionResult indicating the
    /// outcome of the delete operation.</returns>

    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteInventoryItem([FromRoute] int id, CancellationToken cancellationToken = default)
    {
        Result<Unit> result = await _mediator.Send(new DeleteInventoryItemCommand(id), cancellationToken);
        if (result.IsSuccess)
        {
            InventoryItemLogInfo.LogInventoryItemDeletedSuccess(_logger, id, default);
            return NoContent();
        }
        InventoryItemLogWarning.LogInventoryItemNotFound(_logger, id, default);
        return result.Error!.ToActionResult();
    }

    /// <summary>
    /// Increases the quantity of an inventory item.
    /// </summary>
    /// <remarks>This method increases the quantity of the inventory item identified by its unique
    /// <paramref name="id"/>. The amount to increase the quantity by is provided in the request body.
    /// Returns a 200 OK response with the updated inventory item if successful, or a 404 Not Found response
    /// if the inventory item does not exist.</remarks>
    /// <param name="id">The unique identifier of the inventory item whose quantity is to be increased.</param>
    /// <param name="amount">The amount by which to increase the inventory item's quantity.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>A Task representing the asynchronous operation, with a result of IActionResult indicating the
    /// outcome of the increase quantity operation.</returns>

    [HttpPost("{id}/increase-quantity")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> IncreaseQuantity([FromRoute] int id, [FromBody] decimal amount, CancellationToken cancellationToken)
    {
        Result<InventoryItemDto> result = await _mediator.Send(new IncreaseInventoryItemQuantityCommand(id, amount), cancellationToken);
        if (result.IsSuccess)
        {
            InventoryItemLogInfo.LogInventoryItemQuantityIncreased(_logger, id, amount, default);
            return Ok(result.Value);
        }
        return result.Error!.ToActionResult();
    }

    /// <summary>
    /// Decreases the quantity of an inventory item by a specified amount.
    /// </summary>
    /// <param name="id">The unique identifier of the inventory item to decrease.</param>
    /// <param name="amount">The amount by which to decrease the inventory item's quantity. Must be a positive value.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>An <see cref="IActionResult"/> representing the result of the operation. Returns a 200 OK status with the
    /// updated inventory item if successful, or a 404 Not Found status if the item does not exist.</returns>

    [HttpPost("{id}/decrease-quantity")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DecreaseQuantity([FromRoute] int id, [FromBody] decimal amount, CancellationToken cancellationToken)
    {
        Result<InventoryItemDto> result = await _mediator.Send(new DecreaseInventoryItemQuantityCommand(id, amount), cancellationToken);
        if (result.IsSuccess)
        {
            InventoryItemLogInfo.LogInventoryItemQuantityDecreased(_logger, id, amount, default);
            return Ok(result.Value);
        }
        return result.Error!.ToActionResult();
    }

    /// <summary>
    /// Assigns an inventory item to a new bin location.
    /// </summary>
    /// <remarks>This method updates the bin location of an existing inventory item identified by its unique
    /// <paramref name="id"/>. The new bin location ID must be provided in the request body. Returns a 200 OK
    /// response with the updated inventory item if successful, or a 404 Not Found response if the inventory
    /// item does not exist.</remarks>
    /// <param name="id">The unique identifier of the inventory item to assign to a new bin location.</param>
    /// <param name="newBinLocationId">The ID of the new bin location to assign to the inventory item.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>A Task representing the asynchronous operation, with a result of IActionResult indicating the
    /// outcome of the assign operation.</returns>

    [HttpPost("{id}/assign-bin-location")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> AssignToBinLocation([FromRoute] int id, [FromBody] int newBinLocationId, CancellationToken cancellationToken)
    {
        Result<InventoryItemDto> result = await _mediator.Send(new AssignInventoryItemToBinLocationCommand(id, newBinLocationId), cancellationToken);
        if (result.IsSuccess)
        {
            InventoryItemLogInfo.LogInventoryItemAssignedToBinLocation(_logger, id, newBinLocationId, default);
            return Ok(result.Value);
        }
        return result.Error!.ToActionResult();
    }

    /// <summary>
    /// Reserves a specified quantity of an inventory item.
    /// </summary>
    /// <param name="id">The unique identifier of the inventory item to reserve.</param>
    /// <param name="amount">The quantity of the inventory item to reserve. Must be a positive value.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>An <see cref="IActionResult"/> indicating the result of the operation. Returns a 200 OK response with the
    /// updated inventory item details if successful, or a 404 Not Found response if the item does not exist.</returns>
    [HttpPost("{id}/reserve-quantity")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ReserveQuantity([FromRoute] int id, [FromBody] decimal amount, CancellationToken cancellationToken)
    {
        Result<InventoryItemDto> result = await _mediator.Send(new ReserveInventoryItemQuantityCommand(id, amount), cancellationToken);
        if (result.IsSuccess)
        {
            InventoryItemLogInfo.LogInventoryItemQuantityReserved(_logger, id, amount, default);
            return Ok(result.Value);
        }
        return result.Error!.ToActionResult();
    }

    /// <summary>
    /// Adds a product to an inventory item specified by the given identifier.
    /// </summary>
    /// <param name="id">The identifier of the inventory item to which the product will be added.</param>
    /// <param name="productDto">The product details to be added to the inventory item.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>An <see cref="IActionResult"/> indicating the result of the operation. Returns the added product details if
    /// successful, or a problem details response if the inventory item is not found.</returns>

    [HttpPost("{id}/add-product-to-inventory-item")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> AddProductToInventoryItem([FromRoute] int id, [FromBody] ProductDto productDto, CancellationToken cancellationToken)
    {
        Result<ProductDto> result = await _mediator.Send(new AddProductToInventoryItemCommand(id, productDto), cancellationToken);
        if (result.IsSuccess)
        {
            InventoryItemLogInfo.LogAddProductToInventoryItemSuccess(_logger, id, result.Value!.Id, default);
            return Ok(result.Value);
        }
        return result.Error!.ToActionResult();
    }

    /// <summary>
    /// Releases a specified quantity of an inventory item.
    /// </summary>
    /// <param name="id">The unique identifier of the inventory item to release quantity from.</param>
    /// <param name="amount">The amount of quantity to release from the inventory item. Must be a positive value.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>An <see cref="IActionResult"/> indicating the result of the operation. Returns the updated inventory item if
    /// successful, or a <see cref="ProblemDetails"/> if the item is not found.</returns>
    [HttpPost("{id}/release-quantity")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ReleaseQuantity([FromRoute] int id, [FromBody] decimal amount, CancellationToken cancellationToken)
    {
        Result<InventoryItemDto> result = await _mediator.Send(new ReleaseInventoryItemQuantityCommand(id, amount), cancellationToken);
        if (result.IsSuccess)
        {
            InventoryItemLogInfo.LogInventoryItemQuantityReleased(_logger, id, amount, default);
            return Ok(result.Value);
        }
        return result.Error!.ToActionResult();
    }

}
