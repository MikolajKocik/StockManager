using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.WarehouseOperationDtos;
using StockManager.Core.Domain.Interfaces.Repositories;

namespace StockManager.Application.CQRS.Queries.WarehouseOperationQueries;

public sealed class GetDocumentsQueryHandler : IQueryHandler<GetDocumentsQuery, List<DocumentDto>>
{
    private readonly IWarehouseOperationRepository _repository;
    private readonly IMapper _mapper;

    public GetDocumentsQueryHandler(IWarehouseOperationRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<Result<List<DocumentDto>>> Handle(GetDocumentsQuery query, CancellationToken cancellationToken)
    {
        var documents = await _repository.GetDocumentsAsync(cancellationToken);

        var dtos = _mapper.Map<List<DocumentDto>>(documents);
        return Result<List<DocumentDto>>.Success(dtos);
    }
}
