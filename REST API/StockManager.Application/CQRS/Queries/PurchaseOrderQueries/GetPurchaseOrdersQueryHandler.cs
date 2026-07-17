using AutoMapper;
using Microsoft.EntityFrameworkCore;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.PurchaseOrderDtos;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.PurchaseOrderEntity;

namespace StockManager.Application.CQRS.Queries.PurchaseOrderQueries;

public sealed class GetPurchaseOrdersQueryHandler(
    IPurchaseOrderRepository repository,
    IMapper mapper) : IQueryHandler<GetPurchaseOrdersQuery, IReadOnlyList<PurchaseOrderDto>>
{
    private readonly IPurchaseOrderRepository _repository = repository;
    private readonly IMapper _mapper = mapper;

    public async Task<Result<IReadOnlyList<PurchaseOrderDto>>> Handle(GetPurchaseOrdersQuery query, CancellationToken ct)
    {
        List<PurchaseOrder> purchaseOrders = await _repository
            .GetPurchaseOrders()
            .OrderByDescending(po => po.Id)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync(ct);    

        List<PurchaseOrderDto>? purchaseOrderDtos = _mapper.Map<List<PurchaseOrderDto>>(purchaseOrders);

        return Result<IReadOnlyList<PurchaseOrderDto>>.Success(purchaseOrderDtos);
    }
}
