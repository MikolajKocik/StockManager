using MediatR;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common.ResultPattern;

namespace StockManager.Application.Abstractions.CQRS.MediatorAdapter.Command;

public sealed class MediatorCommandAdapterValue<TCommand, TResponse> : IRequestHandler<TCommand, Result<TResponse>>
    where TCommand : ICommand<TResponse>
{
    private readonly ICommandHandler<TCommand, TResponse> _handler;

    public MediatorCommandAdapterValue(ICommandHandler<TCommand, TResponse> handler)
    {
        _handler = handler;
    }

    public Task<Result<TResponse>> Handle(TCommand command, CancellationToken cancellationToken)
        => _handler.Handle(command, cancellationToken);
}
