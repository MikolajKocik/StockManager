using AutoMapper;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Common.Logging.PurchaseOrder;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.PurchaseOrderDtos;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.PurchaseOrderEntity;

namespace StockManager.Application.CQRS.Queries.PurchaseOrderQueries;

public sealed class GetPurchaseOrderByIdQueryHandler : IQueryHandler<GetPurchaseOrderByIdQuery, PurchaseOrderDto>
{
    private readonly IPurchaseOrderRepository _repository;
    private readonly IMapper _mapper;
    private readonly ILogger<GetPurchaseOrderByIdQueryHandler> _logger;

    public GetPurchaseOrderByIdQueryHandler(
        IPurchaseOrderRepository repository,
        IMapper mapper,
        ILogger<GetPurchaseOrderByIdQueryHandler> logger)
    {
        _repository = repository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<Result<PurchaseOrderDto>> Handle(GetPurchaseOrderByIdQuery query, CancellationToken cancellationToken)
    {
        PurchaseOrder? order = await _repository.GetPurchaseOrderByIdAsync(query.Id, cancellationToken);

        if (order is null)
        {
            PurchaseOrderLogWarning.LogPurchaseOrderNotFound(_logger, query.Id, default);

            return Result<PurchaseOrderDto>.Failure(
                new Error(
                    $"PurchaseOrder with id: {query.Id} not found",
                    ErrorCodes.PurchaseOrderNotFound));
        }

        PurchaseOrderDto dto = _mapper.Map<PurchaseOrderDto>(order);
        return Result<PurchaseOrderDto>.Success(dto);
    }
}
