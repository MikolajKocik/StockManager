using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.CustomerDtos;
using StockManager.Core.Domain.Interfaces.Repositories;

namespace StockManager.Application.CQRS.Queries.CustomerQueries.GetCustomers;

public sealed class GetCustomersQueryHandler(ICustomerRepository repository,IMapper mapper) 
    : IQueryHandler<GetCustomersQuery, IReadOnlyList<CustomerDto>>
{
    private readonly ICustomerRepository _repository = repository;
    private readonly IMapper _mapper = mapper;

    public async Task<Result<IReadOnlyList<CustomerDto>>> Handle(GetCustomersQuery query, CancellationToken ct)
    {
        List<CustomerDto> dtos = await _repository.GetCustomers()
            .ProjectTo<CustomerDto>(_mapper.ConfigurationProvider)
            .OrderBy(c => c.Id)
            .Skip((query.Page - 1) * query.PageSize)
            .Take(query.PageSize)
            .ToListAsync(ct);

        return Result<IReadOnlyList<CustomerDto>>.Success(dtos);
    }
}
