using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.CustomerDtos;
using StockManager.Core.Domain.Interfaces.Repositories;

namespace StockManager.Application.CQRS.Queries.CustomerQueries.GetCustomers;

public sealed class GetCustomersQueryHandler : IQueryHandler<GetCustomersQuery, IEnumerable<CustomerDto>>
{
    private readonly ICustomerRepository _repository;
    private readonly IMapper _mapper;

    public GetCustomersQueryHandler(
        ICustomerRepository repository,
        IMapper mapper
        )
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<Result<IEnumerable<CustomerDto>>> Handle(GetCustomersQuery query, CancellationToken cancellationToken)
    {
        List<CustomerDto> dtos = await _repository.GetCustomers()
            .ProjectTo<CustomerDto>(_mapper.ConfigurationProvider)
            .ToListAsync(cancellationToken);

        return Result<IEnumerable<CustomerDto>>.Success(
            dtos.Any() 
            ? dtos 
            : Enumerable.Empty<CustomerDto>());
    }
}
