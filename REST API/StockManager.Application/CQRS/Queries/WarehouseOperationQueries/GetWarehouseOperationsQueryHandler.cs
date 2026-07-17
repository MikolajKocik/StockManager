using AutoMapper;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.WarehouseOperationDtos;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.WarehouseOperationEntity;

namespace StockManager.Application.CQRS.Queries.WarehouseOperationQueries;

public sealed class GetWarehouseOperationsQueryHandler(
        IWarehouseOperationRepository repository,
        IMapper mapper
    ) : IQueryHandler<GetWarehouseOperationsQuery, IReadOnlyList<WarehouseOperationDto>>
{
    private readonly IWarehouseOperationRepository _repository = repository;
    private readonly IMapper _mapper = mapper;

    public async Task<Result<IReadOnlyList<WarehouseOperationDto>>> Handle(GetWarehouseOperationsQuery query, CancellationToken ct)
    {
        IReadOnlyList<WarehouseOperation> operations = await _repository.GetOperationsWithItemsAsync(ct);

        List<WarehouseOperationDto> dtos = _mapper.Map<List<WarehouseOperationDto>>(operations);
        return Result<IReadOnlyList<WarehouseOperationDto>>.Success(dtos);
    }
}
