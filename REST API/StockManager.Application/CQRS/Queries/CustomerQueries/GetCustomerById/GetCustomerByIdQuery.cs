using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Dtos.ModelsDto.CustomerDtos;

namespace StockManager.Application.CQRS.Queries.CustomerQueries.GetCustomerById;

public sealed record GetCustomerByIdQuery(
    int Id
    ) : IQuery<CustomerDto>;
