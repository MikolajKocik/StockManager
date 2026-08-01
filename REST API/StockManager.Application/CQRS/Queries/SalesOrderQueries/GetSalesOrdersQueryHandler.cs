using AutoMapper;
using Microsoft.EntityFrameworkCore;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.SalesOrderDtos;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.SalesOrderEntity;

namespace StockManager.Application.CQRS.Queries.SalesOrderQueries;

public sealed class GetSalesOrdersQueryHandler(
    ISalesOrderRepository repository,
    IMapper mapper) : IQueryHandler<GetSalesOrdersQuery, IReadOnlyList<SalesOrderDto>>
{
    private readonly ISalesOrderRepository _repository = repository;
    private readonly IMapper _mapper = mapper;

    public async Task<Result<IReadOnlyList<SalesOrderDto>>> Handle(GetSalesOrdersQuery query, CancellationToken cancellationToken)
    {
        List<SalesOrder> orders = await _repository.GetSalesOrders()
            .OrderByDescending(o => o.DeliveredDate)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync(cancellationToken);

        List<SalesOrderDto> dtos = _mapper.Map<List<SalesOrderDto>>(orders);

        return Result<IReadOnlyList<SalesOrderDto>>.Success(dtos);
    }
}
