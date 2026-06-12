using AutoMapper;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.PurchaseOrderDtos;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.PurchaseOrderEntity;

namespace StockManager.Application.CQRS.Queries.PurchaseOrderQueries;

public sealed class GetPurchaseOrdersQueryHandler : IQueryHandler<GetPurchaseOrdersQuery, List<PurchaseOrderDto>>
{
    private readonly IPurchaseOrderRepository _repository;
    private readonly IMapper _mapper;

    public GetPurchaseOrdersQueryHandler(IPurchaseOrderRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<Result<List<PurchaseOrderDto>>> Handle(GetPurchaseOrdersQuery query, CancellationToken cancellationToken)
    {
        List<PurchaseOrder> purchaseOrders = await _repository.GetPurchaseOrdersAsync(cancellationToken);

        List<PurchaseOrderDto>? purchaseOrderDtos = _mapper.Map<List<PurchaseOrderDto>>(purchaseOrders);

        return Result<List<PurchaseOrderDto>>.Success(purchaseOrderDtos);
    }
}
