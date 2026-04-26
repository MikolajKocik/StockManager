using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using StockManager.Application.CQRS.Queries.WarehouseOperationQueries;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.WarehouseOperationDtos;
using StockManager.Infrastructure.Ollama.Interfaces;
using StockManager.Infrastructure.Ollama.Requests;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Application.Extensions.ErrorExtensions;
using StockManager.Core.Domain.Models.WarehouseOperationEntity;
using StockManager.Application.CQRS.Commands.DocumentsCommand;
using StockManager.Application.Dtos.ModelsDto.InvoiceDtos;
using StockManager.Application.CQRS.Queries.DocumentQueries;

namespace StockManager.Controllers;

[ApiController]
[Authorize]
[EnableRateLimiting("fixed")]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/documents")]
[ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
[ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status429TooManyRequests)]
public sealed class DocumentsController : ControllerBase
{
    private readonly IMediator _mediator;

    public DocumentsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Retrieves all generated warehouse documents.
    /// </summary>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>A list of documents.</returns>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetDocuments(CancellationToken cancellationToken)
    {
        Result<List<DocumentDto>> result = await _mediator.Send(new GetDocumentsQuery(), cancellationToken);

        if (result.IsSuccess)
        {
            return Ok(result.Value);
        }

        return BadRequest(result.Error);
    }

    [HttpGet("/filesMetadata")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<FileMetadata>> GetFilesMetadataAsync(CancellationToken cancellationToken)
    {
        Result<List<FileMetadata>> files = await _mediator.Send(new GetFileMetadataQuery(), cancellationToken);
        return Ok(files);
    }      

    [HttpGet("/invoice:{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<ActionResult<InvoiceDto>> GetInvoiceById([FromRoute] int id, CancellationToken cancellationToken)
    {
        Result<InvoiceDto> invoice = await _mediator.Send(new GetInvoiceByIdQuery(id), cancellationToken);
        return Ok(invoice.Value);
    }

    /// <summary>
    /// Uploads a file to cloud storage and records its metadata.
    /// </summary>
    /// <param name="file">The file to upload.</param>
    /// <param name="operationId">Optional operation identifier to link the file to.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>The created file metadata.</returns>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<FileMetadata>> AddDocument(IFormFile file, [FromQuery] int? operationId, CancellationToken cancellationToken)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("No file uploaded.");
        }

        using Stream stream = file.OpenReadStream();
        
        var command = new UploadDocumentCommand(
            file.FileName,
            file.ContentType,
            stream,
            operationId
        );

        Result<FileMetadata> result = await _mediator.Send(command, cancellationToken);
        
        if (!result.IsSuccess)
        {
            
            var problem = ErrorExtension.ToProblemDetails(result.Error!, 400);

            return new ObjectResult(problem)
            {
                StatusCode = problem.Status
            };
        }

        return result.Value!;
    }

    [HttpPost("/ai/ask")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> AskAsync(
        [FromBody] AskQuestionRequest request, 
        [FromServices] IRetrievalService aiService,
        CancellationToken cancellationToken
    )
    {
        string answer = await aiService.AnswerQuestionAsync(request.Question, cancellationToken);
        return Ok(new { Answer = answer });
    }
}
