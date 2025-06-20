using MediatR;
using StockManager.Application.Common.ResultPattern;

namespace StockManager.Application.Abstractions.CQRS.Command;

public interface ICommand : IBaseCommand, IRequest<Result<Unit>>
{
}

public interface ICommand<TResponse> : IBaseCommand, IRequest<Result<TResponse>>
{
}

// Base marker interface for all command types 
public interface IBaseCommand
{ 
}
