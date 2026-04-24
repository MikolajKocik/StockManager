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

public sealed class GetWarehouseOperationsQueryHandler : IQueryHandler<GetWarehouseOperationsQuery, List<WarehouseOperationDto>>
{
    private readonly IWarehouseOperationRepository _repository;
    private readonly IMapper _mapper;

    public GetWarehouseOperationsQueryHandler(IWarehouseOperationRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<Result<List<WarehouseOperationDto>>> Handle(GetWarehouseOperationsQuery query, CancellationToken cancellationToken)
    {
        var operations = await _repository.GetOperationsWithItemsAsync(cancellationToken);

        var dtos = _mapper.Map<List<WarehouseOperationDto>>(operations);
        return Result<List<WarehouseOperationDto>>.Success(dtos);
    }
}
