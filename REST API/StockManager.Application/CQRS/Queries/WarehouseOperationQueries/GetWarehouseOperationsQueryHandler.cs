using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.WarehouseOperationDtos;
using StockManager.Infrastructure.Persistence.Data;

namespace StockManager.Application.CQRS.Queries.WarehouseOperationQueries;

public sealed class GetWarehouseOperationsQueryHandler : IQueryHandler<GetWarehouseOperationsQuery, List<WarehouseOperationDto>>
{
    private readonly StockManagerDbContext _context;
    private readonly IMapper _mapper;

    public GetWarehouseOperationsQueryHandler(StockManagerDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public async Task<Result<List<WarehouseOperationDto>>> Handle(GetWarehouseOperationsQuery query, CancellationToken cancellationToken)
    {
        var operations = await _context.WarehouseOperations
            .Include(o => o.Items)
            .OrderByDescending(o => o.Date)
            .ToListAsync(cancellationToken);

        var dtos = _mapper.Map<List<WarehouseOperationDto>>(operations);
        return Result<List<WarehouseOperationDto>>.Success(dtos);
    }
}
