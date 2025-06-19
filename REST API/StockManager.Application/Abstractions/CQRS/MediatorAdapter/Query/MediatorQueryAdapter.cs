using MediatR;
using StockManager.Application.Abstractions.CQRS.Query;
using StockManager.Application.Common.ResultPattern;

namespace StockManager.Application.Abstractions.CQRS.MediatorAdapter.Query
{
    public class MediatorQueryAdapter<TQuery, TResponse> : IRequestHandler<TQuery, Result<TResponse>>
        where TQuery : IQuery<TResponse>
    {
        private readonly IQueryHandler<TQuery, TResponse> _handler;

        public MediatorQueryAdapter(IQueryHandler<TQuery, TResponse> handler)
        {
            _handler = handler;
        }

        public Task<Result<TResponse>> Handle(TQuery query, CancellationToken cancellationToken)
            => _handler.Handle(query, cancellationToken);
    }
}
