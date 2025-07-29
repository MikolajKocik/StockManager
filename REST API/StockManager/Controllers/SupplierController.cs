using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using StockManager.Application.Common.Logging.Supplier;
using StockManager.Application.Common.PipelineBehavior;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.CQRS.Commands.SupplierCommands.AddSupplier;
using StockManager.Application.CQRS.Commands.SupplierCommands.DeleteSupplier;
using StockManager.Application.CQRS.Commands.SupplierCommands.EditSupplier;
using StockManager.Application.CQRS.Queries.SupplierQueries.GetSupplierById;
using StockManager.Application.CQRS.Queries.SupplierQueries.GetSuppliers;
using StockManager.Application.Dtos.ModelsDto.AddressDtos;
using StockManager.Application.Dtos.ModelsDto.ProductDtos;
using StockManager.Application.Dtos.ModelsDto.SupplierDtos;
using StockManager.Application.Extensions.ErrorExtensions;

namespace StockManager.Controllers;

[Authorize]
[ApiController]
[EnableRateLimiting("fixed")]
[Route("api/suppliers")]
[ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
[ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status429TooManyRequests)]
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

        Result<IEnumerable<SupplierDto>> result = await _mediator.Send(query, cancellationToken);

        SupplierLogInfo.LogSuccesfullReturnedListOfSuppliers(_logger, result, default);

        return Ok(new SupplierDtoCollection
        {
            Data = result.Value!
        });
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<SupplierDto>> GetSupplierById(
        [FromRoute] Guid id,
        CancellationToken cancellationToken)
    {
        Result<SupplierDto> result = await _mediator.Send(new GetSupplierByIdQuery(id), cancellationToken);

        if(result.IsSuccess)
        {
            SupplierLogInfo.LogSupplierFoundSuccessfull(_logger, result, default);

            return Ok(result.Value);
        }

        var problem = ErrorExtension.ToProblemDetails(result.Error! , 404);
        SupplierLogError.LogRetrievingSupplierById(_logger, id, result.Error!.Message, default);

        return new ObjectResult(problem)
        {
            StatusCode = problem.Status
        };
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<SupplierDto>> AddSupplier(
        [FromBody] SupplierCreateDto supplierDto,
        CancellationToken cancellationToken)
    {
        Result<SupplierDto> result = await _mediator.Send(new AddSupplierCommand(supplierDto), cancellationToken);

        if(result.IsSuccess)
        {
            SupplierLogInfo.LogReturningNewSupplier(_logger, supplierDto, default);
            return CreatedAtAction(nameof(GetSupplierById), new { id = result.Value!.Id }, result.Value);
        }

        var problem = ErrorExtension.ToProblemDetails(result.Error!, 400);
        SupplierLogError.LogAddingSupplierException(_logger, result.Error!.Message, default);

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
        [FromBody] SupplierUpdateDto supplierDto,
        CancellationToken cancellationToken)
    {
        Result<SupplierDto> result = await _mediator.Send(new EditSupplierCommand(id, supplierDto), cancellationToken);

        if(result.IsSuccess)
        {
            SupplierLogInfo.LogSupplierModifiedSuccessfull(_logger, id, default);
            return NoContent();
        }

        var problem = ErrorExtension.ToProblemDetails(result.Error!, 400);
        SupplierLogError.LogModifiedSupplierException(_logger, id, result.Error!.Message, default);

        return new ObjectResult(problem)
        {
            StatusCode = problem.Status
        };
    }

    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]

    public async Task<IActionResult> DeleteSupplier(
        [FromRoute] Guid id,
        CancellationToken cancellationToken)
    {
        Result<Unit> result = await _mediator.Send(new DeleteSupplierCommand(id), cancellationToken);

        if (result.IsSuccess)
        {
            SupplierLogInfo.LogSupplierRemovedSuccessfull(_logger, id, default);
            return NoContent();
        }

        var problem = ErrorExtension.ToProblemDetails(result.Error!, 404);
        SupplierLogError.LogRemovingSupplierException(_logger, id, result.Error!.Message, default);

        return new ObjectResult(problem)
        {
            StatusCode = problem.Status
        };
    }
}
