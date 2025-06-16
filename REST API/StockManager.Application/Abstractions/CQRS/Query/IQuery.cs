using MediatR;
using StockManager.Application.Common;

namespace StockManager.Application.Abstractions.CQRS.Query
{
    public interface IQuery<TResponse> : IRequest<Result<TResponse>>
    {
    }
}
