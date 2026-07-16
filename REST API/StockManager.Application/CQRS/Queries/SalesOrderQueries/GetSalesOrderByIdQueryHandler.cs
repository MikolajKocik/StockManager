using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Common.Logging.SalesOrder;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.SalesOrderDtos;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.SalesOrderEntity;

namespace StockManager.Application.CQRS.Queries.SalesOrderQueries;

public sealed class GetSalesOrderByIdQueryHandler : IQueryHandler<GetSalesOrderByIdQuery, SalesOrderDto>
{
    private readonly ISalesOrderRepository _repository;
    private readonly IMapper _mapper;
    private readonly ILogger<GetSalesOrderByIdQueryHandler> _logger;

    public GetSalesOrderByIdQueryHandler(
        ISalesOrderRepository repository,
        IMapper mapper,
        ILogger<GetSalesOrderByIdQueryHandler> logger)
    {
        _repository = repository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<Result<SalesOrderDto>> Handle(GetSalesOrderByIdQuery query, CancellationToken ct)
    {
        SalesOrder? order = await _repository.GetSalesOrderByIdAsync(query.Id, ct);
          
        if (order is null)
        {
            SalesOrderLogWarning.LogSalesOrderNotFound(_logger, query.Id, default);

            return Result<SalesOrderDto>.Failure(
                new Error(
                    $"SalesOrder with id: {query.Id} not found",
                    ErrorCodes.SalesOrderNotFound));
        }

        SalesOrderDto dto = _mapper.Map<SalesOrderDto>(order);
        return Result<SalesOrderDto>.Success(dto);
    }
}
