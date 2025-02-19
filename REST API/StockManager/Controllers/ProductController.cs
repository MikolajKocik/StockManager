using MediatR;
using Microsoft.AspNetCore.Mvc;
using StockManager.Application.CQRS.Queries.ProductQueries.GetProductById;
using StockManager.Application.CQRS.Queries.ProductQueries.GetProducts;

namespace StockManager.Controllers
{
    [Route("api/products")]
    [ApiController]
    public class ProductController : ControllerBase
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
        /// <param name="unit">unit of product</param>
        /// <param name="expirationDate">product expiration date</param>
        /// <param name="deliveredAt">product delivery date</param>
        /// <param name="cancellationToken">operation can be cancelled</param>
        /// <returns>Query or all products</returns>

        [HttpGet]
        public async Task<IActionResult> GetProducts(
            [FromQuery] string? name = null,
            [FromQuery] string? genre = null,
            [FromQuery] string? unit = null,
            [FromQuery] DateTime? expirationDate = null,
            [FromQuery] DateTime? deliveredAt = null,
            CancellationToken cancellationToken = default)
        {

            var query = new GetProductsQuery(name, genre, unit, expirationDate, deliveredAt);

            var products = await _mediator.Send(query, cancellationToken);

            _logger.LogInformation("Succesfully returns a list of products: {products}", products);
            return Ok(products);
        }

        /// <summary>
        /// Represents HttpGet action by searching product by id
        /// </summary>
        /// <param name="id">product id, represents which id we are looking for</param>
        /// <param name="cancellationToken">operation can be cancelled</param>
        /// <returns>Return the product with the provided id</returns>

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductById([FromRoute] int id, CancellationToken cancellationToken)
        {

            var product = await _mediator.Send(new GetProductByIdQuery(id), cancellationToken);

            if (product is null)
            {
                _logger.LogWarning("Product with id:{id} not found", id);
                return NotFound();
            }

            _logger.LogInformation("Succesfully found the product with id:{id}", id);
            return Ok(product);
        }
    }
}
