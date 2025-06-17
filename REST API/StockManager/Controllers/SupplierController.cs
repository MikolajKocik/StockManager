using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StockManager.Application.CQRS.Commands.SupplierCommands.AddSupplier;
using StockManager.Application.CQRS.Commands.SupplierCommands.EditSupplier;
using StockManager.Application.CQRS.Queries.SupplierQueries.GetSupplierById;
using StockManager.Application.CQRS.Queries.SupplierQueries.GetSuppliers;
using StockManager.Application.Dtos.ModelsDto.Address;
using StockManager.Application.Dtos.ModelsDto.Product;
using StockManager.Application.Dtos.ModelsDto.Supplier;
using StockManager.Application.Extensions.ErrorExtensions;

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
        public async Task<ActionResult<SupplierDtoCollection>> GetSuppliers(
            [FromQuery] string? name = null,
            [FromQuery] AddressDto? address = null,
            [FromQuery] IEnumerable<ProductDto>? products = null,
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

        [HttpGet("{id:guid}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<SupplierDto>> GetSupplierById(
            [FromRoute] Guid id,
            CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(new GetSupplierByIdQuery(id), cancellationToken);

            if(result.IsSuccess)
            {
                _logger.LogInformation("Supplier {@supplier} found successfull", result.Value);

                return Ok(result.Value);
            }

            ProblemDetails? problem = ErrorExtension.ToProblemDetails(result.Error! , 404);
            _logger.LogError("Error occurred while retrieving supplier by ID {id}: {error}", id, result.Error);

            return new ObjectResult(problem)
            {
                StatusCode = problem.Status
            };
        }

        [HttpPost]
        [ProducesResponseType(StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<SupplierDto>> AddSupplier(
            [FromBody] SupplierDto supplierDto,
            CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(new AddSupplierCommand(supplierDto), cancellationToken);

            if(result.IsSuccess)
            {
                return CreatedAtAction(nameof(GetSupplierById), new { id = result.Value!.Id }, result.Value);
            }

            ProblemDetails? problem = ErrorExtension.ToProblemDetails(result.Error!, 400);
            _logger.LogError("Error occurred while adding supplier: {error}", result.Error);

            return new ObjectResult(problem)
            {
                StatusCode = problem.Status
            };
        }

        [HttpPut("{id:guid}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]

        public async Task<IActionResult> UpdateSupplier(
            [FromRoute] Guid id,
            [FromBody] SupplierDto supplierDto,
            CancellationToken cancellationToken)
        {
            var result = await _mediator.Send(new EditSupplierCommand(id, supplierDto), cancellationToken);

            if(result.IsSuccess)
            {
                _logger.LogInformation("Supplier with ID {id} updated successfully", id);
                return NoContent();
            }

            ProblemDetails? problem = ErrorExtension.ToProblemDetails(result.Error!, 400);
            _logger.LogError("Error occurred while updating supplier with ID {id}: {error}", id, result.Error);

            return new ObjectResult(problem)
            {
                StatusCode = problem.Status
            };
        }
    }
}
