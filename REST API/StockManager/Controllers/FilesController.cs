using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using StockManager.Core.Domain.Interfaces.Services;
using StockManager.Infrastructure.Persistence.Data;
using StockManager.Core.Domain.Models.WarehouseOperationEntity;

namespace StockManager.Controllers;

[ApiController]
[Authorize]
[EnableRateLimiting("fixed")]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/files")]
[ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status500InternalServerError)]
[ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status429TooManyRequests)]
public sealed class FilesController : ControllerBase
{
    private readonly IBlobStorageService _blobStorage;
    private readonly StockManagerDbContext _context;
    private readonly ILogger<FilesController> _logger;

    public FilesController(IBlobStorageService blobStorage, StockManagerDbContext context, ILogger<FilesController> logger)
    {
        _blobStorage = blobStorage;
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Uploads a file to cloud storage and records its metadata.
    /// </summary>
    /// <param name="file">The file to upload.</param>
    /// <param name="operationId">Optional operation identifier to link the file to.</param>
    /// <param name="cancellationToken">A token to monitor for cancellation requests.</param>
    /// <returns>The created file metadata.</returns>
    [HttpPost("upload")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Upload(IFormFile file, [FromQuery] int? operationId, CancellationToken cancellationToken)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("No file uploaded.");
        }

        using Stream stream = file.OpenReadStream();
        string blobUrl = await _blobStorage.UploadAsync(stream, file.FileName, file.ContentType, cancellationToken);

        var fileMetadata = new FileMetadata(file.FileName, blobUrl, operationId);
        await _context.FileMetadatas.AddAsync(fileMetadata, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        return Ok(fileMetadata);
    }

    /// <summary>
    /// Retrieves metadata for all uploaded files.
    /// </summary>
    /// <returns>A list of file metadata records.</returns>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public IActionResult Get()
    {
        var files = _context.FileMetadatas.OrderByDescending(f => f.UploadedAt).ToList();
        return Ok(files);
    }
}
