using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using StockManager.Application.Common.Logging.InventoryItem;
using StockManager.Application.Common.Logging.Product;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.CQRS.Commands.ProductCommands.AddProduct;
using StockManager.Application.CQRS.Commands.ProductCommands.DeleteProduct;
using StockManager.Application.CQRS.Commands.ProductCommands.EditProduct;
using StockManager.Application.CQRS.Commands.ProductCommands.TrackProductView;
using StockManager.Application.CQRS.Queries.ProductQueries.GetProductById;
using StockManager.Application.CQRS.Queries.ProductQueries.GetProducts;
using StockManager.Application.Dtos.ModelsDto.ProductDtos;
using StockManager.Application.Extensions.ErrorExtensions;
using StockManager.Core.Domain.Enums;

namespace StockManager.Controllers;

[Authorize]
[ApiController]
[EnableRateLimiting("fixed")]
[Route("api/products")]
[ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
[ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status429TooManyRequests)]
public sealed class ProductController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<ProductController> _logger;

    public ProductController(IMediator mediator, ILogger<ProductController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    /// <summary>
    /// HttpGet action, where is queryable by different parameters.
    /// If no parameters are provided returns all products.
    /// </summary>
    /// <param name="name">product name</param>
    /// <param name="genre">product's genre</param>
    /// <param name="warehouse">product's warehouse</param>
    /// <param name="unit">unit of product</param>
    /// <param name="expirationDate">product expiration date</param>
    /// <param name="deliveredAt">product delivery date</param>
    /// <param name="cancellationToken">operation can be cancelled</param>
    /// <returns>Query or all products</returns>

    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<ProductDtoCollection>> GetProducts(
        [FromQuery] string? name = null,
        [FromQuery] string? warehouse = null,
        [FromQuery] string? genre = null,
        [FromQuery] string? unit = null,
        [FromQuery] DateTime? expirationDate = null,
        [FromQuery] DateTime? deliveredAt = null,
        CancellationToken cancellationToken = default)
    {
        var query = new GetProductsQuery(
            name,
            warehouse, 
            genre, 
            unit, 
            expirationDate,
            deliveredAt);

        Result<IEnumerable<ProductDto>> result = await _mediator.Send(query, cancellationToken);

        ProductLogInfo.LogReturningListOfProductSuccessfull(_logger, result, default);

        return Ok(new ProductDtoCollection 
        { 
            Data = result.Value!.ToList().AsReadOnly()
        });
    }

    /// <summary>
    /// Represents HttpGet action by searching product by id
    /// </summary>
    /// <param name="id">product id, represents which id we are looking for</param>
    /// <param name="cancellationToken">operation can be cancelled</param>
    /// <returns>Return the product with the provided id</returns>

    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ProductDto?>> GetProductById([FromRoute] int id, CancellationToken cancellationToken)
    {

        Result<ProductDto> result = await _mediator.Send(new GetProductByIdQuery(id), cancellationToken);

        if (result.IsSuccess)
        {
            ProductLogInfo.LogProductFoundSuccess(_logger, id, default);
            return Ok(result.Value);
        }

        var problem = ErrorExtension.ToProblemDetails(result.Error!, 404);

        ProductLogWarning.LogProductNotFound(_logger, id, default);   

        return new ObjectResult(problem)
        {
            StatusCode = problem.Status
        };
    }

    /// <summary>
    /// Add product action with HttpPost header.
    /// </summary>
    /// <param name="productDto">Data transfer object returned for client in WinForms</param>
    /// <param name="cancellationToken">Cancel current action on database</param>
    /// <returns>ProductDto</returns>

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ProductDto>> AddProduct([FromBody] ProductCreateDto createDto, CancellationToken cancellationToken)
    {

        Result<ProductDto> result = await _mediator.Send(new AddProductCommand(createDto), cancellationToken);

        if (result.IsSuccess)
        {
            ProductDto createdProduct = result.Value!;
            ProductLogInfo.LogAddProductSuccesfull(_logger, createdProduct.Id, createdProduct.Name, default);

            return CreatedAtAction(nameof(GetProductById), new { id = createdProduct.Id }, createdProduct);
        }

        var problem = ErrorExtension.ToProblemDetails(result.Error!, 400);

        return new ObjectResult(problem)
        {
            StatusCode = problem.Status
        };
    }

    /// <summary>
    /// Represents edit product action with HttpPut header.
    /// </summary>
    /// <param name="productDto"></param>
    /// <param name="id"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>

    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> EditProduct(
        [FromBody] ProductUpdateDto productDto,
        [FromRoute] int id,
        CancellationToken cancellationToken)
    {

        Result<Unit> result = await _mediator.Send(new EditProductCommand(id, productDto), cancellationToken);

        if (result.IsSuccess)
        {
            ProductLogInfo.LogProductModifiedSuccess(_logger, id, default);
            return NoContent();
        }

        return result.Error!.ToActionResult();
    }

    /// <summary>
    /// Deletes a product identified by the specified ID.
    /// </summary>
    /// <param name="id">The unique identifier of the product to delete.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>An <see cref="IActionResult"/> indicating the result of the operation. Returns <see cref="NoContentResult"/> if
    /// the deletion is successful; otherwise, returns a <see cref="ProblemDetails"/> with status 404 if the product is
    /// not found.</returns>

    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteProduct(
        [FromRoute] int id,
        CancellationToken cancellationToken)
    {

        Result<Unit> result = await _mediator.Send(new DeleteProductCommand(id), cancellationToken);

        if (result.IsSuccess)
        {
            ProductLogInfo.LogProductDeletedSuccess(_logger, id, default);
            return NoContent();
        }

        return result.Error!.ToActionResult();
    }

    /// <summary>
    /// Tracks a view for the specified product.
    /// </summary>
    /// <remarks>This method sends a command to track a product view and returns an appropriate HTTP response
    /// based on the outcome.</remarks>
    /// <param name="id">The unique identifier of the product to track.</param>
    /// <returns>An <see cref="IActionResult"/> indicating the result of the operation. Returns <see
    /// cref="StatusCodes.Status204NoContent"/> if the operation is successful. Returns <see
    /// cref="StatusCodes.Status400BadRequest"/> if the request is invalid. Returns <see
    /// cref="StatusCodes.Status404NotFound"/> if the product is not found.</returns>

    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [HttpPost("{id:guid}/track-view")]
    public async Task<IActionResult> TrackView(Guid id)
    {
        Result<Unit> result = await _mediator.Send(new TrackProductViewCommand(id));

        return result.IsSuccess
            ? NoContent()
            : result.Error!.ToActionResult();
    }

    /// <summary>
    /// Retrieves a list of all available genres.
    /// </summary>
    /// <remarks>This method returns an HTTP 200 OK response with the list of genre names.</remarks>
    /// <returns>An <see cref="ActionResult{T}"/> containing an array of strings, each representing a genre name.</returns>
    [ProducesResponseType(StatusCodes.Status200OK)]
    [HttpGet("genres")]
    public ActionResult<Genre> GetGenres()
        => Ok(Enum.GetNames(typeof(Genre)));

    /// <summary>
    /// Retrieves a list of all warehouse names.
    /// </summary>
    /// <remarks>This method returns a 200 OK response with the list of warehouse names. The list is derived
    /// from the enumeration of warehouse types.</remarks>
    /// <returns>An <see cref="ActionResult{T}"/> containing an array of strings with the names of all warehouses.</returns>
    [ProducesResponseType(StatusCodes.Status200OK)]
    [HttpGet("warehouses")]
    public ActionResult<Warehouse> GetWarehouses()
        => Ok(Enum.GetNames(typeof(Warehouse)));
}
