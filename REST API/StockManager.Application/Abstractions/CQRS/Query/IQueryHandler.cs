using StockManager.Application.Common.ResultPattern;

namespace StockManager.Application.Abstractions.CQRS.Query;

public interface IQueryHandler<in TQuery, TResponse>
    where TQuery : IQuery<TResponse>
{
    Task<Result<TResponse>> Handle(TQuery query, CancellationToken cancellationToken);
}
