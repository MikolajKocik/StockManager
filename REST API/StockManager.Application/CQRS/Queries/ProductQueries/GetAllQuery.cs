using MediatR;
using StockManager.Application.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StockManager.Application.CQRS.Queries.ProductQueries
{
    public class GetAllQuery : IRequest<IEnumerable<ProductDto>>
    {
    }
}
