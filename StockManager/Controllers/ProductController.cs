using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StockManager.Application.CQRS.Queries.ProductQueries;

namespace StockManager.Controllers
{
    [Route("api/products")]
    [ApiController]
    public class ProductController : Controller
    {
        private readonly IMediator _mediator;
        private readonly ILogger<ProductController> _logger;

        public ProductController(IMediator mediator, ILogger<ProductController> logger)
        {
            _mediator = mediator;
            _logger = logger;   
        }

        [Authorize(Roles = "Employee")]
        [Authorize(Roles = "Manager")]
        [HttpGet]
        public async Task<IActionResult> GetProdcuts(CancellationToken cancellationToken)
        {
            var products = await _mediator.Send(new GetAllQuery(), cancellationToken);

            if (products == null)
            {
                _logger.LogInformation("There are no products yet");
                return NoContent();
            }

            _logger.LogInformation($"Succesfully returns a list of products: {products}");
            return Ok(products);
        }
    }
}
