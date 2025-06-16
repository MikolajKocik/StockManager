using MediatR;
using StockManager.Application.Abstractions.CQRS.Command;
using StockManager.Application.Common;

namespace StockManager.Application.Abstractions.CQRS.MediatorAdapter.Command
{
    public sealed class MediatorCommandAdapter<TCommand> : IRequestHandler<TCommand, Result<Unit>>
        where TCommand : ICommand
    {
        private readonly ICommandHandler<TCommand> _handler;

        public MediatorCommandAdapter(ICommandHandler<TCommand> handler)
        {
            _handler = handler;
        }

        public Task<Result<Unit>> Handle(TCommand command, CancellationToken cancellationToken)
            => _handler.Handle(command, cancellationToken);
    }
}
