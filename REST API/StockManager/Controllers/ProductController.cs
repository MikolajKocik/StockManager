using MediatR;
using Microsoft.AspNetCore.Mvc;
using StockManager.Application.CQRS.Queries.ProductQueries.GetProductById;
using StockManager.Application.CQRS.Queries.ProductQueries.GetProducts;
using StockManager.Application.CQRS.Commands.ProductCommands.AddProduct;
using StockManager.Application.CQRS.Commands.ProductCommands.EditProduct;
using StockManager.Application.CQRS.Commands.ProductCommands.DeleteProduct;
using Microsoft.AspNetCore.Authorization;
using StockManager.Application.Extensions.ErrorExtensions;
using StockManager.Application.Dtos.ModelsDto.Product;

namespace StockManager.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/products")]
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

            var query = new GetProductsQuery(name, warehouse, genre, unit, expirationDate, deliveredAt);

            var result = await _mediator.Send(query, cancellationToken);

            _logger.LogInformation("Succesfully returns a list of products: {products}", result);

            return Ok(new ProductDtoCollection 
            { 
                Data = result.Value! 
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
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ProductDto?>> GetProductById([FromRoute] int id, CancellationToken cancellationToken)
        {

            var result = await _mediator.Send(new GetProductByIdQuery(id), cancellationToken);

            if (result.IsSuccess)
            {
                _logger.LogInformation("Succesfully found the product with id:{id}", id);
                return Ok(result.Value);
            }

            ProblemDetails? problem = ErrorExtension.ToProblemDetails(result.Error!, 404);

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
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ProductDto>> AddProduct([FromBody] ProductDto productDto, CancellationToken cancellationToken)
        {

            var result = await _mediator.Send(new AddProductCommand(productDto), cancellationToken);

            if (result.IsSuccess)
            {
                var createdProduct = result.Value!;
                _logger.LogInformation("Succesfully added a new product:{productDto.Id}", createdProduct.Id);

                return CreatedAtAction(nameof(GetProductById), new { id = createdProduct.Id }, createdProduct);
            }

            ProblemDetails? problem = ErrorExtension.ToProblemDetails(result.Error!, 400);

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
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> EditProduct(
            [FromBody] ProductDto productDto,
            [FromRoute] int id,
            CancellationToken cancellationToken)
        {

            var result = await _mediator.Send(new EditProductCommand(id, productDto), cancellationToken);

            if (result.IsSuccess)
            {
                _logger.LogInformation("Product with id:{id} succesfully modified", id);
                return NoContent();
            }

            return result.Error!.ToActionResult();
        }

        /// <summary>
        /// Removes existing product by action.
        /// </summary>
        /// <param name="productDto">Existing product to remove</param>
        /// <param name="id">Product id</param>
        /// <param name="cancellationToken">A token that allows the connection to the database to be broken in case of an abandoned action</param>
        /// <returns>Returns a success status if product removed succesfully</returns>

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> DeleteProduct(
            [FromRoute] int id,
            CancellationToken cancellationToken)
        {

            var result = await _mediator.Send(new DeleteProductCommand(id), cancellationToken);

            if (result.IsSuccess)
            {
                _logger.LogInformation("Provided product with id:{id} deleted succesfully", id);
                return NoContent();
            }

            return result.Error!.ToActionResult();
        }
    }
}
