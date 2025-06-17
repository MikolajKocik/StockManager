using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StockManager.Application.CQRS.Queries.SupplierQueries.GetSuppliers;
using StockManager.Application.Dtos.ModelsDto.Address;
using StockManager.Application.Dtos.ModelsDto.Product;
using StockManager.Application.Dtos.ModelsDto.Supplier;

namespace StockManager.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/suppliers")]
    public sealed class SupplierController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly ILogger<SupplierController> _logger;
         
        public SupplierController(IMediator mediator, ILogger<SupplierController> logger)
        {
            _mediator = mediator;
            _logger = logger;
        }

        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<SupplierDto>> GetSuppliers(
            string? name = null,
            AddressDto? address = null,
            IEnumerable<ProductDto>? products = null,
            CancellationToken cancellationToken = default
            )
        {
            var query = new GetSuppliersQuery(name, address, products);

            var result = await _mediator.Send(query, cancellationToken);

            _logger.LogInformation("Successfully returned a list of suppliers: {suppliers}", result);

            return Ok(new SupplierDtoCollection
            {
                Data = result.Value!
            });
        }
    }
}
