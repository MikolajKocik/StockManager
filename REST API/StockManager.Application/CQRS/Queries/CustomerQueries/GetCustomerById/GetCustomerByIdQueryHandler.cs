using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using MediatR;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.CustomerDtos;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.CustomerEntity;

namespace StockManager.Application.CQRS.Queries.CustomerQueries.GetCustomerById;
public sealed class GetCustomerByIdQueryHandler : IQueryHandler<GetCustomerByIdQuery, CustomerDto>
{
    private readonly ICustomerRepository _repository;
    private readonly IMapper _mapper;
    private readonly ILogger<GetCustomerByIdQueryHandler> _logger;

    public GetCustomerByIdQueryHandler(
        ICustomerRepository repository,
        IMapper mapper,
        ILogger<GetCustomerByIdQueryHandler> logger
        )
    {
        _repository = repository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<Result<CustomerDto>> Handle(GetCustomerByIdQuery query, CancellationToken cancellationToken)
    {
        Customer customer = await _repository.GetCustomerByIdAsync(query.Id, cancellationToken);
        if (customer is null)
        {
            return Result<CustomerDto>.Failure(
                new Error(
                    $"Customer {query.Id} not found",
                    ErrorCodes.CustomerNotFound));
        }

        CustomerDto dto = _mapper.Map<CustomerDto>(customer);
        return Result<CustomerDto>.Success(dto);
    }
}
