using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Dtos.ModelsDto.CustomerDtos;

namespace StockManager.Application.CQRS.Queries.CustomerQueries.GetCustomers;
public sealed record GetCustomersQuery(int Page = 1, int PageSize = 50)
    : IQuery<IReadOnlyList<CustomerDto>>;
