using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Common.Logging.General;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.WarehouseOperationDtos;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.WarehouseOperationEntity;

namespace StockManager.Application.CQRS.Queries.DocumentQueries;

public sealed class GetDocumentsQueryHandler(
        IWarehouseOperationRepository repository,
        IMapper mapper,
        ILogger<GetDocumentsQueryHandler> logger) 
        : IQueryHandler<GetDocumentsQuery, IReadOnlyList<DocumentDto>>
{
    private readonly IWarehouseOperationRepository _repository = repository;
    private readonly IMapper _mapper = mapper;
    private readonly ILogger<GetDocumentsQueryHandler> _logger = logger;

    public async Task<Result<IReadOnlyList<DocumentDto>>> Handle(GetDocumentsQuery query, CancellationToken ct)
    {
        List<Document> documents = await _repository.GetDocuments()
            .OrderByDescending(d => d.CreatedAt)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync(ct);

        GeneralLogInfo.Information(
            _logger,
            $"Retrieved {documents.Count} documents for page {query.Page} with page size {query.PageSize}.",
            default
        );

        List<DocumentDto> dtos = _mapper.Map<List<DocumentDto>>(documents);
        return Result<IReadOnlyList<DocumentDto>>.Success(dtos);
    }
}
