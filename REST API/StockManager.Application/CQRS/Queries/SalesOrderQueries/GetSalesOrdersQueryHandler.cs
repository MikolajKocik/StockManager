using AutoMapper;
using Microsoft.EntityFrameworkCore;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.SalesOrderDtos;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.SalesOrderEntity;

namespace StockManager.Application.CQRS.Queries.SalesOrderQueries;

public sealed class GetSalesOrdersQueryHandler : IQueryHandler<GetSalesOrdersQuery, List<SalesOrderDto>>
{
    private readonly ISalesOrderRepository _repository;
    private readonly IMapper _mapper;

    public GetSalesOrdersQueryHandler(ISalesOrderRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<Result<List<SalesOrderDto>>> Handle(GetSalesOrdersQuery query, CancellationToken cancellationToken)
    {
        List<SalesOrder> orders = await _repository.GetSalesOrders()
            .Include(o => o.Customer)
            .Include(o => o.SalesOrderLines)
                .ThenInclude(l => l.Product)
            .ToListAsync(cancellationToken);

        List<SalesOrderDto> dtos = _mapper.Map<List<SalesOrderDto>>(orders);

        return Result<List<SalesOrderDto>>.Success(dtos);
    }
}
