using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using StockManager.Application.Common.Logging.Product;
using StockManager.Application.Common.Logging.PurchaseOrder;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.CQRS.Commands.PurchaseOrder.AddPurchase;
using StockManager.Application.CQRS.Commands.PurchaseOrder.AddPurchaseOrderLine;
using StockManager.Application.CQRS.Commands.PurchaseOrder.AssignPurchaseOrderInvoice;
using StockManager.Application.CQRS.Commands.PurchaseOrder.AssignPurchaseOrderReturnOrder;
using StockManager.Application.CQRS.Commands.PurchaseOrder.ConfirmPurchase;
using StockManager.Application.CQRS.Commands.PurchaseOrder.DeletePurchase;
using StockManager.Application.CQRS.Commands.PurchaseOrder.EditPurchase;
using StockManager.Application.CQRS.Commands.PurchaseOrder.SetPurchaseOrderExpectedDate;
using StockManager.Application.CQRS.Queries.ProductQueries.GetProductById;
using StockManager.Application.Dtos.ModelsDto.ProductDtos;
using StockManager.Application.Dtos.ModelsDto.PurchaseOrderDtos;
using StockManager.Application.Dtos.ModelsDto.PurchaseOrderLineDtos;
using StockManager.Application.Extensions.ErrorExtensions;
using StockManager.Core.Domain.Models.PurchaseOrderEntity;

namespace StockManager.Controllers;

[Authorize]
[ApiController]
[EnableRateLimiting("fixed")]
[Route("api/purchase-orders")]
[ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
[ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status429TooManyRequests)]
public sealed class PurchaseOrdersController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly ILogger<PurchaseOrdersController> _logger;

    public PurchaseOrdersController(IMediator mediator, ILogger<PurchaseOrdersController> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }
   
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<PurchaseOrderDto>> Create([FromBody] PurchaseOrderCreateDto dto, CancellationToken cancellationToken)
    {
        Result<PurchaseOrderDto> result = await _mediator.Send(new AddPurchaseOrderCommand(dto), cancellationToken);
        if (result.IsSuccess)
        {
            PurchaseOrderLogInfo.LogPurchaseOrderCreated(_logger, result.Value!.Id, default);
            return CreatedAtAction(nameof(GetById), new { id = result.Value!.Id }, result.Value);
        }

        var problem = ErrorExtension.ToProblemDetails(result.Error!, 400);

        return new ObjectResult(problem)
        {
            StatusCode = problem.Status
        };
    }

    [HttpPut("{id}")]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(int id, [FromBody] PurchaseOrderUpdateDto dto, CancellationToken cancellationToken)
    {
        Result<Unit> result = await _mediator.Send(new EditPurchaseOrderCommand(id, dto), cancellationToken);
        if (result.IsSuccess)
        {
            PurchaseOrderLogInfo.LogPurchaseOrderUpdated(_logger, id, default);
            return NoContent();
        }

        return result.Error!.ToActionResult();    
    }

    [HttpDelete("{id}")]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]

    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        Result<Unit> result = await _mediator.Send(new DeletePurchaseOrderCommand(id), cancellationToken);

        if(result.IsSuccess)
        {
            PurchaseOrderLogInfo.LogPurchaseOrderDeleted(_logger, id, default);
            return NoContent();
        }
        
        return result.Error!.ToActionResult();
    }

    [HttpPost("{id}/confirm")]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Confirm(int id, CancellationToken cancellationToken)
    {
        Result<Unit> result = await _mediator.Send(new ConfirmPurchaseOrderCommand(id), cancellationToken);

        if (result.IsSuccess)
        {
            PurchaseOrderLogInfo.LogPurchaseOrderConfirmed(_logger, id, default);
            return NoContent();
        }

        return result.Error!.ToActionResult();
    }

    [HttpPost("{id}/expected-date")]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> SetExpectedDate(int id, [FromBody] DateTime expectedDate, CancellationToken cancellationToken)
    {
        Result<Unit> result = await _mediator.Send(new SetPurchaseOrderExpectedDateCommand(id, expectedDate), cancellationToken);

        if(result.IsSuccess)
        {
            PurchaseOrderLogInfo.LogPurchaseOrderDateTimeSet(_logger, expectedDate, default);
            return NoContent();
        }
        
        return result.Error!.ToActionResult();
    }

    [HttpPost("{id}/assign-invoice")]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> AssignInvoice(int id, [FromBody] int invoiceId, CancellationToken cancellationToken)
    {
        Result<Unit> result = await _mediator.Send(new AssignPurchaseOrderInvoiceCommand(id, invoiceId), cancellationToken);
        
        if (result.IsSuccess)
        {
            PurchaseOrderLogInfo.LogPurchaseOrderInvoiceAssigned(_logger, invoiceId, default);
            return NoContent();
        }

        return result.Error!.ToActionResult();
    }

    [HttpPost("{id}/assign-return")]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> AssignReturn(int id, [FromBody] int returnOrderId, CancellationToken cancellationToken)
    {
        Result<Unit> result = await _mediator.Send(new AssignPurchaseOrderReturnOrderCommand(id, returnOrderId), cancellationToken);

        if(result.IsSuccess)
        {
            PurchaseOrderLogInfo.PurchaseOrderReturned(_logger, returnOrderId, default);
            return NoContent();
        }

        return result.Error!.ToActionResult();
    }

    [HttpPost("{id}/lines")]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> AddLine(int id, [FromBody] PurchaseOrderLineCreateDto line, CancellationToken cancellationToken)
    {
        Result<Unit> result = await _mediator.Send(new AddPurchaseOrderLineCommand(id, line), cancellationToken);

        if(result.IsSuccess)
        {
            PurchaseOrderLogInfo.PurchasOrderLineAdded(_logger, line, id, default);
            return NoContent();
        }

        return result.Error!.ToActionResult();
    }
}
