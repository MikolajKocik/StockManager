using AutoMapper;
using Microsoft.Extensions.Logging;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Common.ResultPattern;
using StockManager.Application.Dtos.ModelsDto.CustomerDtos;
using StockManager.Application.Helpers.Error;
using StockManager.Core.Domain.Interfaces.Repositories;
using StockManager.Core.Domain.Models.CustomerEntity;
using StockManager.Application.Common.Logging.General;

namespace StockManager.Application.CQRS.Queries.CustomerQueries.GetCustomerById;

public sealed class GetCustomerByIdQueryHandler(
    ICustomerRepository repository,
    IMapper mapper,
    ILogger<GetCustomerByIdQueryHandler> logger) : IQueryHandler<GetCustomerByIdQuery, CustomerDto>
{
    private readonly ICustomerRepository _repository = repository;
    private readonly IMapper _mapper = mapper;
    private readonly ILogger<GetCustomerByIdQueryHandler> _logger = logger;

    public async Task<Result<CustomerDto>> Handle(GetCustomerByIdQuery query, CancellationToken ct)
    {
        Customer customer = await _repository.GetCustomerByIdAsync(query.Id, ct);
        if (customer is null)
        {
            GeneralLogError.ArgumentException(
                _logger,
                $"Customer {customer} with ID {query.Id} was not found.",
                default
            );

            return Result<CustomerDto>.Failure(
                new Error(
                    $"Customer {query.Id} not found",
                    ErrorCodes.CustomerNotFound));
        }

        CustomerDto dto = _mapper.Map<CustomerDto>(customer);
        return Result<CustomerDto>.Success(dto);
    }
}
