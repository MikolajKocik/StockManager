using MediatR;
using StockManager.Application.Common.ResultPattern;

namespace StockManager.Application.Abstractions.CQRS.Command;

// 'in' indicates TCommand is used only as input (contravariant)
public interface ICommandHandler<in TCommand> where TCommand : ICommand
{
    Task<Result<Unit>> Handle(TCommand command, CancellationToken cancellationToken);
}

public interface ICommandHandler<in TCommand, TResponse> 
    where TCommand : ICommand<TResponse>
{
    Task<Result<TResponse>> Handle(TCommand command, CancellationToken cancellationToken);

}
