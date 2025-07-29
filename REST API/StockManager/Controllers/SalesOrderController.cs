using System.Threading;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using StockManager.Application.Common.Logging.SalesOrder;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.CQRS.Commands.SalesOrderCommands.AddSalesOrder;
using StockManager.Application.CQRS.Commands.SalesOrderCommands.AddSalesOrderLine;
using StockManager.Application.CQRS.Commands.SalesOrderCommands.CancelSalesOrder;
using StockManager.Application.CQRS.Commands.SalesOrderCommands.ConfirmSalesOrder;
using StockManager.Application.CQRS.Commands.SalesOrderCommands.DeleteSalesOrder;
using StockManager.Application.CQRS.Commands.SalesOrderCommands.DeliverSalesOrder;
using StockManager.Application.CQRS.Commands.SalesOrderCommands.EditSalesOrder;
using StockManager.Application.CQRS.Commands.SalesOrderCommands.ShipSalesOrder;
using StockManager.Application.Dtos.ModelsDto.SalesOrderDtos;
using StockManager.Application.Extensions.ErrorExtensions;
using StockManager.Core.Domain.Enums;

namespace StockManager.Controllers;


[Authorize]
[ApiController]
[Route("api/sales-orders")]
[EnableRateLimiting("fixed")]
[ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
[ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status429TooManyRequests)]
public sealed class SalesOrdersController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<SalesOrdersController> _logger;

    public SalesOrdersController(IMediator mediator, ILogger<SalesOrdersController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id, CancellationToken cancellationToken)
    {
        //placeholder
        await Task.CompletedTask;
        return NoContent();
    }

    [HttpPost]
    [ProducesResponseType(typeof(SalesOrderDto), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<SalesOrderDto>> Create([FromBody] SalesOrderCreateDto dto, CancellationToken cancellationToken)
    {
        Result<SalesOrderDto> result = await _mediator.Send(new AddSalesOrderCommand(dto), cancellationToken);

        if (result.IsSuccess)
        {
            _logger.LogError("Failed to create sales order: {Error}", result.Error);
            return CreatedAtAction(nameof(GetById), new { id = result.Value!.Id }, result.Value);
        }

        var problem = ErrorExtension.ToProblemDetails(result.Error!, 400);

        return new ObjectResult(problem)
        {
            StatusCode = problem.Status
        };
    }

    [HttpPut("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Update(int id, [FromBody] SalesOrderUpdateDto dto, CancellationToken cancellationToken)
    {
        Result<Unit> result = await _mediator.Send(new EditSalesOrderCommand(id, dto), cancellationToken);

        if (result.IsSuccess)
        {
            SalesOrderLogInfo.LogSalesOrderUpdated(_logger, dto, default);
            return NoContent();
        }

        var problem = ErrorExtension.ToProblemDetails(result.Error!, 404);

        return new ObjectResult(problem) 
        {
            StatusCode = problem.Status
        };
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        Result<Unit> result = await _mediator.Send(new DeleteSalesOrderCommand(id), cancellationToken);

        if (result.IsSuccess)
        {
            SalesOrderLogInfo.LogSalesOrderDeleted(_logger, id, default);
            return NoContent();
        }

        var problem = ErrorExtension.ToProblemDetails(result.Error!, 404);
        return new ObjectResult(problem) { StatusCode = problem.Status };
    }

    [HttpPost("{id}/confirm")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Confirm(int id, CancellationToken cancellationToken)
    {
        Result<Unit> result = await _mediator.Send(new ConfirmSalesOrderCommand(id), cancellationToken);

        if (result.IsSuccess)
        {
            SalesOrderLogInfo.LogSalesOrderConfirmed(_logger, id, default);
            return NoContent();
        }

        var problem = ErrorExtension.ToProblemDetails(result.Error!, 404);

        return new ObjectResult(problem)
        {
            StatusCode = problem.Status
        };
    }

    [HttpPost("{id}/ship")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Ship(int id, [FromBody] DateTime shipDate, CancellationToken cancellationToken)
    {
        Result<Unit> result = await _mediator.Send(new ShipSalesOrderCommand(id, shipDate), cancellationToken);

        if (result.IsSuccess)
        {
            SalesOrderLogInfo.LogSalesOrderCompleted(_logger, id, default);
            return NoContent();
        }

        var problem = ErrorExtension.ToProblemDetails(result.Error!, 404);

        return new ObjectResult(problem) 
        {
            StatusCode = problem.Status
        };
    }

    [HttpPost("{id}/deliver")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Deliver(int id, [FromBody] DateTime deliveredDate, CancellationToken cancellationToken)
    {
        Result<Unit> result = await _mediator.Send(new DeliverSalesOrderCommand(id, deliveredDate), cancellationToken);

        if (result.IsSuccess)
        {
            SalesOrderLogInfo.LogSalesOrderDelivered(_logger, id, default);
            return NoContent();
        }

        var problem = ErrorExtension.ToProblemDetails(result.Error!, 404);

        return new ObjectResult(problem)
        { 
            StatusCode = problem.Status
        };
    }

    [HttpPost("{id}/cancel")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Cancel(int id, CancellationToken cancellationToken)
    {
        Result<Unit> result = await _mediator.Send(new CancelSalesOrderCommand(id), cancellationToken);

        if (result.IsSuccess)
        {
            SalesOrderLogInfo.LogSalesOrderCancelled(_logger, id, default);
            return NoContent();
        }

        var problem = ErrorExtension.ToProblemDetails(result.Error!, 404);
        return new ObjectResult(problem) 
        { 
            StatusCode = problem.Status 
        };
    }

    [HttpPost("{id}/lines")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> AddLine(
        int id,
        [FromBody] AddSalesOrderLineBody body,
        CancellationToken ct)
    {
        Result<Unit> result = await _mediator.Send(
            new AddSalesOrderLineCommand(id, body.ProductId, body.Quantity, body.Price, body.Unit), ct);

        if (result.IsSuccess)
        {
            SalesOrderLogInfo.LogSalesOrderLineAdded(_logger, body, default);
            return NoContent();
        }

        var problem = ErrorExtension.ToProblemDetails(result.Error!, 404);

        return new ObjectResult(problem) 
        {
            StatusCode = problem.Status 
        };
    }

    public sealed record AddSalesOrderLineBody(int ProductId, decimal Quantity, decimal Price, UnitOfMeasure Unit);
}
